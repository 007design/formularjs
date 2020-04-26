  const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }
  static get idColumn() {
    return 'users_id';
  }

  static get relationMappings() {
    const Account = require('./account');
    const UserView = require('./userview');
    const Submission = require('./submission');
    const ValueSet = require('./valueset');

    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'users.accounts_id',
          to: 'accounts.accounts_id'
        }
      },
      userviews: {
        relation: Model.HasManyRelation,
        modelClass: UserView,
        join: {
          from: 'userviews.users_id',
          to: 'users.users_id'
        }
      },
      submissions: {
        relation: Model.HasManyRelation,
        modelClass: Submission,
        join: {
          from: 'submissions.users_id',
          to: 'users.users_id'
        }
      },
      valuesets: {
        relation: Model.HasManyRelation,
        modelClass: ValueSet,
        join: {
          from: 'valuesets.users_id',
          to: 'users.users_id'
        }
      }
    }
  }

  static get graphs() {
    return {
      login: '[userviews]'
    }
  }
}

module.exports = User;
