const { Model } = require('objection');

class ViewEvent extends Model {
  static get tableName() {
    return 'viewevents';
  }
  static get idColumn() {
    return 'viewevents_id';
  }

  static get relationMappings() {
    const View = require('./view');
    const EventCondition = require('./eventcondition');

    return {
      view: {
        relation: Model.BelongsToOneRelation,
        modelClass: View,
        join: {
          from: 'views.views_id',
          to: 'viewevents.views_id'
        }
      },
      conditions: {
        relation: Model.HasManyRelation,
        modelClass: EventCondition,
        join: {
          from: 'eventconditions.viewevents_id',
          to: 'viewevents.viewevents_id'
        }
      }
    }
  }
}

module.exports = ViewEvent;