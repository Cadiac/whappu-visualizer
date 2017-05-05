const Model = require('objection').Model;

class FeedItems extends Model {

  static get tableName() {
    return 'feed_items';
  }

  // This is only used for validation.
  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        created_at: { type: 'date-time' },
        updated_at: { type: 'date-time' },
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      votes: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/Votes`,
        join: {
          from: 'feed_items.id',
          to: 'votes.feed_item_id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Users`,
        join: {
          from: 'feed_items.user_id',
          to: 'users.id'
        }
      },
    };
  }
}

module.exports = FeedItems;
