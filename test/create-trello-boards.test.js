const {
  expect,
} = require('chai');

const TrelloBoardsApi = require('../src/TrelloBoardsApi');
const randomString = require('../util/random-string');

describe('Create a board', () => {
  let trelloBoardsApi;

  // runs before the first test
  before(async () => {
    trelloBoardsApi = new TrelloBoardsApi();

    trelloBoardsApi.authenticate();
  });

  // runs after every tests
  afterEach(async () => {});

  it('Can create a new board by only passing required parameters (POST /1/boards/)', async () => {
    // query strings
    const name = `${randomString()}`;
    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard({
      name: name,
    });

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

  it.only('Can create a new board with optional parameters (POST /1/boards/)', async () => {
    // set query strings
    const queryStrings = {
      name: `${randomString()}`,
      desc: `${randomString()}`,
      defaultLabels: false,
    };
    // create board by passing only required parameter 'name'
    const boardCreated = await trelloBoardsApi.createBoard(queryStrings);

    console.log(boardCreated);

    // verify values from the response
    expect(boardCreated).to.have.property('id').to.be.a('string');
    expect(boardCreated).to.have.property('name', queryStrings.name);
    expect(boardCreated).to.have.property('desc', queryStrings.desc);
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
