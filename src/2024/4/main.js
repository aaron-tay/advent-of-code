const aoc = require("../../aoc");

const DIRECTIONS = [
  [1, 0, "e"],
  [0, -1, "s"],
  [-1, 0, "w"],
  [0, 1, "n"],
  [1, 1, "ne"],
  [-1, -1, "sw"],
  [-1, 1, "nw"],
  [1, -1, "se"],
];
const CODES = DIRECTIONS.map(([, , d]) => d);
(async function main() {
  const lines = await aoc.processFile();

  const key = (x, y) => `${x}_${y}`;

  const grid = {};
  // for (line of lines) {
  //   console.log(line);
  // }
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      grid[key(x, y)] = char;
    });
  });
  const sizeX = lines[0].length;
  const sizeY = lines.length;

  console.log(grid);

  const cache = {};
  const findDirection = (direction) => {
    if (cache[direction]) {
      return cache[direction];
    }
    const d = DIRECTIONS.find(([, , dir]) => dir === direction);
    cache[direction] = d;
    return d;
  };

  const getChars = (x, y, num, direction) => {
    if (num === 0) {
      return null;
    }

    const d = findDirection(direction);
    const next = {
      x: x + d[0],
      y: y + d[1],
    };

    const char = grid[key(x, y)] ?? null;
    const nextChars = getChars(next.x, next.y, num - 1, direction) ?? [];
    return [char, ...nextChars];
  };

  // const canMakeXMAS = (x,y) => {

  // let count = 0;
  // for (let y = 0; y < sizeY; ++y) {
  //   for (let x = 0; x < sizeX; ++x) {
  //     CODES.forEach((d) => {
  //       const xmas = getChars(x, y, 4, d);
  //       console.log(xmas);
  //       if (xmas.filter((c) => c).join("") === "XMAS") {
  //         count += 1;
  //       }
  //     });
  //   }
  // }
  // console.log(count);

  const getBox = (x, y) => {
    const result = [
      getChars(x, y, 3, "e").filter((c) => c),
      getChars(x, y + 1, 3, "e").filter((c) => c),
      getChars(x, y + 2, 3, "e").filter((c) => c),
    ];
    //invalid box return null
    if (result.flat().length < 9) {
      return null;
    }
    return result;
  };

  const isMAS = (box) => {
    return (
      ["A"].includes(box[1][1]) &&
      ((["M"].includes(box[0][0]) && ["S"].includes(box[2][2])) ||
        (["S"].includes(box[0][0]) && ["M"].includes(box[2][2]))) &&
      ((["M"].includes(box[2][0]) && ["S"].includes(box[0][2])) ||
        (["S"].includes(box[2][0]) && ["M"].includes(box[0][2])))
    );
  };

  let part2 = 0;
  for (let y = 0; y < sizeY; ++y) {
    for (let x = 0; x < sizeX; ++x) {
      const c = getBox(x, y);
      if (!c) {
        continue;
      }

      // console.log(x, y, c);
      if (isMAS(c)) {
        console.log();
        part2 += 1;
      }
    }
  }
  console.log(part2);
})();
