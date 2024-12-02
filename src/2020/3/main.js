const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  let numTrees = 0;
  let x = 0;
  let y = 0;
  const RIGHT = 3;
  const DOWN = 1;
  let numColumns = null;
  let numDown = DOWN;

  for (line of lines) {
    if (numColumns === null) {
      numColumns = lines[0].length;
      continue;
    }
    y = (y + 1);
    numDown--;
    if (numDown !== 0) {
      continue;
    }
    numDown = DOWN;
    x = ((x + RIGHT) % numColumns);
    const geology = line.charAt(x);
    console.log(x, y, geology, " | ", line);
    if (geology === "#") {
      numTrees++;
    }
  }

  console.log(numTrees);
})();

// 64 284 71 68 40