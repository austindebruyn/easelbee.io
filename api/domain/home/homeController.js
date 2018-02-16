const config = require('../../config');

module.exports.index = function (req, res, next) {
  if (req.user) {
    return res.redirect('/app');
  }

  return res.render('index');
};

module.exports.app = function (req, res, next) {
  if (!req.accepts('html')) {
    return res.status(404);
  }

  if (!req.user) {
    return res.redirect('/');
  }

  async function handle() {
    return res.render('artist', {
      user: await req.user.toJSON(),
      context: {
        sentry: {
          public: config.app.sentry.public
        }
      }
    });
  }
  handle().catch(next);
};
