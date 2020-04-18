const { Model } = require('objection');

class Value extends Model {
  static get tableName() {
    return 'values';
  }
  static get idColumn() {
    return 'values_id';
  }

  static get relationMappings() {
    const Field = require('./field');
    const ViewField = require('./viewfield');
    const Submission = require('./submission');
    const ValueSet = require('./valueset');

    return {
      field: {
        relation: Model.BelongsToOneRelation,
        modelClass: Field,
        join: {
          from: 'fields.fields_id',
          to: 'values.fields_id'
        }
      },
      viewfield: {
        relation: Model.BelongsToOneRelation,
        modelClass: ViewField,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'values.viewfields_id'
        }
      },
      submission: {
        relation: Model.BelongsToOneRelation,
        modelClass: Submission,
        join: {
          from: 'submissions.submissions_id',
          to: 'values.submissions_id'
        }
      },
      valueset: {
        relation: Model.BelongsToOneRelation,
        modelClass: ValueSet,
        join: {
          from: 'valuesets.valuesets_id',
          to: 'values.valuesets_id'
        }
      }
    }
  }
}

module.exports = Value;