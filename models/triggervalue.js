const { Model } = require('objection');

class TriggerValue extends Model {
  static get tableName() {
    return 'triggervalues';
  }
  static get idColumn() {
    return 'triggervalues_id';
  }

  static get relationMappings() {
    const Trigger = require('./trigger');

    return {
      trigger: {
        relation: Model.BelongsToOneRelation,
        modelClass: Trigger,
        join: {
          from: 'triggers.triggers_id',
          to: 'triggervalues.triggers_id'
        }
      }
    }
  }
}

module.exports = TriggerValue;