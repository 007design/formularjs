const { Model } = require('objection');

class FieldOption extends Model {
  static get tableName() {
    return 'fieldoptions';
  }
  static get idColumn() {
    return 'fieldoptions_id';
  }

  static get relationMappings() {
    const Field = require('./field');

    return {
      field: {
        relation: Model.BelongsToOneRelation,
        modelClass: Field,
        join: {
          from: 'fieldoptions.fields_id',
          to: 'fields.fields_id'
        }
      }
    }
  }

  static get modifiers() {
    return {
      defaultSelects(builder) {
        builder.select('fieldoptions_id', 'fieldoptions_sequence', 'fieldoptions_value');
      }
    };
  }
}

module.exports = FieldOption;
