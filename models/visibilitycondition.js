const { Model } = require('objection');

class VisibilityCondition extends Model {
  static get tableName() {
    return 'visibilityconditions';
  }
  static get idColumn() {
    return 'visibilityconditions_id';
  }

  static get relationMappings() {
    const ViewField = require('./viewfield');

    return {
      viewfield: {
        relation: Model.BelongsToOneRelation,
        modelClass: ViewField,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'visibilityconditions.viewfields_id'
        }
      },
      target: {
        relation: Model.BelongsToOneRelation,
        modelClass: ViewField,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'visibilityconditions.visibilityconditions_target'
        }
      }
    }
  }
}

module.exports = VisibilityCondition;