const faker = require('faker');

// returns a random string
const randomString = (length = 8) => faker.random.alphaNumeric(length);

function board() {
  return {
    name: randomString(),
    desc: randomString(),
    starred: faker.random.arrayElement(['true', 'false']),
    defaultLabels: false,
  };
}

// export randomString function
module.exports = { board };
