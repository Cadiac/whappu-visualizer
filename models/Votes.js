const Model = require('objection').Model;

class Votes extends Model {

  static get tableName() {
    return 'votes';
  }

  // This is only used for validation.
  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        value: { type: 'integer' },
        user_id: { type: 'integer' },
        feed_item_id: { type: 'integer' },
        created_at: { type: 'date-time' },
        updated_at: { type: 'date-time' },
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Users`,
        join: {
          from: 'votes.user_id',
          to: 'users.id'
        }
      },
      feed_item: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/FeedItems`,
        join: {
          from: 'votes.feed_item_id',
          to: 'feed_items.id'
        }
      }
    };
  }
}

module.exports = Votes;
