const Model = require('objection').Model;

class Teams extends Model {

  static get tableName() {
    return 'teams';
  }

  // This is only used for validation.
  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        city_id: { type: 'integer' },
        created_at: { type: 'date-time' },
        updated_at: { type: 'date-time' },
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/Users`,
        join: {
          from: 'teams.id',
          to: 'users.team_id'
        }
      }
    };
  }
}

module.exports = Teams;
