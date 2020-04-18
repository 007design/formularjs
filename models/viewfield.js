const { Model } = require('objection');

class ViewField extends Model {
  static get tableName() {
    return 'viewfields';
  }
  static get idColumn() {
    return 'viewfields_id';
  }

  static get relationMappings() {
    const View = require('./view');
    const Field = require('./field');
    const FieldType = require('./fieldtype');
    const Filter = require('./filter');
    const ViewOption = require('./viewoption');
    const Value = require('./value');
    const Trigger = require('./trigger');
    const TriggerCondition = require('./triggercondition');
    const VisibilityCondition = require('./visibilitycondition')

    return {
      view: {
        relation: Model.BelongsToOneRelation,
        modelClass: View,
        join: {
          from: 'views.views_id',
          to: 'viewfields.views_id'
        }
      },
      field: {
        relation: Model.BelongsToOneRelation,
        modelClass: Field,
        join: {
          from: 'fields.fields_id',
          to: 'viewfields.fields_id'
        }
      },
      fieldtype: {
        relation: Model.BelongsToOneRelation,
        modelClass: FieldType,
        join: {
          from: 'fieldtypes.fieldtypes_id',
          to: 'viewfields.fieldtypes_id'
        }
      },
      filters: {
        relation: Model.HasManyRelation,
        modelClass: Filter,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'filters.filters_target'
        }
      },
      viewoptions: {
        relation: Model.HasManyRelation,
        modelClass: ViewOption,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'viewoptions.viewfields_id'
        }
      },
      values: {
        relation: Model.HasManyRelation,
        modelClass: Value,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'values.viewfields_id'
        }
      },
      triggers: {
        relation: Model.HasManyRelation,
        modelClass: Trigger,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'triggers.viewfields_id'
        }
      },
      triggerconditions: {
        relation: Model.HasManyRelation,
        modelClass: TriggerCondition,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'triggerconditions.triggerconditions_target'
        }
      },
      visibilityconditions: {
        relation: Model.HasManyRelation,
        modelClass: VisibilityCondition,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'visibilityconditions.viewfields_id'
        }
      },
      targets: {
        relation: Model.HasManyRelation,
        modelClass: VisibilityCondition,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'visibilityconditions.visibilityconditions_target'
        }
      }
    }
  }
}

module.exports = ViewField;