const aoc = require("../../aoc");

const DIRECTIONS = [
  [1, 0, "e"],
  [0, 1, "s"],
  [-1, 0, "w"],
  [0, -1, "n"]
];

(async function main() {
  const lines = await aoc.processFile();

  function loc(x, y) {
    return `${x}_${y}`;
  }
  function deloc(xy) {
    return xy.split("_");
  }

  function makeEdges(maxX, maxY) {
    const edges = {
      t: [],
      r: [],
      b: [],
      l: [],
    }; // trbl: [x_y]
    for (let x = 0; x < maxX; ++x) {
      edges["t"].push(loc(x, 0)); //s
      edges["b"].push(loc(x, maxY)); //n
    }
    for (let y = 0; y < maxY; ++y) {
      edges["l"].push(loc(0, y)); //e
      edges["r"].push(loc(maxX, y)); //w
    }
    return edges;
  }

  function isVisible(forest, x, y, maxX, maxY) {
    const tc = loc(x, y);
    const theHeight = forest[tc];
    return DIRECTIONS.some(([dx, dy]) => {
      let nx = x;
      let ny = y;
      let result = true;
      while (nx >= 0 && nx < maxX && ny >= 0 && ny <= maxY) {
        nx += dx;
        ny += dy;
        const c = loc(nx, ny);
        const h = forest[c];
        if (h >= theHeight) {
          return false;
        }
      }
      return result;
    });
  }

  function numVisible(forest, x, y, maxX, maxY) {
    const tc = loc(x, y);
    const theHeight = forest[tc];
    // console.log(tc, theHeight);
    return DIRECTIONS.map(([dx, dy]) => {
      // console.log("D", dx, dy);
      let nx = x;
      let ny = y;
      let num = 0;
      nx += dx;
      ny += dy;
      while (nx >= 0 && nx < maxX && ny >= 0 && ny < maxY) {
        num += 1;
        const c = loc(nx, ny);
        const h = forest[c];
        // console.log(c, h, num);
        // bug here! over counting

        if (h >= theHeight) {
          // console.log(">", num);
          return num;
        }
        nx += dx;
        ny += dy;
      }
      // console.log(">", num);
      return num;
    }).reduce((acc, c) => {
      return acc * c;
    }, 1);
  }

  const forest = {}; // x_y: {nsew: h}
  lines.forEach((line, y) => {
    console.log(line);
    const row = line.split("");
    row.forEach((h, x) => {
      const c = loc(x, y);
      forest[c] = parseInt(h, 10);
    });
  });
  const maxX = lines[0].length;
  const maxY = lines.length;
  const edges = makeEdges(maxX, maxY);

  function p1() {
    const visibleTrees = {};
    for (let x = 0; x < maxX; ++x ) {
      for (let y = 0; y < maxY; ++y) {
        if (isVisible(forest, x, y, maxX, maxY)) {
          const c = loc(x, y);
          visibleTrees[c] = forest[c];
        }
      }
    }
    console.log(visibleTrees,Object.values(visibleTrees).length);
  }

  // console.log(numVisible(forest, 2, 3, maxX, maxY));
  const visibleTrees = {};
  for (let x = 0; x < maxX; ++x ) {
    for (let y = 0; y < maxY; ++y) {
      const n = numVisible(forest, x, y, maxX, maxY);
      const c = loc(x, y);
      visibleTrees[c] = n;
    }
  }
  console.log(loc(1,2), forest[loc(2,1)], visibleTrees[loc(2,1)]);
  const highest = Math.max(...Object.values(visibleTrees));
  console.log(highest);

})();
