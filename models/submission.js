const { Model } = require('objection');

class Submission extends Model {
  static get tableName() {
    return 'submissions';
  }
  static get idColumn() {
    return 'submissions_id';
  }

  static get relationMappings() {
    const User = require('./user');
    const View = require('./view');
    const Value = require('./value');
    const ValueSet = require('./valueset');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'submissions.users_id',
          to: 'users.users_id'
        }
      },
      view: {
        relation: Model.BelongsToOneRelation,
        modelClass: View,
        join: {
          from: 'submissions.views_id',
          to: 'views.views_id'
        }
      },
      values: {
        relation: Model.HasManyRelation,
        modelClass: Value,
        join: {
          from: 'submissions.submissions_id',
          to: 'values.submissions_id'
        }
      },
      valuesets: {
        relation: Model.HasManyRelation,
        modelClass: ValueSet,
        join: {
          from: 'submissions.submissions_id',
          to: 'valuesets.submissions_id'
        }
      }
    }
  }
}

module.exports = Submission;