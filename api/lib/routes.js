const usersController = require('../domain/users/usersController');
const sessionsController = require('../domain/sessions/sessionsController');
const passwordResetsController = require('../domain/passwordResets/passwordResetsController');
const emailPreferencesController = require('../domain/emailPreferences/emailPreferencesController');
const commissionsController = require('../domain/commissions/commissionsController');
const formsController = require('../domain/forms/formsController');
const questionsController = require('../domain/forms/questionsController');
const homeController = require('../domain/home/homeController');
const errorHandler = require('./errorHandler');

function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    if (req.accepts('html')) {
      return res.redirect('/');
    }
    return res.status(403).json({ ok: false });
  }
  return next();
}

function ensureAnonymous(req, res, next) {
  if (req.user) {
    if (req.accepts('html')) {
      return res.redirect('/');
    }
    return res.status(403).json({ ok: false });
  }
  return next();
}

module.exports = function (app) {
  app.get('/', homeController.noPath);
  app.get('/app/', homeController.index);

  app.get('/forms/:slug', formsController.get);
  app.post('/forms/:slug/submit', formsController.submit);

  app.post('/login', sessionsController.create);
  app.post('/signout', sessionsController.destroy);
  app.post('/api/users', usersController.create);
  app.post('/api/passwordResets', ensureAnonymous, passwordResetsController.create);
  app.post('/api/passwordResets/complete', ensureAnonymous, passwordResetsController.complete);
  app.get('/api/users/me', ensureAuthenticated, usersController.get);
  app.put('/api/users/me', ensureAuthenticated, usersController.update);
  app.get('/api/users/me/emailPreferences', ensureAuthenticated, emailPreferencesController.get);
  app.patch('/api/users/me/emailPreferences', emailPreferencesController.update);
  app.post('/api/users/me/emailPreferences/sendVerificationEmail', ensureAuthenticated, emailPreferencesController.sendVerificationEmail);
  app.get('/api/users/me/commissions', ensureAuthenticated, commissionsController.index);
  app.post('/api/users/me/commissions', ensureAuthenticated, commissionsController.create);
  app.patch('/api/commissions/:id', ensureAuthenticated, commissionsController.update);
  app.get('/api/commissions/:id/fillout', ensureAuthenticated, commissionsController.getFillout);
  app.get('/api/commissions/:id/events', ensureAuthenticated, commissionsController.getEvents);
  app.get('/api/users/me/forms', ensureAuthenticated, formsController.index);
  app.post('/api/users/me/forms', ensureAuthenticated, formsController.create);
  app.patch('/api/forms/:id', ensureAuthenticated, formsController.update);
  app.post('/api/forms/:id/questions', ensureAuthenticated, formsController.createQuestion);
  app.patch('/api/questions/:id', ensureAuthenticated, questionsController.update);
  app.delete('/api/questions/:id', ensureAuthenticated, questionsController.destroy);
  app.get('*', homeController.index);

  app.use(errorHandler);
};
