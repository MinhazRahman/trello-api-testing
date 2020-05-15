const { expect } = require('chai');

const TrelloBoardsApi = require('../src/TrelloBoardsApi');
const randomString = require('../util/random-string');
const {
  board,
} = require('../util/factory-board');

describe('Create a board', () => {
  let trelloBoardsApi;
  let boards = [];

  // runs before the first test
  before(async () => {
    trelloBoardsApi = new TrelloBoardsApi();

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

  it('Can create a new board by only passing required parameters (POST /1/boards/)', async () => {
    // query strings
    const name = `${randomString()}`;
    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard({
      name: name,
    });

    // store the created board to boards array for cleaning up after each test
    boards.push(boardCreated);

    // verify values from the response
    expect(boardCreated).to.have.property('id').to.be.a('string');
    expect(boardCreated).to.have.property('name', name);
    expect(boardCreated, 'Description should be empty').to.have.property('desc', '');
    expect(boardCreated, 'descData should be null').to.have.property('descData', null);
    expect(boardCreated).to.have.property('closed', false);
    expect(boardCreated).to.have.property('idOrganization', null);
    expect(boardCreated).to.have.property('idEnterprise', null);

    expect(boardCreated.prefs).to.property('permissionLevel', 'private');
    expect(boardCreated.prefs).to.property('voting', 'disabled');
    expect(boardCreated.prefs).to.property('comments', 'members');
    expect(boardCreated.prefs).to.property('invitations', 'members');
    expect(boardCreated.prefs).to.property('selfJoin', true);
    expect(boardCreated.prefs).to.property('cardCovers', true);
    expect(boardCreated.prefs).to.property('background', 'blue');
    expect(boardCreated.prefs).to.property('cardAging', 'regular');
  });

  it('Can create a new board with optional parameters (POST /1/boards/)', async () => {
    // set query strings
    const boardToBeCreated = board();
    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard(boardToBeCreated);

    // store the created board to boards array for cleaning up after each test
    boards.push(boardCreated);

    // verify values from the response
    expect(boardCreated).to.have.property('id').to.be.a('string');
    expect(boardCreated).to.have.property('name', boardToBeCreated.name);
    expect(boardCreated).to.have.property('desc', boardToBeCreated.desc);
    expect(boardCreated, 'descData should be null').to.have.property('descData', null);
    expect(boardCreated).to.have.property('closed', false);
    expect(boardCreated).to.have.property('idOrganization', null);
    expect(boardCreated).to.have.property('idEnterprise', null);

    expect(boardCreated.prefs).to.property('permissionLevel', 'private');
    expect(boardCreated.prefs).to.property('voting', 'disabled');
    expect(boardCreated.prefs).to.property('comments', 'members');
    expect(boardCreated.prefs).to.property('invitations', 'members');
    expect(boardCreated.prefs).to.property('selfJoin', true);
    expect(boardCreated.prefs).to.property('cardCovers', true);
    expect(boardCreated.prefs).to.property('background', 'blue');
    expect(boardCreated.prefs).to.property('cardAging', 'regular');
  });

  // names array contains strings of 1, 2 and 16384 characters (works up 7596 characters)
  const names = [randomString(1), randomString(2), randomString(7500)];
  names.forEach((name) => {
    it(`Can create a new board with different length of the "name" property (POST /1/boards/) (DD), length: ${name.length}`, async () => {
      // set query strings
      const boardToBeCreated = { ...board(), name };
      // create board by passing only required parameter 'name'
      const boardCreated = await trelloBoardsApi.createBoard(boardToBeCreated);

      // store the created board to boards array for cleaning up after each test
      boards.push(boardCreated);

      // verify values from the response
      expect(boardCreated).to.have.property('id').to.be.a('string');
      expect(boardCreated).to.have.property('name', boardToBeCreated.name);
      expect(boardCreated.name).to.have.lengthOf(boardToBeCreated.name.length);
      expect(boardCreated).to.have.property('desc', boardToBeCreated.desc);
      expect(boardCreated, 'descData should be null').to.have.property('descData', null);
      expect(boardCreated).to.have.property('closed', false);
      expect(boardCreated).to.have.property('idOrganization', null);
      expect(boardCreated).to.have.property('idEnterprise', null);

      expect(boardCreated.prefs).to.property('permissionLevel', 'private');
      expect(boardCreated.prefs).to.property('voting', 'disabled');
      expect(boardCreated.prefs).to.property('comments', 'members');
      expect(boardCreated.prefs).to.property('invitations', 'members');
      expect(boardCreated.prefs).to.property('selfJoin', true);
      expect(boardCreated.prefs).to.property('cardCovers', true);
      expect(boardCreated.prefs).to.property('background', 'blue');
      expect(boardCreated.prefs).to.property('cardAging', 'regular');
    });
  });

  // StatusCodeError: 400, Your browser sent a request that this server could not understand
  it('Error returned when creating a new board and the max length of the "name" is greater than 16384', async () => {
    // query strings, works up to character length 7596
    const name = randomString(16384);
    // set query strings
    const boardToBeCreated = { ...board(), name };
    try {
      // create board by passing only required parameter 'name'
      await trelloBoardsApi.createBoard(boardToBeCreated);
    } catch (error) {
      expect(error).to.have.property('name', 'StatusCodeError');
      expect(error).to.have.property('statusCode', 400);
    }
  });
});
