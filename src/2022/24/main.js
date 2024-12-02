const aoc = require("../../aoc");

const OPEN = ".";
const EXPLORER = "E";
const WALL = "#";
const BLIZZARD_CODES = ["^", "V", "<", ">"];

const DIRECTIONS = Object.freeze([
  Object.freeze([0, -1, "n"]),
  Object.freeze([0, 1, "s"]),
  Object.freeze([-1, 0, "w"]),
  Object.freeze([1, 0, "e"]),
]);

(async function main() {
  const lines = await aoc.processFile();

  function debugGrid(grid, width, height, minX = 0, minY = 0) {
    const output = [];
    for (let y = minY; y < height; ++y) {
      const row = [];
      for (let x = minX; x < width; ++x) {
        const c = loc(x,y);
        row.push(grid[c] ?? OPEN);
      }
      output.push(row.join(""));
    }
    console.log(output.join("\n"));
  }

  function loc(x, y) {
    return `${x}_${y}`;
  }
  function deloc(xy) {
    const [x,y] = xy.split("_").map(c => parseInt(c, 10));
    return {x,y};
  }

  function transform(location, direction) {
    const [ dx, dy ] = direction;
    const { x, y } = location;
    return {
      x: x + dx,
      y: y + dy
    };
  }

  function boundingBox(grid) {
    const result = {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    }

    Object.keys(grid).map(deloc).forEach(({x,y}) => {
      result.minX = Math.min(result.minX, x);
      result.maxX = Math.max(result.maxX, x);
      result.minY = Math.min(result.minY, y);
      result.maxY = Math.max(result.maxY, y);
    });
    return {
      ...result,
      width: result.maxX - result.minX,
      height: result.maxY - result.minY
    };
  }

  // 3x3 area around us
  function getLocalMap(location, map) {
    const { x, y } = location;
  }

  function wrap(value, limit) {
    if (value < 0) {
      return value + limit;
    }
    if (value >= limit) {
      return value - limit;
    }

    return value;
  }

  function blizzardLocation(blizzardStart, timeStep, map) {
    const { boundingBox } = map;
    const { width, height } = boundingBox;
    const { startX: x, startY: y, direction } = blizzardStart;
    const [dx, dy] = direction;

    let { x: nx, y: ny } = { x, y };
    console.log("B", nx,ny);
    for (let ts = 0; ts < timeStep; ++ts) {
      nx = (((nx-1) + dx) % (width-1)) + 1;
      ny = (((ny-1) + dy) % (height-1)) + 1;
      console.log(">", nx,ny);
    }
    // N = (start + direction*timeStep) % (length-2) + 1

    return {
      x: nx,
      y: ny,
      direction
    }
  }

  // generate the world at 0+timeStep
  function stepThroughWorld(world, initialBlizzards, timeStep) {
    const result = {...world};
    const blizzards = {};
    Object.values(initialBlizzards).forEach(b => {
      const c = loc(b.startX, b.startY);
      blizzards[c] = b;
    });
    return result;
  }

  function generateWorlds(world, blizzards, numberOfWorlds) {
    const result = [];
    for (let ts = 0; ts < numberOfWorlds; ++ts) {
      const prev = result[result.length-1];
      if (!prev) {
        result.push(world);
      } else {
        const nextWorld = stepThroughWorld(prev, blizzards, ts);
        result.push(world);
      }
    }
    return result;
  }

  function findExplorerStart(world) {
    const bb = boundingBox(world);
    for (let x = 0; x < bb.maxX; ++x) {
      const c = loc(x, bb.minY);
      if (world[c] === OPEN) {
        return {
          x,
          y: bb.minY
        };
      }
    }
    throw new Error("Expected to find start");
  }
  function findExplorerEnd(world) {
    const bb = boundingBox(world);
    for (let x = 0; x < bb.maxX; ++x) {
      const c = loc(x, bb.maxY);
      if (world[c] === OPEN) {
        return {
          x,
          y: bb.maxY
        };
      }
    }
    throw new Error("Expected to find start");
  }

  const world = {};
  const blizzards = [];
  const blizzardsByStartingLocation = {};
  lines.forEach((line, yy) => {
    console.log(line);
    line.split("").forEach((v, xx) => {
      const c = loc(xx,yy);
      if (BLIZZARD_CODES.includes(v)) {
        const blizzard = {
          startX: xx,
          startY: yy,
          direction: DIRECTIONS[BLIZZARD_CODES.indexOf(v)]
        };
        blizzardsByStartingLocation[c] = Object.freeze(blizzard);
        blizzards.push({...blizzard});
        world[c] = ".";
      } else {
        world[c] = v;
      }
    });
  });
  const start = findExplorerStart(world);
  const target = findExplorerEnd(world);
  console.table(blizzards);
  console.log(start, target);

  const worldBb = boundingBox(world);
  const map = {
    blizzardsByStartingLocation,
    blizzards,
    world,
    boundingBox: worldBb,
  }
  const numWorlds = worldBb.maxX * worldBb.maxY;
  console.log(numWorlds); // real number is actually slightly less counting for walls!
  // const allWorlds = generateWorlds(world, blizzards, numWorlds);
  // console.table(allWorlds);
  console.log(blizzards[3]);
  const r = blizzardLocation(blizzards[3], 12, map);
  console.log(r);
})();

// notes
// only need to consider/calculate 3 horizontal and 3 vertical
// ... <
// .E. <
// ... <
// ^^^
// can 'project' to future from initial start position
// blizzards are like moving walls except we can swap location with them
// e.g. E< => <E but we cannot move into it e.g: E.< => DEAD
// bit slow to generate all worlds upfront so could memoize
