const { expect } = require('chai');

const TrelloBoardsApi = require('../src/TrelloBoardsApi');
const randomString = require('../util/random-string');

describe('Update a board', () => {
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

  it('Can update single property of an existing board by id (PUT /1/boards/:id)', async () => {
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

    // set different set of query parameters to update the board
    const updatedQueryParameters = { ...queryParameters, name: `${randomString()}` };
    // update the board
    const updatedBoard = await trelloBoardsApi.updateBoard(boardCreated.id, updatedQueryParameters);

    // verify values from response
    expect(updatedBoard).to.have.property('id', boardCreated.id);
    expect(updatedBoard).to.have.property('name', updatedQueryParameters.name);
    expect(updatedBoard).to.have.property('desc', boardCreated.desc);
  });
});
