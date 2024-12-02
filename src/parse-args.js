const arg = require('arg');

const args = arg({
  '--help': Boolean,
  '--version': Boolean,
  '--verbose': arg.COUNT,
  '--file': String,

  // Aliases
  '-v': '--verbose',
  '-f': '--file',
});

function getCliArguments() {
  return {
    filename: args['--file'],
  };
}

module.exports = {
  getCliArguments,
};
