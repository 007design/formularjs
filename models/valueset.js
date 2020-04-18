const { Model } = require('objection');

class ValueSet extends Model {
  static get tableName() {
    return 'valuesets';
  }
  static get idColumn() {
    return 'valuesets_id';
  }

  static get relationMappings() {
    const Submission = require('./submission');
    const User = require('./user');
    const Value = require('./value');

    return {
      submission: {
        relation: Model.BelongsToOneRelation,
        modelClass: Submission,
        join: {
          from: 'submissions.submissions_id',
          to: 'valuesets.submissions_id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.users_id',
          to: 'valuesets.users_id'
        }
      },
      values: {
        relation: Model.HasManyRelation,
        modelClass: Value,
        join: {
          from: 'values.valuesets_id',
          to: 'valuesets.valuesets_id'
        }
      }
    }
  }
}

module.exports = ValueSet;