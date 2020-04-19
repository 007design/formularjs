const { Model } = require('objection');

class Form extends Model {
  static get tableName() {
    return 'forms';
  }
  static get idColumn() {
    return 'forms_id';
  }

  static get relationMappings() {
    const Field = require('./field');
    const View = require('./view');

    return {
      fields: {
        relation: Model.HasManyRelation,
        modelClass: Field,
        join: {
          from: 'forms.forms_id',
          to: 'fields.forms_id'
        }
      },
      views: {
        relation: Model.HasManyRelation,
        modelClass: View,
        join: {
          from: 'forms.forms_id',
          to: 'views.forms_id'
        }
      }
    }
  }

  static get graphs() {
    return {
      edit: '[fields.options]',
      input: '[viewfields.[fieldtype,viewoptions,triggers.[triggertype,triggerconditions,triggervalues],visibilityconditions.target]]',
      dashboard: ''
    }
  }
}

module.exports = Form;
