const { Model } = require('objection');

class EventCondition extends Model {
  static get tableName() {
    return 'eventconditions';
  }
  static get idColumn() {
    return 'eventconditions_id';
  }

  static get relationMappings() {
    const ViewEvent = require('./viewevent');
    const Field = require('./field');

    return {
      viewevents: {
        relation: Model.HasManyRelation,
        modelClass: ViewEvent,
        join: {
          from: 'eventconditions.viewevents_id',
          to: 'viewevents.viewevents_id'
        }
      },
      target: {
        relation: Model.BelongsToOneRelation,
        modelClass: Field,
        join: {
          from: 'eventconditions.eventconditions_target',
          to: 'fields.fields_id'
        }
      }
    }
  }
}

module.exports = EventCondition;