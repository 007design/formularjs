const { Model } = require('objection');

class UserView extends Model {
  static get tableName() {
    return 'userviews';
  }
  static get idColumn() {
    return 'userviews_id';
  }

  static get relationMappings() {
    const User = require('./user');
    const View = require('./view');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'userviews.users_id',
          to: 'users.users_id'
        }
      },
      view: {
        relation: Model.BelongsToOneRelation,
        modelClass: View,
        join: {
          from: 'userviews.views_id',
          to: 'views.views_id'
        }
      }
    }
  }
}

module.exports = UserView;
