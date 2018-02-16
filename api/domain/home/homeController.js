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
    const json = await req.user.toJSON();

    return res.render('app', {
      user: json,
      context: {
        sentry: {
          public: config.app.sentry.public
        }
      }
    });
  }
  handle().catch(next);
};
