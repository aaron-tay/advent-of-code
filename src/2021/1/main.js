const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  let p2Count = 0;
  let p2Last = null;
  let count = 0;
  let last = null;
  lines.forEach((line, idx) => {
    if ((last !== null) && ((+line) > last)) {
      count++;
    }

    if ((idx-2) > 0) {
      const rolling = ((+lines[idx]) + (+lines[idx-1]) + (+lines[idx-2]));
      if ((p2Last !== null) && ((+rolling) > p2Last)) {
        p2Count++;
      }
      p2Last = rolling;
    }
  
    last = +line;
  })
  console.log(count, p2Count);
})();
