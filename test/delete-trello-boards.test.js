const {
  expect,
} = require('chai');

const TrelloBoardsApi = require('../src/TrelloBoardsApi');
const randomString = require('../util/random-string');
const {
  board,
} = require('../util/factory-board');

describe('Delete board by ID', () => {
  let trelloBoardsApi;
  let boards = [];


  // runs before the first test
  before(async () => {
    trelloBoardsApi = new TrelloBoardsApi();

    trelloBoardsApi.authenticate();
  });

  async function cleanUp() {
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
  afterEach(async () => {
    await cleanUp();
  });

  it.only('Can delete a board by ID (DELETE /1/boards/:id)', async () => {
    // create multiple boards in parallel
    const [board1, board2] = await Promise.all([
      await trelloBoardsApi.createBoard({
        ...board(),
        name: 'board1',
      }),
      await trelloBoardsApi.createBoard({
        ...board(),
        name: 'board2',
      }),
    ]);

    // store the created board to boards array for cleaning up after each test
    boards.push(board2);

    // delete a board by id
    const response = await trelloBoardsApi.deleteBoard(board1.id);
    expect(response).to.have.property('_value', null);

    // will throw error if we try to delete the deleted board again
    try {
      await trelloBoardsApi.deleteBoard(board1.id);
    } catch (error) {
      expect(error).to.have.property('name', 'StatusCodeError');
      expect(error).to.has.property('statusCode', 404);
    }
  });
  it('Error returned when deleting an already deleted board (DELETE /1/boards/:id)', async () => {});
});
