const aoc = require("../../aoc");

const DIRECTIONS = [
  [1, 0, "e", 0, ">"],
  [0, 1, "s", 1, "v"],
  [-1, 0, "w", 2, "<"],
  [0, -1, "n", 3, "^"],
  // [1, 1, "ne"],
  // [-1, -1, "sw"],
  // [-1, 1, "nw"],
  // [1, -1, "se"],
];
const BY_INDEX = DIRECTIONS.map(([, , d]) => d);
(async function main() {
  const lines = await aoc.processFile();

  const key = (x, y) => `${x}_${y}`;
  const unkey = (keyStr) => {
    const [x, y] = keyStr.split("_");
    return { x: +x, y: +y };
  };

  function turnLeft(direction) {
    const idx = (4 + direction[3] - 1) % 4;
    return DIRECTIONS[idx];
  }
  function turnRight(direction) {
    const idx = (4 + direction[3] + 1) % 4;
    return DIRECTIONS[idx];
  }
  function forward(locKey, direction) {
    const { x, y } = unkey(locKey);
    return key(x + direction[0], y + direction[1]);
  }

  const world = {};
  const origin = {};
  const goal = {};
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      const loc = key(x, y);
      world[loc] = char;
      if (char === "S") {
        origin.x = x;
        origin.y = y;
        origin.loc = loc;
        origin.heading = DIRECTIONS[0];
      }
      if (char === "E") {
        goal.x = x;
        goal.y = y;
        goal.loc = loc;
      }
    });
  });
  const width = lines[0].length;
  const height = lines.length;
  console.log(origin);

  function render(world, reindeer = {}, w = width, h = height) {
    function renderReindeer() {
      return reindeer.heading[4];
    }

    const axis = [];
    for (let x = 0; x < w; ++x) {
      axis.push(`${x % 10}`.substring(0, 1));
    }
    console.log(axis.join(""));
    for (let y = 0; y < h; ++y) {
      const line = [];
      for (let x = 0; x < w; ++x) {
        const loc = key(x, y);
        if (loc === reindeer.loc) {
          line.push(renderReindeer());
        } else {
          line.push(world[loc]);
        }
      }
      line.push(`${y % 10}`.substring(0, 1));
      console.log(line.join(""));
    }
  }
  const reindeer = structuredClone(origin);
  render(world, reindeer);

  function bestPath()
})();
