require('dotenv').config();
const request = require('request-promise');

const { TRELLO_HOST, TRELLO_API_KEY, TRELLO_API_TOKEN } = process.env;

class TrelloBoardsApi {
  /**
   *Creates an instance of TrelloBoardsApi.
   * @memberof TrelloBoardsApi
   */
  constructor() {
    this.host = TRELLO_HOST;
    this.request = request.defaults({
      qs: {
        key: null, // -> uri + '?key=xxxxx%20xxxxx'
        token: null, // -> uri + '?token=xxxxx%20xxxxx'
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Request-Promise',
      },
      json: true, // Automatically parses the JSON string in the response
      followAllRedirects: true,
    });
  }

  /**
   * authenticate - Authenticates API by setting an API key to the authorization header
   * @param {String} apiKey (OPTIONAL) api key override,
   * default API key from TRELLO_API_KEY env variable
   * will be used if apiKey is not supplied
   */
  authenticate(apiKey = TRELLO_API_KEY, apiToken = TRELLO_API_TOKEN) {
    this.request = request.defaults({
      qs: {
        key: apiKey, // -> uri + '?key=xxxxx%20xxxxx'
        token: apiToken, // -> uri + '?token=xxxxx%20xxxxx'
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Request-Promise',
      },
      json: true, // Automatically parses the JSON string in the response
      followAllRedirects: true,
    });
  }

  /**
   * @param {*} queryString
   * @returns
   * @memberof TrelloBoardsApi
   */
  createBoard(queryStrings = {}) {
    return this.request.post({
      url: `${this.host}/1/boards/`,
      qs: queryStrings,
    });
  }
}

// export TrelloBoardsApi class
module.exports = TrelloBoardsApi;
