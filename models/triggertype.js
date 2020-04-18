const { Model } = require('objection');

class TriggerType extends Model {
  static get tableName() {
    return 'triggertypes';
  }
  static get idColumn() {
    return 'triggertypes_id';
  }

  static get relationMappings() {
    const Trigger = require('./trigger');

    return {
      trigger: {
        relation: Model.BelongsToOneRelation,
        modelClass: Trigger,
        join: {
          from: 'triggers.triggertypes_id',
          to: 'triggertypes.triggertypes_id'
        }
      }
    }
  }
}

module.exports = TriggerType;