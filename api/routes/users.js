const logger = require('winston');
const Boom = require('boom');
const _ = require('lodash');
// const BPromise = require('bluebird');

const Model = require('objection').Model;
const config = require('../../knexfile')[process.env.NODE_ENV];
const knex = require('knex')(config);

Model.knex(knex);

// database models
const Users = require('../../models/Users');
// const FeedItems = require('./models/FeedItems');
// const Teams = require('./models/Teams');
// const Votes = require('./models/Votes');
const TRE_OFFSET = -2000;
const HKI_OFFSET = 2000;
const SPACING = 500;

module.exports.getNodes = {
  description: 'Get users and their links by votes',
  handler(request, reply) {
    const data = {
      nodes: [],
      upvoteLinks: [],
      downvoteLinks: [],
    };

    return Users
      .query()
      .eager('[votes.[feed_item], team]')
      .then(users =>
        users.map(user => ({
          user,
          upvotes: user.votes
            .filter(vote => vote.value === 1)
            .map(vote => vote.feed_item.user_id),
          downvotes: user.votes
            .filter(vote => vote.value === -1)
            .map(vote => vote.feed_item.user_id),
        }))
      )
      .then(results => results.forEach((result) => {
        data.nodes.push({
          id: Number(result.user.id),
          label: result.user.name,
          upvotes_to: result.upvotes.length,
          downvotes_to: result.downvotes.length,
          group: result.user.team.name,
          value: result.upvotes.length,
          x: result.user.team_id < 16 ?
            TRE_OFFSET + (((result.user.team_id - 1) % 4) * SPACING) + _.random(-200, 200, true) :
            HKI_OFFSET - (((result.user.team_id - 16) % 5) * SPACING) + _.random(-200, 200, true),
          y: result.user.team_id < 16 ?
            Math.floor(((result.user.team_id - 1) % 16) / 4) * SPACING + _.random(-200, 200, true) :
            Math.floor(((result.user.team_id - 16) % 25) / 5) * SPACING + _.random(-200, 200, true)
        });
        result.upvotes.forEach((upvote) => {
          const userId = Number(result.user.id);
          if (upvote !== userId) {
            // Already upvoted the same user? Remove these to improve frontend perf drastically
            data.upvoteLinks.push({ from: Number(result.user.id), to: upvote });
          }
        });
        result.downvotes.forEach((downvote) => {
          const userId = Number(result.user.id);
          if (downvote !== userId) {
            data.downvoteLinks.push({ from: Number(result.user.id), to: downvote });
            /* if (!data.downvoteLinks.some(link => link.from === userId && link.to === downvote)) {
            }*/
          }
        });
      }))
      .then(() => {
        // Filter users that have not been upvoted and have not upvoted by themselves
        const filtered = data.nodes.filter(user =>
          data.upvoteLinks.some(link =>
            link.from === user.id || link.to === user.id
          )
        );
        const withVotes = filtered.map((user) => {
          const upvotes = data.upvoteLinks.filter(link =>
            link.to === user.id
          );

          const downvotes = data.downvoteLinks.filter(link =>
            link.to === user.id
          );

          const userWithVotes = user;

          userWithVotes.value = upvotes.length - downvotes.length;
          userWithVotes.title = (
            `${userWithVotes.label} - ${userWithVotes.group}, id: ${userWithVotes.id} <br>` +
            `Score: ${userWithVotes.value} </br>` +
            `Votes sent: +${userWithVotes.upvotes_to}/-${userWithVotes.downvotes_to} </br>` +
            `Votes received: +${upvotes.length}/-${downvotes.length} </br>`
          );

          return userWithVotes;
        });

        data.nodes = withVotes;
      })
      .then(() => logger.info('Gathered links'))
      .then(() => logger.info('Users', data.nodes.length))
      .then(() => logger.info('upvoteLinks', data.upvoteLinks.length))
      .then(() => logger.info('downvoteLinks', data.downvoteLinks.length))
      .then(() => reply(data))
      .catch(err => reply(Boom.badImplementation('Fetching users failed', err)));
  },
};
