/*
 * Code generated by Microsoft (R) AutoRest Code Generator 0.17.0.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the ItunesTeamsResponse class.
 * @constructor
 * Itunes teams details .
 *
 * @member {string} [teamId] Itunes team id.
 * 
 * @member {string} [teamName] Itunes Team Name
 * 
 */
function ItunesTeamsResponse() {
}

/**
 * Defines the metadata of ItunesTeamsResponse
 *
 * @returns {object} metadata of ItunesTeamsResponse
 *
 */
ItunesTeamsResponse.prototype.mapper = function () {
  return {
    required: false,
    serializedName: 'ItunesTeamsResponse',
    type: {
      name: 'Composite',
      className: 'ItunesTeamsResponse',
      modelProperties: {
        teamId: {
          required: false,
          serializedName: 'teamId',
          type: {
            name: 'String'
          }
        },
        teamName: {
          required: false,
          serializedName: 'teamName',
          type: {
            name: 'String'
          }
        }
      }
    }
  };
};

module.exports = ItunesTeamsResponse;
