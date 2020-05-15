const {
  expect,
} = require('chai');

const TrelloBoardsApi = require('../src/TrelloBoardsApi');
const randomString = require('../util/random-string');
const {
  board,
} = require('../util/factory-board');

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
    const arrayOfDeleteBoardPromises = boards.map(async (trelloBoard) => {
      await trelloBoardsApi.deleteBoard(trelloBoard.id);
    });
    // delete all the created boards
    await Promise.all(arrayOfDeleteBoardPromises);
    console.log(`DELETED ${boards.length} BOARDS`);
    // reset the created boards
    boards = [];
  });

  it('Can update single property of an existing board by id (PUT /1/boards/:id)', async () => {
    // set query strings
    const boardToBeCreated = board();

    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard(boardToBeCreated);

    // store the created board to boards array for cleaning up after each test
    boards.push(boardCreated);

    // set different set of query parameters to update the board
    const boardToBeUpdated = {
      ...boardToBeCreated,
      name: `${randomString()}`,
    };
    // update the board
    const updatedBoard = await trelloBoardsApi.updateBoard(boardCreated.id, boardToBeUpdated);

    // verify values from response
    expect(updatedBoard).to.have.property('id', boardCreated.id);
    expect(updatedBoard).to.have.property('name', boardToBeUpdated.name);
    expect(updatedBoard).to.have.property('desc', boardCreated.desc);
  });

  it('Can update multiple properties of a board by id (PUT /1/boards/:id)', async () => {
    // set query strings
    const boardToBeCreated = board();

    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard(boardToBeCreated);

    // store the created board to boards array for cleaning up after each test
    boards.push(boardCreated);

    // set different set of query parameters to update the board, (update name and description)
    const boardToBeUpdated = {
      ...boardToBeCreated,
      name: `${randomString()}`,
      desc: `${randomString()}`,
    };
    // update the board
    const updatedBoard = await trelloBoardsApi.updateBoard(boardCreated.id, boardToBeUpdated);

    // verify values from response
    expect(updatedBoard).to.have.property('id', boardCreated.id);
    expect(updatedBoard).to.have.property('name', boardToBeUpdated.name);
    expect(updatedBoard).to.have.property('desc', boardToBeUpdated.desc);
  });

  it("Error returned when updating a board with the ID that doesn't exist (PUT /1/boards/:id)", async () => {
    // set query strings
    const boardToBeCreated = board();

    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard(boardToBeCreated);

    // delete the board
    const boardDeleted = await trelloBoardsApi.deleteBoard(boardCreated.id);
    expect(boardDeleted).to.have.property('_value', null);

    // set different set of query parameters to update the board, (update name and description)
    const boardToBeUpdated = {
      ...boardToBeCreated,
      name: `${randomString()}`,
      desc: `${randomString()}`,
    };

    // try to update the board with id that doesn't exist
    try {
      await trelloBoardsApi.updateBoard(boardCreated.id, boardToBeUpdated);
    } catch (error) {
      expect(error).to.have.property('name', 'StatusCodeError');
      expect(error).to.have.property('statusCode', 404);
    }
  });
});
