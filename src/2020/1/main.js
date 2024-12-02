const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const entries = {};
  lines.forEach((line) => {
    entries[+line] = +line;
  })

  const second = {};
  lines.forEach((line) => {
    const remainder = 2020 - (+line);
    const result = entries[+remainder];
    second[+line] = { result, line, remainder };
    if (result) {
      console.log(">>>", line, result, (line * result));
    }
  });

  lines.forEach((line) => {
    const remainder = second[+line].remainder - (+line);
    const result = entries[+remainder];
    if (result) {
      console.log("2 >>>", line, result, (second[+line].line * second[+line].remainder * result));
    }
  });

  
  lines.forEach((ll1) => {
    const l1 = +ll1;
    lines.forEach((ll2) => {
      const l2 = +ll2;
      lines.forEach((ll3) => {
        const l3 = +ll3;
        if ((l1) + l2 + l3 === 2020) {
          console.log(l1, l2, l3, l1 * l2 * l3)
        }
      });
    });
  });

})();

// 12:42
// 12:49
// 13:04
