const config = require('../config');
const Raven = require('raven');
const winston = require('winston');
const { APIError } = require('../core/errors');

module.exports = function errorHandler(err, req, res, next) {
  winston.log('error', err);
  console.log(err);
  if (config.app.sentry.secret) {
    Raven.captureException(err);
  }

  if (req.accepts('html')) {
    return next(err);
  }

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      ok: false,
      ...err.toJSON()
    });
  }

  return res.status(500).json({ ok: false });
};
