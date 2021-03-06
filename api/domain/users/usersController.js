const createUser = require('./createUser');
const updateUser = require('./updateUser');

module.exports.new = function (req, res, next) {
  return res.render('signup', { errors: null });
};

module.exports.create = function (req, res, next) {
  const {
    displayName,
    email,
    password,
    password2
  } = req.body;

  return createUser.createUser({
    displayName, email, password, password2
  })
    .then(function (user) {
      req.login(user, function (err) {
        if (err) return next(err);

        return res.send('You are now signed in.');
      });
    })
    .catch(function (err) {
      if (err.name === 'UserCreationError') {
        return res.status(422).render('signup', { errors: [err.code] });
        // return res.status(422).json({ ok: false, errors: [err.toJSON()] });
      }
      return next(err);
    });
};

module.exports.get = function (req, res, next) {
  return req.user.toJSON(req.user)
    .then(user => res.json(user))
    .catch(next);
};

module.exports.update = function (req, res, next) {
  return updateUser.updateUser({
    user: req.user,
    attributes: req.body
  })
    .then(user => user.toJSON(req.user))
    .then(function (user) {
      return res.json({ ok: true, user });
    })
    .catch(function (err) {
      if (err.name === 'UserUpdateError') {
        return res.status(422).json({ ok: false, errors: [err.toJSON()] });
      }
      return next(err);
    });
};
