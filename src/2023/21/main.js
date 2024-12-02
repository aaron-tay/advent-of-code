const aoc = require("../../aoc");

const DIRECTIONS = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0]
};

(async function main() {
  const lines = await aoc.processFile();

  function fromLoc(loc) {
    return loc.split(",").map(Number);
  }
  function toLoc(x, y) {
    return `${x},${y}`;
  }
  function getLoc(loc, direction) {
    const [x, y] = fromLoc(loc);
    const [dx, dy] = DIRECTIONS[direction];
    return toLoc(x + dx, y + dy);
  }

  function debugWorld(world, cellFormatter = (c) => c) {
    const maxX = Math.max(...Object.keys(world).map((loc) => fromLoc(loc)[0]));
    const maxY = Math.max(...Object.keys(world).map((loc) => fromLoc(loc)[1]));
    console.log(maxX, maxY);
    let out = "";
    for (let y = 0; y <= maxY; y++) {
      for (let x = 0; x <= maxX; x++) {
        const l = toLoc(x,y);
        if (!world[l]) {
          out += ".";
          continue;
        }
        out += cellFormatter(world[l], l);
      }
      out += "\n";
    }
    console.log(out);
  }

  function getAccessibleNeighbours(loc, world) {
    const neighbours = [];
    Object.keys(DIRECTIONS).forEach((direction) => {
      const neighbourLoc = getLoc(loc, direction);
      if (world[neighbourLoc] && world[neighbourLoc] !== "#") {
        neighbours.push(neighbourLoc);
      }
    });
    return neighbours;
  }

  const rawWorld = {};
  lines.forEach((line, y) => {
    console.log(line);
    line.split("").forEach((c, x) => {
      const loc = toLoc(x,y);
      rawWorld[loc] = c;
    });
  });
  debugWorld(rawWorld);

  const world = {};
  Object.entries(rawWorld).forEach(([loc, cell]) => {
    world[loc] = {
      char: cell === "S" ? "." : cell,
      loc,
      isStart: cell === "S",
      isRock: cell === "#",
      neighbors: getAccessibleNeighbours(loc, rawWorld)
    };
  });

  const start = Object.values(world).find((c) => c.isStart);
  const queue = [start];
  let maxSteps = 26501365;
  for (let i = 0; i < maxSteps; ++i) {
    const nextSteps = new Set();

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        break;
      }
      current.neighbors.forEach((n) => {
        const neighbor = world[n];
        if (neighbor.char === ".") {
          neighbor.char = current.char;
          nextSteps.add(neighbor);
        }
      });
    }

    queue.push(...nextSteps);
  }
  console.log(queue);
  console.log(queue.length);
})();
