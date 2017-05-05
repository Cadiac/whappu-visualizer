const Model = require('objection').Model;

class Users extends Model {

  static get tableName() {
    return 'users';
  }

  // This is only used for validation.
  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        team_id: { type: 'integer' },
        created_at: { type: 'date-time' },
        updated_at: { type: 'date-time' },
        is_banned: { type: 'boolean' }
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      team: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Teams`,
        join: {
          from: 'users.team_id',
          to: 'teams.id'
        }
      },
      votes: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/Votes`,
        join: {
          from: 'users.id',
          to: 'votes.user_id'
        }
      },
      feed_items: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/FeedItems`,
        join: {
          from: 'users.id',
          to: 'feed_items.user_id'
        }
      }
    };
  }
}

module.exports = Users;
