const axios = require('axios');
const config = require('../config');

class LynbotAPI {
  send(message) {
    return new Promise((resolve, reject) => {
      const {
        protocol,
        host,
        port,
        password
      } = config.lynbot;

      const body = { message };

      return axios.post(`${protocol}://${host}:${port}/post`, body, {
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

module.exports = LynbotAPI;
