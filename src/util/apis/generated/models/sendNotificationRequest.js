/*
 * Code generated by Microsoft (R) AutoRest Code Generator 0.17.0.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

var models = require('./index');

var util = require('util');

/**
 * @class
 * Initializes a new instance of the SendNotificationRequest class.
 * @constructor
 * @member {array} userIds user list to send email notification
 * 
 * @member {object} emailContents latest email content
 * 
 * @member {string} [emailContents.releaseId]
 * 
 * @member {string} [emailContents.appName]
 * 
 * @member {string} [emailContents.platform]
 * 
 * @member {string} [emailContents.build]
 * 
 * @member {string} [emailContents.version]
 * 
 * @member {string} [emailContents.installLink]
 * 
 */
function SendNotificationRequest() {
}

/**
 * Defines the metadata of SendNotificationRequest
 *
 * @returns {object} metadata of SendNotificationRequest
 *
 */
SendNotificationRequest.prototype.mapper = function () {
  return {
    required: false,
    serializedName: 'SendNotificationRequest',
    type: {
      name: 'Composite',
      className: 'SendNotificationRequest',
      modelProperties: {
        userIds: {
          required: true,
          serializedName: 'userIds',
          type: {
            name: 'Sequence',
            element: {
                required: false,
                serializedName: 'StringElementType',
                type: {
                  name: 'String'
                }
            }
          }
        },
        emailContents: {
          required: true,
          serializedName: 'emailContents',
          type: {
            name: 'Composite',
            className: 'SendNotificationRequestEmailContents'
          }
        }
      }
    }
  };
};

module.exports = SendNotificationRequest;
