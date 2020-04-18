const { Model } = require('objection');

class Filter extends Model {
  static get tableName() {
    return 'filters';
  }
  static get idColumn() {
    return 'filters_id';
  }

  static get relationMappings() {
    const View = require('./view');
    const ViewField = require('./viewfield');

    return {
      view: {
        relation: Model.BelongsToOneRelation,
        modelClass: View,
        join: {
          from: 'views.views_id',
          to: 'filters.views_id'
        }
      },
      viewfield: {
        relation: Model.BelongsToOneRelation,
        modelClass: ViewField,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'filters.filters_target'
        }
      }
    }
  }
}

module.exports = Filter;