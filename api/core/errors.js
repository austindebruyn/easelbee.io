class APIError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'APIError';
    this.code = code;
    this.statusCode = 500;
    Object.assign(this, data);
  }

  toJSON() {
    if (this.fields) {
      return { code: this.code, fields: this.fields };
    }
    return { code: this.code };
  }
}

class NotFoundError extends APIError {
  constructor(code, data = {}) {
    super(code, data);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class UnauthorizedError extends APIError {
  constructor(code, data = {}) {
    super(code, data);
    this.name = 'UnauthorizedError';
    this.statusCode = 403;
  }
}

class UnprocessableEntityError extends APIError {
  constructor(code, data = {}) {
    super(code, data);
    this.name = 'UnprocessableEntityError';
    this.statusCode = 422;
  }
}

module.exports = {
  APIError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError
};
