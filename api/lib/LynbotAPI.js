const axios = require('axios');
const config = require('../config');

class LynbotAPI {
  constructor() {
  }

  send(message) {
    return new Promise((resolve, reject) => {
      const {
        protocol,
        host,
        port,
        password
      } = config.lynbot;

      const body = { message };

      return new axios.post(`${protocol}://${host}:${port}/post`, body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': password
        }
      })
        .then(resolve)
        .catch(reject);
    });
  }
}
