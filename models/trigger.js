const { Model } = require('objection');

class Trigger extends Model {
  static get tableName() {
    return 'triggers';
  }
  static get idColumn() {
    return 'triggers_id';
  }

  static get relationMappings() {
    const ViewField = require('./viewfield');
    const TriggerCondition = require('./triggercondition');
    const TriggerType = require('./triggertype');
    const TriggerValue = require('./triggervalue');

    return {
      viewfield: {
        relation: Model.BelongsToOneRelation,
        modelClass: ViewField,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'triggers.viewfields_id'
        }
      },
      triggertype: {
        relation: Model.BelongsToOneRelation,
        modelClass: TriggerType,
        join: {
          from: 'triggertypes.triggertypes_id',
          to: 'triggers.triggertypes_id'
        }
      },
      triggerconditions: {
        relation: Model.HasManyRelation,
        modelClass: TriggerCondition,
        join: {
          from: 'triggerconditions.triggers_id',
          to: 'triggers.triggers_id'
        }
      },
      triggervalues: {
        relation: Model.HasManyRelation,
        modelClass: TriggerValue,
        join: {
          from: 'triggervalues.triggers_id',
          to: 'triggers.triggers_id'
        }
      }
    }
  }
}

module.exports = Trigger;