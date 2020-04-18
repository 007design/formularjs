const { Model } = require('objection');

class FieldType extends Model {
  static get tableName() {
    return 'fieldtypes';
  }
  static get idColumn() {
    return 'fieldtypes_id';
  }

  static get relationMappings() {
    const ViewField = require('./viewfield');

    return {
      viewfields: {
        relation: Model.HasManyRelation,
        modelClass: ViewField,
        join: {
          from: 'fieldtypes.fieldtypes_id',
          to: 'viewfields.fieldtypes_id'
        }
      }
    }
  }
}

module.exports = FieldType;