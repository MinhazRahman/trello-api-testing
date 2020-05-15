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
  afterEach(async () => {
    // get the list of boards
    const listOfBoards = await trelloBoardsApi.getListOfBoards();
    // copy the listOfBoards to  boards array
    boards = [...listOfBoards.slice(0, 2)];
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

  it.only('Can get a list of boards for a user with only 1 board (GET /1/members/me/boards)', async () => {
    // set query strings
    const boardToBeCreated = board();

    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard(boardToBeCreated);

    // store the created board to boards array for cleaning up after each test
    boards.push(boardCreated);

    // get a board by id
    const boardRetrieved = await trelloBoardsApi.getBoard(boardCreated.id);

    // verify values from response
    expect(boardRetrieved).to.have.property('id').is.a('string');
    expect(boardRetrieved).to.have.property('name', boardToBeCreated.name);
    expect(boardRetrieved).to.have.property('desc', boardToBeCreated.desc);
  });
});
