const { Model } = require('objection');

class ViewOption extends Model {
  static get tableName() {
    return 'viewoptions';
  }
  static get idColumn() {
    return 'viewoptions_id';
  }

  static get relationMappings() {
    const ViewField = require('./viewfield');

    return {
      viewfield: {
        relation: Model.BelongsToOneRelation,
        modelClass: ViewField,
        join: {
          from: 'viewfields.viewfields_id',
          to: 'viewoptions.viewfields_id'
        }
      }
    }
  }
}

module.exports = ViewOption;