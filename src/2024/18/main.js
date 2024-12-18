const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const { DIRECTIONS, key, unkey, moveByCoord, moveByLoc } = aoc.world();

  function render(worldMap = world, w = width, h = height, other = {}) {
    const axis = [];
    for (let x = 0; x < w; ++x) {
      axis.push(`${x % 10}`.substring(0, 1));
    }
    console.log(axis.join(""));
    for (let y = 0; y < h; ++y) {
      const line = [];
      for (let x = 0; x < w; ++x) {
        const loc = key(x, y);
        if (other[loc]) {
          line.push(other[loc]);
        } else {
          line.push(worldMap[loc]);
        }
      }
      line.push(` ${y % 10}`.substring(0, 2));
      console.log(line.join(""));
    }
  }

  function getNeighbours(loc, world) {
    return DIRECTIONS.map((d) => {
      const nextLoc = moveByLoc(loc, d);
      return nextLoc;
    });
  }
  function getEmptyNeighbours(loc, world) {
    return getNeighbours(loc, world).filter((loc) => {
      return world[loc] === ".";
    });
  }
  function setToWorld(set) {
    return [...set].reduce((acc, loc) => {
      acc[loc] = "O";
      return acc;
    }, {});
  }

  // 4900
  function findShortestPathToGoal(currentLoc, goalLoc, world, visited = new Set()) {
    // floodfill will give best answer - don't really need to know the path for pt1
    const closed = new Set(); // considered
    const open = new Set([currentLoc]); // yet to try
    let level = 0;
    while (true) {
      if (open.has(goalLoc) || closed.has(goalLoc)) {
        return {
          score: level,
          path: [goalLoc],
        };
      }
      if (open.size === 0) {
        console.log(level, goalLoc, "\n o", open, "\n c", closed);
        return null;
      }

      level += 1;
      const candidates = [...open].map((l) => getEmptyNeighbours(l, world)).flat();
      const neighbours = new Set(candidates);
      // console.log(level, goalLoc, "\n o", open, "\n n", neighbours, "\n c", closed);

      open.forEach((l) => {
        closed.add(l);
      });
      open.clear();

      const unvisited = neighbours.difference(closed);
      // render(world, undefined, undefined, setToWorld(unvisited));
      unvisited.forEach((l) => {
        open.add(l);
      });
    }
  }

  function part1(limit = 1024) {
    const obstacles = {};
    const width = 71;
    const height = 71;
    console.log(lines);
    lines.slice(0, limit).forEach((lines) => {
      const [x, y] = lines.split(",").map(Number);
      obstacles[key(x, y)] = "#";
    });

    const goal = key(width - 1, height - 1);
    const start = key(0, 0);
    const world = {};
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const loc = key(x, y);
        if (obstacles[loc]) {
          world[loc] = "#";
        } else {
          world[loc] = ".";
        }
      }
    }
    render(world, width, height);
    const { score } = findShortestPathToGoal(start, goal, world, new Set([start]));
    console.log(">", score);
  }
  // part1();

  function part2() {
    for (let i = 2000; i < lines.length; ++i) {
      console.log("byte: ", i);
      try {
        part1(i);
      } catch {
        console.log("byte: ", i, lines[i]);
        return;
      }
    }
  }
  part2();
})();

// 46,66 nope
// 60,21 off by one -.-
