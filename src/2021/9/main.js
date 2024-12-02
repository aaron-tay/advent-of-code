const aoc = require("../../aoc");

const DIRECTION = {
  N: [1, 0],
  S: [-1, 0],
  E: [0, 1],
  W: [0, -1]
}

function hasLowerNeighbour({r, c}, map) {
  const current = map[r][c];
  const result = Object.values(DIRECTION).some(([dx, dy]) => {
    if (map[r+dx] === undefined) { return false; }
    if (map[r+dx][c+dy] === undefined) { return false; }
    const candidate = map[r+dx][c+dy];
    // console.log({r, c}, current, r+dx, c+dy, map[r+dx][c+dy]);
    return (candidate < current);
  });
  // console.log(">", result);
  return result;
}

function getNeighbours({ r, c}, map) {
  const current = map[r][c];
  const result = Object.values(DIRECTION).filter(([dx, dy]) => {
    if (map[r+dx] === undefined) { return false; }
    if (map[r+dx][c+dy] === undefined) { return false; }
    if (map[r+dx][c+dy] === 9) { return false; }
    const candidate = map[r+dx][c+dy];
    return (candidate > current)
  }).map(([dx, dy]) => ({ r: r+dx, c: c+dy }));
  // console.log(">", result);
  return result;
}

function p1(lines) {
  // floodfill
  // go from bottom up
  // if there is a number lower than me nearby then we're not lower
  const map = lines.map((line, idx) => {
    return line.split("").map(i => +i);
  });

  const byLevel = {};
  lines.forEach((line, r) => {
    line.split("").map(i => +i).forEach((n, c) => {
      if (!byLevel[n]) {
        byLevel[n] = [];
      }
      byLevel[n].push({ r, c });
    });
  });

  const candidates = [];
  for (let level = 0; level < 10; ++level) {
    const items = byLevel[level];
    items.forEach(({r, c}) => {
      if (map[r][c] !== 9 && !hasLowerNeighbour({ r, c }, map)) {
        candidates.push({ r, c });
      }
    });
  }
  candidates.forEach(n => {
    console.log(n, map[n.r][n.c]);
  });
  const result = candidates.map(n => map[n.r][n.c]+1).reduce((acc, curr) => acc + curr, 0);
  console.log(">", result);
}

(async function main() {
  const lines = await aoc.processFile();

  p1(lines);

  // floodfill
  // go from bottom up
  // if there is a number lower than me nearby then we're not lower
  const map = lines.map((line, idx) => {
    return line.split("").map(i => +i);
  });

  const byLevel = {};
  lines.forEach((line, r) => {
    line.split("").map(i => +i).forEach((n, c) => {
      if (!byLevel[n]) {
        byLevel[n] = [];
      }
      byLevel[n].push({ r, c });
    });
  });

  const candidates = [];
  for (let level = 0; level < 10; ++level) {
    const items = byLevel[level];
    items.forEach(({r, c}) => {
      if (map[r][c] !== 9 && !hasLowerNeighbour({ r, c }, map)) {
        candidates.push({ r, c });
      }
    });
  }
  // candidates.forEach(n => {
  //   console.log(n, map[n.r][n.c]);
  // });
  const result = candidates.map(n => map[n.r][n.c]+1).reduce((acc, curr) => acc + curr, 0);
  console.log(">", result);

  const basins = candidates.map(({r, c}) => {
    //flood fill until we reach 9
    const searchList = [{ r, c }];
    const visited = new Set();
    while (searchList.length > 0) {
      const item = searchList.pop();
      const asKey = `${item.r}_${item.c}`
      if (visited.has(asKey)) { continue; }
      visited.add(asKey);
      const neighbours = getNeighbours(item, map);
      searchList.push(...neighbours);
    }
    console.log({r,c}, map[r][c], visited, visited.size);
    return {
      origin: {r,c},
      visited,
    }
  });

  basins.sort((a, b) => a.visited.size - b.visited.size).reverse();
  const r2 = basins.slice(0, 3).map(b => b.visited.size).reduce((acc, curr) => acc * curr, 1);
  console.log(">>", r2);
})();

// 4
// 1588