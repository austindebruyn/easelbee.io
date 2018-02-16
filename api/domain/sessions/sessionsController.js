const auth = require('../../services/auth');
const LynbotAPI = require('../../lib/LynbotAPI');

module.exports.new = function (req, res, next) {
  return res.render('login', { errors: null });
};

module.exports.create = function (req, res, next) {
  auth.authenticate(function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).render('login', {
        errors: ['Wrong email or password.']
      });
    }

    req.login(user, function (err) {
      if (err) return next(err);

      async function handle() {
        const message = `__${user.email}__ just signed in.`;
        await new LynbotAPI().send(message);

        return res.send('You are now logged in.');
      }
      handle().catch(next);
    });
  })(req, res, next);
};

module.exports.destroy = function (req, res) {
  req.logout();

  if (req.accepts('html')) {
    return res.send('You are now logged out.');
  }

  return res.json({ ok: true });
};
