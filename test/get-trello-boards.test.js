const {
  expect,
} = require('chai');

const TrelloBoardsApi = require('../src/TrelloBoardsApi');
const randomString = require('../util/random-string');

describe('Get board by ID', () => {
  let trelloBoardsApi;
  let boards = [];

  // runs before the first test
  before(async () => {
    trelloBoardsApi = new TrelloBoardsApi();
    // user authentication by providing api key and token
    trelloBoardsApi.authenticate();
  });

  // runs after every tests
  afterEach(async () => {
    // create an array of deleteBoard promises
    const arrayOfDeleteBoardPromises = boards.map(async (board) => {
      await trelloBoardsApi.deleteBoard(board.id);
    });
      // delete all the created boards
    await Promise.all(arrayOfDeleteBoardPromises);
    console.log(`DELETED ${boards.length} BOARDS`);
    // reset the created boards
    boards = [];
  });

  it('Can get a board by ID (GET /1/boards/:id)', async () => {
    // set query strings
    const queryParameters = {
      name: `${randomString()}`,
      desc: `${randomString()}`,
      defaultLabels: false,
    };

    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard(queryParameters);

    // store the created board to boards array for cleaning up after each test
    boards.push(boardCreated);

    // get a board by id
    const boardRetrieved = await trelloBoardsApi.getBoard(boardCreated.id);

    // verify values from response
    expect(boardRetrieved).to.have.property('id').is.a('string');
    expect(boardRetrieved).to.have.property('name', queryParameters.name);
    expect(boardRetrieved).to.have.property('desc', queryParameters.desc);
  });

  it.only('Error returned when getting a board with non-existing ID (GET /1/boards/:id)', async () => {
    // set query strings
    const queryParameters = {
      name: `${randomString()}`,
      desc: `${randomString()}`,
      defaultLabels: false,
    };

    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard(queryParameters);

    // delete the board
    const boardDeleted = await trelloBoardsApi.deleteBoard(boardCreated.id);
    expect(boardDeleted).to.have.property('_value', null);

    // try to update the board with id that doesn't exist
    try {
      // get a board by id
      await trelloBoardsApi.getBoard(boardCreated.id);
    } catch (error) {
      expect(error).to.have.property('name', 'StatusCodeError');
      expect(error).to.have.property('statusCode', 404);
    }
  });
});
