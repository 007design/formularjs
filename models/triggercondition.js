const { Model } = require('objection');

class TriggerCondition extends Model {
  static get tableName() {
    return 'triggerconditions';
  }
  static get idColumn() {
    return 'triggerconditions_id';
  }

  static get relationMappings() {
    const Trigger = require('./trigger');
    const ViewField = require('./viewfield');

    return {
      trigger: {
        relation: Model.BelongsToOneRelation,
        modelClass: Trigger,
        join: {
          from: 'triggers.triggers_id',
          to: 'triggerconditions.triggers_id'
        }
      },
      viewfield: {
        relation: Model.BelongsToOneRelation,
        modelClass: ViewField,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'triggerconditions.triggerconditions_target'
        }
      }
    }
  }
}

module.exports = TriggerCondition;