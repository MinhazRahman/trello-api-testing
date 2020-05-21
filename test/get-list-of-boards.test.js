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

  async function cleanUp() {
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
    console.log(`DELETED ${boards.length} BOARDS`);
    // reset the created boards
    boards = [];
  }

  // runs after every tests
  beforeEach(async () => {
    // await cleanUp();
  });

  // runs after every tests
  afterEach(async () => {
    await cleanUp();
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
    expect(listOfBoards).to.have.lengthOf(1);
    listOfBoards.forEach((trelloBoard) => {
      expect(trelloBoard).to.have.property('id').is.a('string');
      expect(trelloBoard).to.have.property('name', boardCreated.name);
      expect(trelloBoard).to.have.property('desc', boardCreated.desc);
      expect(trelloBoard).to.have.property('closed', false);
    });
  });

  it('Can get a list of boards for a user with multiple boards (GET /1/members/me/boards)', async () => {
    // create multiple boards in parallel
    const createdBoards = await Promise.all([
      await trelloBoardsApi.createBoard({
        ...board(),
        name: 'board1',
      }),
      await trelloBoardsApi.createBoard({
        ...board(),
        name: 'board2',
      }),
      await trelloBoardsApi.createBoard({
        ...board(),
        name: 'board3',
      }),
    ]);

    // store the created board to boards array for cleaning up after each test
    boards = [...createdBoards];

    // get list of boards
    const listOfBoards = await trelloBoardsApi.getListOfBoards();

    // verify values from response
    expect(listOfBoards).to.have.lengthOf(createdBoards.length);
    listOfBoards.forEach((trelloBoard, index) => {
      expect(trelloBoard).to.have.property('id', createdBoards[index].id);
      expect(trelloBoard).to.have.property('name', createdBoards[index].name);
      expect(trelloBoard).to.have.property('desc', createdBoards[index].desc);
      expect(trelloBoard).to.have.property('closed', false);
    });
  });

  // Note: create three boards, get the selected fields on each board
  it('Can get a list of boards with filtered fields (GET /1/members/me/boards)', async () => {
    // create multiple boards in parallel
    const createdBoards = await Promise.all([
      await trelloBoardsApi.createBoard({
        ...board(),
        name: 'board1',
        starred: true,
      }),
      await trelloBoardsApi.createBoard({
        ...board(),
        name: 'board2',
        starred: false,
      }),
      await trelloBoardsApi.createBoard({
        ...board(),
        name: 'board3',
        starred: true,
      }),
    ]);

    // store the created board to boards array for cleaning up after each test
    boards = [...createdBoards];

    // get list of boards with name, url and starred fields
    const listOfBoards = await trelloBoardsApi.getListOfBoards({
      fields: 'starred,name,url',
    });

    console.log(listOfBoards);
  });

  // Note: create two boards, one starred and another non-starred.
  // Apply "filter" parameter to only get starred boards
  it('Can get filtered list of boards for a user (GET /1/members/me/boards)', async () => {
    // create multiple boards in parallel
    const arrayOfCreatedBoards = await Promise.all([
      await trelloBoardsApi.createBoard({
        ...board(),
        name: 'board1',
        starred: true,
      }, ),
      await trelloBoardsApi.createBoard({
        ...board(),
        name: 'board2',
        starred: false,
      }, ),
    ]);

    console.log(arrayOfCreatedBoards);
    expect(arrayOfCreatedBoards[0]).to.have.property('id');

    // get list of starred boards
    const listOfBoards = await trelloBoardsApi.getListOfBoards();

    console.log(listOfBoards);

    /*     // store the created board to boards array for cleaning up after each test
    boards = [board1, board2];
    console.log(board1);

    // set different set of query parameters to update the board
    const boardToBeUpdated = {
      ...board1,
      starred: true,
    };
    // update the board
    const updatedBoard = await trelloBoardsApi.updateBoard(board1.id, boardToBeUpdated);
    console.log(updatedBoard);

    // get list of starred boards
    const listOfBoards = await trelloBoardsApi.getListOfBoards({
      fields: 'starred',
      filter: 'starred',
    });

    console.log(listOfBoards); */
  });
});
