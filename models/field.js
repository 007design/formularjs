const { Model } = require('objection');

class Field extends Model {
  static get tableName() {
    return 'fields';
  }
  static get idColumn() {
    return 'fields_id';
  }

  static get relationMappings() {
    const Form = require('./form');
    const FieldOption = require('./fieldoption');
    const EventCondition = require('./eventcondition');
    const NotificationCondition = require('./notificationcondition');
    const Value = require('./value');
    const ViewField = require('./viewfield');

    return {
      form: {
        relation: Model.BelongsToOneRelation,
        modelClass: Form,
        join: {
          from: 'fields.forms_id',
          to: 'forms.forms_id'
        }
      },
      options: {
        relation: Model.HasManyRelation,
        modelClass: FieldOption,
        join: {
          from: 'fields.fields_id',
          to: 'fieldoptions.fields_id'
        }
      },
      eventconditions: {
        relation: Model.HasManyRelation,
        modelClass: EventCondition,
        join: {
          from: 'fields.fields_id',
          to: 'eventconditions.eventconditions_target'
        }
      },
      notificationconditions: {
        relation: Model.HasManyRelation,
        modelClass: NotificationCondition,
        join: {
          from: 'fields.fields_id',
          to: 'notificationconditions.notificationconditions_target'
        }
      },
      values: {
        relation: Model.HasManyRelation,
        modelClass: Value,
        join: {
          from: 'fields.fields_id',
          to: 'values.fields_id'
        }
      },
      viewFields: {
        relation: Model.HasManyRelation,
        modelClass: ViewField,
        join: {
          from: 'fields.fields_id',
          to: 'viewfields.fields_id'
        }
      }
    }
  }
}

module.exports = Field;
