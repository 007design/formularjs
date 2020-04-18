const { Model } = require('objection');

class NotificationCondition extends Model {
  static get tableName() {
    return 'notificationconditions';
  }
  static get idColumn() {
    return 'notificationconditions_id';
  }

  static get relationMappings() {
    const Notification = require('./notification');
    const Field = require('./field');

    return {
      notification: {
        relation: Model.BelongsToOneRelation,
        modelClass: Notification,
        join: {
          from: 'notifications.notifications_id',
          to: 'notificationconditions.notifications_id'
        }
      },
      field: {
        relation: Model.BelongsToOneRelation,
        modelClass: Field,
        join: {
          from: 'fields.fields_id',
          to: 'notificationconditions.notificationconditions_target'
        }
      }
    }
  }
}

module.exports = NotificationCondition;
