const aoc = require("../../aoc");

function p1(lines) {
  const crabs = lines[0].split(",").map(i => +i);
  const highest = crabs.reduce((acc, c) => Math.max(acc, c), 0);

  let min = Infinity;
  for (let i = 0; i < highest; ++i) {
    let sum = 0;
    crabs.forEach(c => {
      sum += Math.abs(c - i)
    });
    const newMin = Math.min(min, sum);
    min = newMin;
  }
  console.log(min);
}

function culsum(num) {
  let result = 0;
  for (let i = 1; i <= num; ++i) {
    result += i;
  }
  return result;
}

(async function main() {
  const lines = await aoc.processFile();

  p1(lines);

  const crabs = lines[0].split(",").map(i => +i);
  const highest = crabs.reduce((acc, c) => Math.max(acc, c), 0);
  console.log(highest);

  let min = Infinity;
  const memo = {};//distance:result
  for (let i = 0; i < highest; ++i) {
    let sum = 0;
    crabs.forEach(c => {
      const distance = Math.abs(c - i);
      if (memo[distance] === undefined) {
        memo[distance] = culsum(distance);
        // console.log(memo);
      }
      sum += memo[distance];
    });
    const newMin = Math.min(min, sum);
    min = newMin;
  }
  console.log(min);
})();

