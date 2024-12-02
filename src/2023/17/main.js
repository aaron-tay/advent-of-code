const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  for (line of lines) {
    console.log(line);
  }
})();
