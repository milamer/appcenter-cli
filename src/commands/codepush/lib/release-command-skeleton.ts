import { AppCommand, CommandResult, ErrorCodes, failure, hasArg, help, longName, shortName, success, defaultValue } from "../../../util/commandline";
import { CommandArgs } from "../../../util/commandline/command";
import { AppCenterClient, models, clientRequest } from "../../../util/apis";
import { out } from "../../../util/interaction";
import { getUser, DefaultApp } from "../../../util/profile/index";
import { inspect } from "util";
import * as fs from "fs";
import * as pfs from "../../../util/misc/promisfied-fs";
import * as chalk from "chalk";
import { sign, zip } from "../lib/update-contents-tasks";
import { isBinaryOrZip, getLastFolderInPath, moveReleaseFilesInTmpFolder, isDirectory } from "../lib/file-utils";
import { environments } from "../lib/environment";
import { isValidRange, isValidRollout, isValidDeployment } from "../lib/validation-utils";
import { LegacyCodePushRelease }  from "../lib/release-strategy/index";
import { getTokenFromEnvironmentVar } from "../../../util/profile/environment-vars";

const debug = require("debug")("appcenter-cli:commands:codepush:release-skeleton");

export interface ReleaseStrategy {
    release(client: AppCenterClient, app: DefaultApp, deploymentName: string, updateContentsZipPath: string, updateMetadata: {
      appVersion?: string;
      description?: string;
      isDisabled?: boolean;
      isMandatory?: boolean;
      rollout?: number;
    }, token?: string, serverUrl?: string): Promise<void>;
}

export default class CodePushReleaseCommandSkeleton extends AppCommand {
  @help("Deployment to release the update to")
  @shortName("d")
  @longName("deployment-name")
  @defaultValue("Staging")
  @hasArg
  public specifiedDeploymentName: string;

  @help("Description of the changes made to the app in this release")
  @longName("description")
  @hasArg
  public description: string;

  @help("Specifies whether this release should be immediately downloadable")
  @shortName("x")
  @longName("disabled")
  public disabled: boolean;

  @help("Specifies whether this release should be considered mandatory")
  @shortName("m")
  @longName("mandatory")
  public mandatory: boolean;

  @help("Specifies the location of a RSA private key to sign the release with." + chalk.yellow("NOTICE:") + " use it for react native applications only, client SDK on other platforms will be ignoring signature verification for now!")
  @shortName("k")
  @longName("private-key-path")
  @hasArg
  public privateKeyPath: string;

  @help("Specifies the passphrase for the provided RSA private key." + chalk.yellow("NOTICE:") + " WARNING! Using --passphrase via the CLI is insecure and can only be used in combination with an encrypted private key!")
  @shortName("P")
  @longName("passphrase")
  @hasArg
  public privateKeyPassphrase: string;

  @help("When this flag is set, releasing a package that is identical to the latest release will produce a warning instead of an error")
  @longName("disable-duplicate-release-error")
  public disableDuplicateReleaseError: boolean;

  @help("Percentage of users this release should be available to")
  @shortName("r")
  @longName("rollout")
  @defaultValue("100")
  @hasArg
  public specifiedRollout: string;

  protected rollout: number;

  // We assume that if this field is assigned than it is already validated (help us not to validate twice).
  protected deploymentName: string;

  protected updateContentsPath: string;

  protected targetBinaryVersion: string;

  private readonly releaseStrategy: ReleaseStrategy;

  constructor(args: CommandArgs) {
    super(args);

    // Сurrently use old service due to we have limitation of 1MB payload limit through bifrost service
    this.releaseStrategy = new LegacyCodePushRelease();
  }

  public async run(client: AppCenterClient): Promise<CommandResult> {
    throw new Error("For dev purposes only!");
  }

  protected async release(client: AppCenterClient): Promise<CommandResult> {
    this.rollout = Number(this.specifiedRollout);

    const validationResult: CommandResult =  await this.validate(client);
    if (!validationResult.succeeded) { return validationResult; }

    this.deploymentName = this.specifiedDeploymentName;

    if (this.privateKeyPath) {
      const appInfo = (await out.progress("Getting app info...", clientRequest<models.AppResponse>(
        (cb) => client.apps.get(this.app.ownerName, this.app.appName, cb)))).result;
      const platform = appInfo.platform.toLowerCase();

      // In React-Native case we should add "CodePush" name folder as root for relase files for keeping sync with React Native client SDK.
      // Also single file also should be in "CodePush" folder.
      if (platform === "react-native" && (getLastFolderInPath(this.updateContentsPath) !== "CodePush" || !isDirectory(this.updateContentsPath))) {
        await moveReleaseFilesInTmpFolder(this.updateContentsPath).then((tmpPath: string) => { this.updateContentsPath = tmpPath; });
      }

      await sign(this.privateKeyPath, this.updateContentsPath, this.privateKeyPassphrase);
    }

    const updateContentsZipPath = await zip(this.updateContentsPath);

    try {
      const app = this.app;
      const serverUrl = this.getServerUrl();
      const token = this.token || getTokenFromEnvironmentVar() || await getUser().accessToken;

      await out.progress("Creating CodePush release...",  this.releaseStrategy.release(client, app, this.deploymentName, updateContentsZipPath, {
        appVersion: this.targetBinaryVersion,
        description: this.description,
        isDisabled: this.disabled,
        isMandatory: this.mandatory,
        rollout: this.rollout
      }, token, serverUrl));

      out.text(`Successfully released an update containing the "${this.updateContentsPath}" `
        + `${fs.lstatSync(this.updateContentsPath).isDirectory() ? "directory" : "file"}`
        + ` to the "${this.deploymentName}" deployment of the "${this.app.appName}" app.`);

      return success();
    } catch (error) {
      if (error.response && error.response.statusCode === 409 && this.disableDuplicateReleaseError) {
        // 409 (Conflict) status code means that uploaded package is identical
        // to the contents of the specified deployment's current release
        console.warn(chalk.yellow("[Warning] " + error.response.body));
        return success();
      } else {
        debug(`Failed to release a CodePush update - ${inspect(error)}`);
        return failure(ErrorCodes.Exception, error.response ? error.response.body : error);
      }
    } finally {
      await pfs.rmDir(updateContentsZipPath);
    }
  }

  private getServerUrl(): string | undefined {
    const environment = environments(this.getEnvironmentName());
    return environment && environment.managementEndpoint;
  }

  private getEnvironmentName(): string | undefined {
    if (this.environmentName) {
      return this.environmentName;
    }

    const user = getUser();
    if (user) {
      return user.environment;
    }
  }

  private async validate(client: AppCenterClient): Promise<CommandResult> {
    if (isBinaryOrZip(this.updateContentsPath)) {
      return failure(ErrorCodes.InvalidParameter, "It is unnecessary to package releases in a .zip or binary file. Please specify the direct path to the update content's directory (e.g. /platforms/ios/www) or file (e.g. main.jsbundle).");
    }

    if (!isValidRange(this.targetBinaryVersion)) {
      return failure(ErrorCodes.InvalidParameter, "Invalid binary version(s) for a release.");
    }

    if (!Number.isSafeInteger(this.rollout) || !isValidRollout(this.rollout)) {
      return failure(ErrorCodes.InvalidParameter, `Rollout value should be integer value between ${chalk.bold("0")} or ${chalk.bold("100")}.`);
    }

    if (!this.deploymentName && !(await isValidDeployment(client, this.app, this.specifiedDeploymentName))) {
      return failure(ErrorCodes.InvalidParameter, `Deployment "${this.specifiedDeploymentName}" does not exist.`);
    }

    return success();
  }
}
