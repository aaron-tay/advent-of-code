const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  let result = 0;
  for (let line of lines) {
    console.log(line);
    // const regex = new RegExp(/mul\(\d+,\d+\)/g);
    const regex = /mul\(\d+,\d+\)/g;
    const matches = [...line.matchAll(regex)].map((c) => c[0]);
    // matches.forEach(c);
    const score = matches
      .map((m) => {
        const [l, r] = m.replace("mul(", "").replace(")", "").split(",");
        console.log(l, r);
        const score = l * r;
        return score;
      })
      .reduce((acc, s) => {
        acc += s;
        return acc;
      }, 0);
    result += score;
  }
  console.log(result);

  let part2Total = 0;
  const allLines = lines.join("");
  // lines.forEach((line) => {
  const line = allLines;
  const mulRegex = /mul\(\d{1,3},\d{1,3}\)/gm;
  const doRegex = /do\(\)/gm;
  const dontRegex = /don't\(\)/gm;
  const allRegex = /(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/gm;

  const splits = line
    .split(allRegex)
    .filter((l) => l)
    .filter((l) => {
      const hasMatch = [...l.matchAll(allRegex)].length > 0;
      return hasMatch;
    });
  console.log(splits);

  let flag = true;
  const score = splits
    .map((m, i) => {
      if ([...m.matchAll(dontRegex)].length > 0) {
        flag = false;
        return 0;
      }
      if ([...m.matchAll(doRegex)].length > 0) {
        flag = true;
        return 0;
      }

      if (!flag) {
        return 0;
      }

      const [l, r] = m.replace("mul(", "").replace(")", "").split(",");
      console.log(">", l, r);
      const score = l * r;
      return score;
    })
    .reduce((acc, s) => {
      acc += s;
      return acc;
    }, 0);

  console.log(score);
  part2Total += score;
  // });
  console.log(part2Total);
})();

// 157443978
// 87863550 :(

// 83158140 yay
