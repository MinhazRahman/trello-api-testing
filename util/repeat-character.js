// function to generate a string of length n
function repeatCharacter(char, count = 1) {
  return char.repeat(count);
}

function repeatChar(char, length = 2) {
  return Array(length + 1).join(char);
}

// export the repeatCharacter function
module.exports = {
  repeatCharacter,
  repeatChar,
};
