const { Model } = require('objection');

class View extends Model {
  static get tableName() {
    return 'views';
  }
  static get idColumn() {
    return 'views_id';
  }

  static get relationMappings() {
    const Account = require('./account');
    const Form = require('./form');
    const Notification = require('./notification');
    const UserView = require('./userview');
    const Filter = require('./filter');
    const ViewEvent = require('./viewevent');
    const ViewField = require('./viewfield');
    const Submission = require('./submission');

    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'views.accounts_id',
          to: 'accounts.accounts_id'
        }
      },
      form: {
        relation: Model.BelongsToOneRelation,
        modelClass: Form,
        join: {
          from: 'views.forms_id',
          to: 'forms.forms_id'
        }
      },
      notifications: {
        relation: Model.HasManyRelation,
        modelClass: Notification,
        join: {
          from: 'views.views_id',
          to: 'notifications.views_id'
        }
      },
      viewevents: {
        relation: Model.HasManyRelation,
        modelClass: ViewEvent,
        join: {
          from: 'views.views_id',
          to: 'viewevents.views_id'
        }
      },
      viewfields: {
        relation: Model.HasManyRelation,
        modelClass: ViewField,
        join: {
          from: 'views.views_id',
          to: 'viewfields.views_id'
        }
      },
      userviews: {
        relation: Model.HasManyRelation,
        modelClass: UserView,
        join: {
          from: 'views.views_id',
          to: 'userviews.views_id'
        }
      },
      filters: {
        relation: Model.HasManyRelation,
        modelClass: Filter,
        join: {
          from: 'views.views_id',
          to: 'filters.views_id'
        }
      },
      submissions: {
        relation: Model.HasManyRelation,
        modelClass: Submission,
        join: {
          from: 'views.views_id',
          to: 'submissions.views_id'
        }
      }
    }
  }

  // static get modifiers() {
  //   return {
  //     input(builder) {
  //       builder.select('views_name', 'views_alias','views_submitText');
  //     }
  //   };
  // }

  static get graphs() {
    return {
      input: '[viewfields.[fieldtype,viewoptions,triggers.[triggertype,triggerconditions,triggervalues],visibilityconditions.target]]',
      edit: '',
      dashboard: ''
    }
  }
}

module.exports = View;
