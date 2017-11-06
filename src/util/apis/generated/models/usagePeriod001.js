/*
 * Code generated by Microsoft (R) AutoRest Code Generator 0.17.0.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the UsagePeriod001 class.
 * @constructor
 * Usage for a single period
 *
 * @member {string} [startTime] Inclusive start time of the usage period
 * 
 * @member {string} [endTime] Exclusive end time of the usage period.
 * 
 * @member {object} [byAccount]
 * 
 * @member {object} [byApp]
 * 
 */
function UsagePeriod001() {
}

/**
 * Defines the metadata of UsagePeriod001
 *
 * @returns {object} metadata of UsagePeriod001
 *
 */
UsagePeriod001.prototype.mapper = function () {
  return {
    required: false,
    serializedName: 'UsagePeriod_0_0_1',
    type: {
      name: 'Composite',
      className: 'UsagePeriod001',
      modelProperties: {
        startTime: {
          required: false,
          serializedName: 'startTime',
          type: {
            name: 'String'
          }
        },
        endTime: {
          required: false,
          serializedName: 'endTime',
          type: {
            name: 'String'
          }
        },
        byAccount: {
          required: false,
          serializedName: 'byAccount',
          type: {
            name: 'Dictionary',
            value: {
                required: false,
                serializedName: 'NumberElementType',
                type: {
                  name: 'Number'
                }
            }
          }
        },
        byApp: {
          required: false,
          serializedName: 'byApp',
          type: {
            name: 'Dictionary',
            value: {
                required: false,
                serializedName: 'ObjectElementType',
                type: {
                  name: 'Dictionary',
                  value: {
                      required: false,
                      serializedName: 'NumberElementType',
                      type: {
                        name: 'Number'
                      }
                  }
                }
            }
          }
        }
      }
    }
  };
};

module.exports = UsagePeriod001;
