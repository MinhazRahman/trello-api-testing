const {
  expect,
} = require('chai');

const TrelloBoardsApi = require('../src/TrelloBoardsApi');
const randomString = require('../util/random-string');
const {
  board,
} = require('../util/factory-board');

describe('Get a list of boards for a user', () => {
  let trelloBoardsApi;
  let boards = [];

  // runs before the first test
  before(async () => {
    trelloBoardsApi = new TrelloBoardsApi();
    // user authentication by providing api key and token
    trelloBoardsApi.authenticate();
  });

  // runs after every tests
  beforeEach(async () => {
    // get the list of boards
    const listOfBoards = await trelloBoardsApi.getListOfBoards();
    // copy the listOfBoards to  boards array
    boards = [...listOfBoards];
    // create an array of deleteBoard promises
    const arrayOfDeleteBoardPromises = boards.map(async (trelloBoard) => {
      await trelloBoardsApi.deleteBoard(trelloBoard.id);
    });
      // delete all the created boards
    await Promise.all(arrayOfDeleteBoardPromises);
    console.log(`BEFORE DELETED ${boards.length} BOARDS`);
    // reset the created boards
    boards = [];
  });

  // runs after every tests
  afterEach(async () => {
    // get the list of boards
    const listOfBoards = await trelloBoardsApi.getListOfBoards();
    // copy the listOfBoards to  boards array
    boards = [...listOfBoards];
    // create an array of deleteBoard promises
    const arrayOfDeleteBoardPromises = boards.map(async (trelloBoard) => {
      await trelloBoardsApi.deleteBoard(trelloBoard.id);
    });
    // delete all the created boards
    await Promise.all(arrayOfDeleteBoardPromises);
    console.log(`AFTER DELETED ${boards.length} BOARDS`);
    // reset the created boards
    boards = [];
  });

  it('Can get a list of boards for a user with only 1 board (GET /1/members/me/boards)', async () => {
    // set query strings
    const boardToBeCreated = board();

    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard(boardToBeCreated);

    // store the created board to boards array for cleaning up after each test
    boards.push(boardCreated);

    // get the list of boards
    const listOfBoards = await trelloBoardsApi.getListOfBoards();

    // verify values from response
    expect(listOfBoards[0]).to.have.property('id').is.a('string');
    expect(listOfBoards[0]).to.have.property('name', listOfBoards[0].name);
    expect(listOfBoards[0]).to.have.property('desc', listOfBoards[0].desc);
  });

  it.only('Can get a list of boards for a user with multiple boards (GET /1/members/me/boards)', async () => {
    // create multiple boards in parallel
    const createdBoards = await Promise.all([
      trelloBoardsApi.createBoard(board()),
      trelloBoardsApi.createBoard(board()),
      trelloBoardsApi.createBoard(board()),
    ]);

    // store the created board to boards array for cleaning up after each test
    boards = [...createdBoards];

    // get a board by id
    const listOfBoards = await trelloBoardsApi.getListOfBoards();

    // verify values from response
    expect(listOfBoards).to.have.lengthOf(createdBoards.length);
  });
});
