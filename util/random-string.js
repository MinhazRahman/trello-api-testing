const faker = require('faker');
// creates random string
function randomString(length = 8) {
  return faker.random.alphaNumeric(length);
}

// export randomString function
module.exports = randomString;
