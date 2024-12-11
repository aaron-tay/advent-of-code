const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const input = lines[0].split(" ").map(Number);

  const cache = {};
  const blinkStone = (stone) => {
    if (cache[`${stone}`]) {
      return cache[`${stone}`];
    }

    let result = [];
    if (stone === 0) {
      result = [1];
    } else if (String(stone).length % 2 === 0) {
      const str = String(stone);
      const left = str.slice(0, str.length / 2);
      const right = str.slice(str.length / 2);
      result = [parseInt(left, 10), parseInt(right, 10)];
    } else {
      result = [stone * 2024];
    }

    cache[`${stone}`] = result;
    return result;
  };

  function blink(stones) {
    const result = stones.map((stone) => {
      return blinkStone(stone);
    });
    return result.flat();
  }

  function fastBlink(stones) {
    let pt2 = new Map();
    // console.log(stones);
    [...stones.entries()].map(([stone, total]) => {
      const results = blinkStone(stone);
      results.forEach((r) => {
        pt2.set(r, (pt2.get(r) ?? 0) + total);
      });
    });
    return pt2;
  }

  function doPt1() {
    let pt1 = [...input];
    for (let i = 0; i < 10; ++i) {
      pt1 = blink(pt1);
      console.log(i, pt1.join(","));
    }
    console.log(pt1.length);
  }

  let pt2 = new Map();
  input.forEach((n) => {
    pt2.set(n, (pt2.get(n) ?? 0) + 1);
  });
  for (let i = 0; i < 75; ++i) {
    pt2 = fastBlink(pt2);
    // console.log(i, [...pt2.keys()].join(","));
  }
  console.log([...pt2.values()].reduce((acc, v) => acc + v, 0));
})();

// 0 > 1 > 2024 > 20 24 > 2 0 2 4 >
// 2048 -> 20 48 > 2 0 4 8
//
// 1 (repeat) above
// 2028
// 8096
