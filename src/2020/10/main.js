const aoc = require("../../aoc");

function p1(lines) {
  const numbers = [];
  for (line of lines) {
    const digit = +line;
    numbers.push(digit);
  }

  numbers.sort((a,b) => a-b);

  const deviceJolt = numbers[numbers.length - 1] + 3;

  const counts = [0, 0, 1];
  let prev = 0;
  numbers.forEach(n => {
    const diff = n-prev;
    // console.log(prev, n, diff);
    prev = n;
    switch (diff) {
      case 1: {
        counts[0]++;
        break;
      }
      case 2: {
        counts[1]++;
        break;
      }
      case 3: {
        counts[2]++;
        break;
      }
      default: return;
    }
  });

  console.log("p1>", counts, counts[0] * counts[2]);
}

(async function main() {
  const lines = await aoc.processFile();

  p1(lines);

  const numbers = [];
  for (line of lines) {
    const digit = +line;
    numbers.push(digit);
  }

  numbers.sort((a,b) => a-b);

  const deviceJolt = numbers[numbers.length - 1] + 3;

  const counts = [0, 0, 1];
  let prev = deviceJolt;
  const memo = {
    [deviceJolt]: 1
  }; // adapter: count

  const reversed = numbers.reverse();
  reversed.push(0);
  reversed.forEach(n => {
    const diffs = [1,2,3];
    memo[n] = 0;
    diffs.forEach(d => {
      const upstream = memo[n + d];
      if (upstream) {
        console.log("try", n+d, upstream);
        memo[n] += upstream;
      }
    });
  });
  console.log(memo[0]);
})();

// 4389 (hi)