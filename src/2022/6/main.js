const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function allDifferent(items) {
    return (new Set(items)).size === 14;
  }

  const line = lines[0];
  for (let i = 0; i < line.length; ++i) {
    const region = line.substring(i, i+14);
    console.log(region);
    const d = allDifferent(region);
    if (d) {
      console.log(i+14);
      break;
    }
  }
})();
