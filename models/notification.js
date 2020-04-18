const { Model } = require('objection');

class Notification extends Model {
  static get tableName() {
    return 'notifications';
  }
  static get idColumn() {
    return 'notifications_id';
  }

  static get relationMappings() {
    const View = require('./view');
    const Recipient = require('./recipient');
    const NotificationCondition = require('./notificationcondition');

    return {
      view: {
        relation: Model.BelongsToOneRelation,
        modelClass: View,
        join: {
          from: 'views.views_id',
          to: 'notifications.views_id'
        }
      },
      recipients: {
        relation: Model.HasManyRelation,
        modelClass: Recipient,
        join: {
          from: 'notifications.notifications_id',
          to: 'recipients.notifications_id'
        }
      },
      conditions: {
        relation: Model.HasManyRelation,
        modelClass: NotificationCondition,
        join: {
          from: 'notifications.notifications_id',
          to: 'notificationconditions.notifications_id'
        }
      }
    }
  }
}

module.exports = Notification;
