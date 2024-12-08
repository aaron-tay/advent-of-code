const aoc = require("../../aoc");

const DIRECTIONS = [
  [1, 0, "e", 0],
  [0, -1, "n", 1],
  [-1, 0, "w", 2],
  [0, 1, "s", 3],
  // [1, 1, "ne"],
  // [-1, -1, "sw"],
  // [-1, 1, "nw"],
  // [1, -1, "se"],
];

const cache = {};
const findDirection = (direction) => {
  if (cache[direction]) {
    return cache[direction];
  }
  const d = DIRECTIONS.find(([, , dir]) => dir === direction);
  cache[direction] = d;
  return d;
};
const forward = (x, y, direction) => {
  const d = findDirection(direction);
  return {
    x: (x += d[0]),
    y: (y += d[1]),
    direction,
  };
};
const right = (x, y, direction) => {
  // console.log("r", x, y, direction);
  const idx = findDirection(direction)[3];
  // console.log("r1", idx);
  const nIdx = Math.abs(DIRECTIONS.length + idx - 1) % DIRECTIONS.length;
  // console.log("r2", idx, nIdx);
  const nd = DIRECTIONS[nIdx][2];
  return {
    x,
    y,
    direction: nd,
  };
};

(async function main() {
  const lines = await aoc.processFile();

  const world = {};
  const key = (x, y) => `${x}_${y}`;
  const unKey = (str) => {
    const [x, y] = str.split("_");
    return { x, y };
  };
  const keyDir = (x, y, d) => `${x}_${y}_${d}`;

  const guardToDirection = (char) => {
    switch (char) {
      case ">":
        return "e";
      case "^":
        return "n";
      case "<":
        return "w";
      case "V":
        return "s";
      default:
        return null;
    }
  };

  let guard = { x: null, y: null, direction: null };
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      const k = key(x, y);

      const g = guardToDirection(char);
      if (g) {
        guard.direction = g;
        guard.x = x;
        guard.y = y;
        world[k] = ".";
      } else {
        world[k] = char;
      }
    });
  });
  console.table(world);
  console.log(guard);
  const start = { ...guard };

  const visited = new Set();
  const visitedDir = new Set();
  function debugMap() {
    const width = lines[0].length;
    const height = lines.length;
    for (let y = 0; y < height; ++y) {
      const line = [];
      for (let x = 0; x < width; ++x) {
        const loc = key(x, y);
        const cell = world[loc];
        if (visited.has(loc)) {
          line.push("X");
        } else {
          line.push(cell);
        }
      }
      console.log(line.join(""));
    }
  }

  let debugLimit = 4;
  const pt2Rocks = new Set();
  function part1(world) {
    const revists = new Set();

    function advance(current) {
      const nextPos = forward(current.x, current.y, current.direction);
      const nextCell = world[key(nextPos.x, nextPos.y)];
      // const loc = key(current.x, current.y);
      // console.log(loc, "=>", nextPos, nextCell);
      if (!nextCell) {
        return null;
      }
      if (nextCell === ".") {
        return nextPos;
      }
      if (nextCell === "#") {
        debugLimit--;
        if (debugLimit === 0) {
          // debugMap(world);
          // exit(1);
        }
        return right(current.x, current.y, current.direction);
      }
    }
    let updatedGuard = guard;
    visited.add(key(guard.x, guard.y));
    // const revKey = keyDir(guard.x, guard.y, guard.direction);
    // visitedDir.add(revKey);
    let prev = {};
    while (true) {
      updatedGuard = advance(updatedGuard);
      // console.log(updatedGuard);
      if (!updatedGuard) {
        break;
      }

      // console.log(prev, updatedGuard);
      const didHitObstacle = prev.x === updatedGuard.x && prev.y === updatedGuard.y;
      const locKey = key(updatedGuard.x, updatedGuard.y);
      const revKey = keyDir(updatedGuard.x, updatedGuard.y, updatedGuard.direction);
      if (revists.has(revKey)) {
        // console.log("loop");
        return "LOOP";
      }

      // if (didHitObstacle) {
      //   // console.log("hit");
      //   // capture how we did the wall which is the prev direction
      //   visitedDir.add(keyDir(prev.x, prev.y, prev.direction));
      // } else {
      //   // turn right, move forward until hit visitedDir[x,y,D]. or null. null = nothing
      //   const simLoc = right(updatedGuard.x, updatedGuard.y, updatedGuard.direction);
      //   // console.log("sim", updatedGuard, simLoc);
      //   const rock = (() => {
      //     let updatedSimLoc = { ...simLoc };
      //     while (true) {
      //       updatedSimLoc = forward(updatedSimLoc.x, updatedSimLoc.y, updatedSimLoc.direction);
      //       // console.log(" ", updatedSimLoc);
      //       const nextCell = world[key(updatedSimLoc.x, updatedSimLoc.y)];
      //       if (!nextCell) {
      //         return null;
      //       }
      //       if (visitedDir.has(keyDir(updatedSimLoc.x, updatedSimLoc.y, updatedSimLoc.direction))) {
      //         // console.log("potential!", simLoc);
      //         const rockLoc = forward(updatedGuard.x, updatedGuard.y, updatedGuard.direction);
      //         pt2Rocks.add(key(rockLoc.x, rockLoc.y));
      //         break;
      //       }
      //     }
      //     return updatedSimLoc;
      //   })();
      // }

      visited.add(locKey);
      prev = { ...updatedGuard };
      // // console.log(">>", revKey);
      revists.add(revKey);
    }
    return prev;
  }
  const beforeExit = part1(world);
  // // debugMap();
  console.log(visited);
  console.log(visited.size);
  // console.log("visitedDir", visitedDir);

  function part2() {
    const pt2 = new Set();
    const originalVisited = new Set([...visited].filter((v) => v !== key(start.x, start.y)));
    originalVisited.forEach((vvv) => {
      const newWorld = { ...world };
      newWorld[vvv] = "#";

      const r = part1(newWorld);
      if (r === "LOOP") {
        // console.log("loop");
        pt2.add(vvv);
      }
    });
    console.log(pt2);
    console.log(pt2.size);
  }
  part2();

  // // rocks need to be placed INFRONT of place where guard revisited itself
  // function part2() {
  //   // if putting a brick infront makes me turn right to hit a wall i've visited in that direction its a candidate for a loop
  //   // special case for just before existing
  //   console.log(beforeExit);
  //   const rocks = new Set(pt2Rocks);
  //   const originalVisited = new Set(visited);
  //   const allRocks = new Set(rocks);
  //   const originalWorld = { ...world };

  //   // console.log(originalVisited);
  //   originalVisited.forEach((vvv) => {
  //     const newWorld = { ...world };
  //     visitedDir.clear();
  //     pt2Rocks.clear();
  //     newWorld[vvv] = "#";
  //     const isLoop = part1(newWorld);
  //     if (isLoop === null) {
  //       console.log("looped");
  //       console.log(pt2Rocks.size);
  //       allRocks.add(vvv);
  //       // pt2Rocks.forEach((r) => allRocks.add(r));
  //     }
  //   });
  //   console.log(allRocks);
  //   console.log("ALL", allRocks.size);

  //   // looks like its also if adding a rock at every originally visited
  //   // strategy1 + putting a rock in every original position on the path and rerunning 1 alone
  // }
  // part2();
  // console.log(pt2Rocks);
  // console.log(pt2Rocks.size);
})();

// 642 (original per calc but guess +1 to account for end..., so tried 643... too low
// calculations properly give 643

// 1398 ran twice but still too low!?

// 1686
