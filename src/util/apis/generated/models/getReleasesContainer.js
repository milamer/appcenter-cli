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
 * Initializes a new instance of the GetReleasesContainer class.
 * @constructor
 * @member {array} releases
 * 
 */
function GetReleasesContainer() {
}

/**
 * Defines the metadata of GetReleasesContainer
 *
 * @returns {object} metadata of GetReleasesContainer
 *
 */
GetReleasesContainer.prototype.mapper = function () {
  return {
    required: false,
    serializedName: 'GetReleasesContainer',
    type: {
      name: 'Composite',
      className: 'GetReleasesContainer',
      modelProperties: {
        releases: {
          required: true,
          serializedName: 'releases',
          constraints: {
            MinItems: 1
          },
          type: {
            name: 'Sequence',
            element: {
                required: false,
                serializedName: 'ReleaseWithDistributionGroupElementType',
                type: {
                  name: 'Composite',
                  className: 'ReleaseWithDistributionGroup'
                }
            }
          }
        }
      }
    }
  };
};

module.exports = GetReleasesContainer;
