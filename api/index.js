const Users = require('./routes/users');

exports.register = (plugin, options, next) => {
  plugin.route([
    { method: 'GET', path: '/users', config: Users.getNodes },
  ]);

  next();
};

exports.register.attributes = {
  name: 'api',
};
