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
 * Initializes a new instance of the NewCrashGroupAlertingEvent class.
 * @constructor
 * New crash group alerting event
 *
 * @member {object} [crashGroupProperties] Properties of new crash group
 * 
 * @member {string} [crashGroupProperties.id]
 * 
 * @member {string} [crashGroupProperties.name]
 * 
 * @member {string} [crashGroupProperties.reason]
 * 
 * @member {string} [crashGroupProperties.url]
 * 
 * @member {string} [crashGroupProperties.appDisplayName]
 * 
 * @member {string} [crashGroupProperties.appPlatform]
 * 
 * @member {string} [crashGroupProperties.appVersion]
 * 
 * @member {array} [crashGroupProperties.stackTrace]
 * 
 */
function NewCrashGroupAlertingEvent() {
  NewCrashGroupAlertingEvent['super_'].call(this);
}

util.inherits(NewCrashGroupAlertingEvent, models['AlertingEvent']);

/**
 * Defines the metadata of NewCrashGroupAlertingEvent
 *
 * @returns {object} metadata of NewCrashGroupAlertingEvent
 *
 */
NewCrashGroupAlertingEvent.prototype.mapper = function () {
  return {
    required: false,
    serializedName: 'NewCrashGroupAlertingEvent',
    type: {
      name: 'Composite',
      className: 'NewCrashGroupAlertingEvent',
      modelProperties: {
        eventTimestamp: {
          required: true,
          serializedName: 'event_timestamp',
          type: {
            name: 'String'
          }
        },
        eventId: {
          required: true,
          serializedName: 'event_id',
          type: {
            name: 'String'
          }
        },
        properties: {
          required: false,
          serializedName: 'properties',
          type: {
            name: 'Object'
          }
        },
        crashGroupProperties: {
          required: false,
          serializedName: 'crash_group_properties',
          type: {
            name: 'Composite',
            className: 'NewCrashGroupAlertingEventCrashGroupProperties'
          }
        }
      }
    }
  };
};

module.exports = NewCrashGroupAlertingEvent;
