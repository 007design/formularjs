const { Model } = require('objection');

class Account extends Model {
  static get tableName() {
    return 'accounts';
  }
  static get idColumn() {
    return 'accounts_id';
  }

  static get relationMappings() {
    const User = require('./user');
    const View = require('./view');

    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'accounts.accounts_id',
          to: 'users.accounts_id'
        }
      },
      views: {
        relation: Model.HasManyRelation,
        modelClass: View,
        join: {
          from: 'accounts.accounts_id',
          to: 'views.accounts_id'
        }
      }
    }
  }
}

module.exports = Account;
