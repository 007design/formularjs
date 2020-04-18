const { Model } = require('objection');

class Recipient extends Model {
  static get tableName() {
    return 'recipients';
  }
  static get idColumn() {
    return 'recipients_id';
  }

  static get relationMappings() {
    const Notification = require('./notification');

    return {
      notifications: {
        relation: Model.BelongsToOneRelation,
        modelClass: Notification,
        join: {
          from: 'notifications.notifications_id',
          to: 'recipients.notifications_id'
        }
      }
    }
  }
}

module.exports = Recipient;
