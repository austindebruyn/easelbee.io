const usersController = require('../domain/users/usersController');
const sessionsController = require('../domain/sessions/sessionsController');
const passwordResetsController = require('../domain/passwordResets/passwordResetsController');
const emailPreferencesController = require('../domain/emailPreferences/emailPreferencesController');
const commissionsController = require('../domain/commissions/commissionsController');
const formsController = require('../domain/forms/formsController');
const questionsController = require('../domain/forms/questionsController');
const homeController = require('../domain/home/homeController');
const errorHandler = require('./errorHandler');
const multer = require('multer');

const upload = multer({ dest: 'tmp/uploads/' });

function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    if (req.accepts('html')) {
      return res.redirect('/login');
    }
    return res.status(403).json({ ok: false });
  }
  return next();
}

function ensureAnonymous(req, res, next) {
  if (req.user) {
    if (req.accepts('html')) {
      return res.redirect('/app');
    }
    return res.status(403).json({ ok: false });
  }
  return next();
}

module.exports = function (app) {
  app.get('/', homeController.index);
  app.get('/app', ensureAuthenticated, homeController.app);

  app.get('/login', ensureAnonymous, sessionsController.new);
  app.post('/login', ensureAnonymous, sessionsController.create);
  app.post('/signout', sessionsController.destroy);

  app.get('/passwordResets/new', ensureAnonymous, passwordResetsController.new);
  app.post('/passwordResets', ensureAnonymous, passwordResetsController.create);
  app.get('/passwordResets/complete', ensureAnonymous, passwordResetsController.getComplete);
  app.post('/passwordResets/complete', ensureAnonymous, passwordResetsController.complete);

  app.get('/forms/:slug', formsController.get);
  app.post('/forms/:slug/submit', formsController.submit);

  app.post('/api/users', usersController.create);
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
  app.get('/api/forms/:slug', formsController.getJson);
  app.patch('/api/forms/:id', ensureAuthenticated, formsController.update);
  app.post('/api/forms/:id/questions', ensureAuthenticated, formsController.createQuestion);
  app.delete('/api/forms/:id', ensureAuthenticated, formsController.destroy);
  app.patch('/api/questions/:id', ensureAuthenticated, questionsController.update);
  app.delete('/api/questions/:id', ensureAuthenticated, questionsController.destroy);
  app.put('/api/options/:id/delta', ensureAuthenticated, questionsController.setDelta);
  app.delete('/api/options/:id/delta', ensureAuthenticated, questionsController.destroyDelta);
  app.post('/api/options/:id/attachment', upload.single('file'), ensureAuthenticated, questionsController.createOptionAttachment);

  app.get('*', homeController.app);

  app.use(errorHandler);
};
