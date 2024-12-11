const aoc = require("../../aoc");

const DIRECTIONS = [
  [1, 0, "e"],
  [0, -1, "s"],
  [-1, 0, "w"],
  [0, 1, "n"],
  // [1, 1, "ne"],
  // [-1, -1, "sw"],
  // [-1, 1, "nw"],
  // [1, -1, "se"],
];
const CODES = DIRECTIONS.map(([, , d]) => d);
(async function main() {
  const lines = await aoc.processFile();

  const world = {};
  const key = (x, y) => `${x}_${y}`;
  const unkey = (keyStr) => {
    const [x, y] = keyStr.split("_");
    return { x: +x, y: +y };
  };

  const origins = new Set();
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      world[key(x, y)] = Number(char);
      if (char === "0") {
        origins.add(key(x, y));
      }
    });
  });
  const sizeX = lines[0].length;
  const sizeY = lines.length;

  console.log(sizeX, sizeY);
  // console.log(world);

  function getNextLevels(currentPosition, world) {
    const current = world[currentPosition];
    if (current === undefined) {
      return [];
    }

    const { x, y } = unkey(currentPosition);
    return DIRECTIONS.filter((d) => {
      const nextPos = { x: x + d[0], y: y + d[1] };
      const npKey = key(nextPos.x, nextPos.y);
      // console.log(x, y, d, npKey);
      return world[npKey] === current + 1;
    }).map((d) => {
      const nextPos = { x: x + d[0], y: y + d[1] };
      return key(nextPos.x, nextPos.y);
    });
  }

  function pt1() {
    function getScore(currentPosition, world, path) {
      if (world[currentPosition] === 9) {
        return currentPosition;
      }

      const nextPos = getNextLevels(currentPosition, world);
      console.log(currentPosition, nextPos);
      return nextPos
        .map((n) => {
          const score = getScore(n, world, [...path]);
          return score;
        })
        .filter((n) => n);
    }

    function countTrailheads(world, origins) {
      return [...origins].map((o) => {
        const trails = getScore(o, world, []).flat(Infinity);
        const count = new Set(trails);
        console.log(o, ">>", trails, count);
        return count.size;
      });
      // return [];
    }
    const pt1 = countTrailheads(structuredClone(world), origins);
    console.log(pt1);
    console.log(pt1.reduce((acc, c) => acc + c, 0));
  }

  function pt2() {
    function getScore(currentPosition, world, path) {
      if (world[currentPosition] === 9) {
        return currentPosition;
      }

      const nextPos = getNextLevels(currentPosition, world);
      console.log(currentPosition, nextPos);
      return nextPos
        .map((n) => {
          const score = getScore(n, world, [...path]);
          return score;
        })
        .filter((n) => n);
    }

    function countTrailheads(world, origins) {
      return [...origins].map((o) => {
        const trails = getScore(o, world, []).flat(Infinity);
        const count = new Set(trails);
        console.log(o, ">>", trails, count);
        return trails.length;
      });
      // return [];
    }
    const pt1 = countTrailheads(structuredClone(world), origins);
    console.log(pt1);
    console.log(pt1.reduce((acc, c) => acc + c, 0));
  }
  pt2();
})();
