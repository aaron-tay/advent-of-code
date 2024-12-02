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

  const world = {};
  lines.forEach((line, y) => {
    console.log(line);
    line.split("").forEach((c, x) => {
      const loc = toLoc(x,y);
      world[loc] = c;
    });
  });

  console.table(world);

  function getBounds(input) {
    const keys = Object.keys(input);
    const [minX, minY] = fromLoc(keys[0]);
    const [maxX, maxY] = fromLoc(keys[keys.length - 1]);
    return [minX, minY, maxX, maxY];
  }

  function pullRocksTowardsZero(input) {
    const source = input.map((c, index) => {
      return {
        char: c,
        index
      };
    });
    // console.log(source);
    const partition = {}; // groupId: count

    let groupId = 0;
    const sourceToGroup = [];
    source.forEach((c, index) => {
      if (c.char === "#") {
        groupId += 1; 
      }
      if (c.char === "O") {
        partition[groupId] ??= 0;
        partition[groupId] += 1;
      }
      sourceToGroup[index] = groupId;
    });

    const emptySource = source.map((c, index) => {
      if (c.char === "O") { return { char: ".", index }; }
      return c;
    });
    // console.log(emptySource);
    return emptySource.map((c, index) => {
      if (c.char !== "#") {
        const groupId = sourceToGroup[index];
        const count = partition[groupId];
        if (count > 0) {
          partition[groupId] -= 1;
          return { char: "O", index };
        }
      }
      return c;
    }).map(({char}) => char).join("");
  }

  function tiltNorth(input) {
    // cos start from top left, we need to go to bottom right
    const result = structuredClone(input);

    const [minX, minY, maxX, maxY] = getBounds(result);
    for (let x = minX; x <= maxX; x++) {
      const column = [];
      for (let y = minY; y <= maxY; y++) {
        const loc = toLoc(x, y);
        const c = result[loc];
        column.push(c);
      }

      const tilted = pullRocksTowardsZero(column);

      tilted.split("").forEach((c, y) => {
        const loc = toLoc(x, y);
        result[loc] = c;
      });
    }

    return result;
  }

  function tiltSouth(input) {
    // cos start from top left, we need to go to bottom right
    const result = structuredClone(input);

    const [minX, minY, maxX, maxY] = getBounds(result);
    for (let x = minX; x <= maxX; x++) {
      const column = [];
      for (let y = maxY; y >= minY; y--) {
        const loc = toLoc(x, y);
        const c = result[loc];
        column.push(c);
      }
      
      const tilted = pullRocksTowardsZero(column);

      tilted.split("").forEach((c, y) => {
        const loc = toLoc(x, maxY - y);
        result[loc] = c;
      });
    }

    return result;
  }

  function tiltEast(input) {
    // cos start from top left, we need to go to bottom right
    const result = structuredClone(input);

    const [minX, minY, maxX, maxY] = getBounds(result);
    for (let y = minY; y <= maxY; y++) {
      const row = [];
      for (let x = maxX; x >= minX; x--) {
        const loc = toLoc(x, y);
        const c = result[loc];
        row.push(c);
      }
      
      const tilted = pullRocksTowardsZero(row);

      tilted.split("").forEach((c, x) => {
        const loc = toLoc(maxX - x, y);
        result[loc] = c;
      });
    }

    return result;
  }

  function tiltWest(input) {
    // cos start from top left, we need to go to bottom right
    const result = structuredClone(input);

    const [minX, minY, maxX, maxY] = getBounds(result);
    for (let y = minY; y <= maxY; y++) {
      const row = [];
      for (let x = minX; x <= maxX; x++) {
        const loc = toLoc(x, y);
        const c = result[loc];
        row.push(c);
      }
      
      const tilted = pullRocksTowardsZero(row);

      tilted.split("").forEach((c, x) => {
        const loc = toLoc(x, y);
        result[loc] = c;
      });
    }

    return result;
  }

  // TODO(part2) -> support rolling in other directions
  function tiltWorld(input, directionToPushThings) {
    switch (directionToPushThings) {
      case "N": return tiltNorth(input);
      case "S": return tiltSouth(input);
      case "E": return tiltEast(input);
      case "W": return tiltWest(input);
      default: throw new Error(`Unknown direction ${directionToPushThings}`);
    }
  }

  function totalLoad(input) {
    const [minX, minY, maxX, maxY] = getBounds(input);
    let total = 0;
    // console.log(maxY+1);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const loc = toLoc(x, y);
        const c = input[loc];
        if (c === "O") {
          total += (maxY+1-y);
        }
      }
    }
    return total;
  }

  function p1() {
    const tiltNorthWorld = tiltWorld(world, "N");
    debugWorld(tiltNorthWorld);
    const total = totalLoad(tiltNorthWorld);
    console.log(total);
  }

  function hashWorld(input) {
    const result = [];
    Object.entries(input).forEach(([loc, c]) => {
      if (c === "O") {
        result.push(loc);
      }
    });
    return result.join("_");
  }

  const hashMap = new Map();
  let prevKeyLength = 0;
  let mutableWorld = structuredClone(world);
  const maxCycles = 1000000000;
  let repeatedHash = null;
  const totalLoads = [];
  for (let i = 1; i <= maxCycles; i++) {
    mutableWorld = tiltWorld(mutableWorld, "N");
    mutableWorld = tiltWorld(mutableWorld, "W");
    mutableWorld = tiltWorld(mutableWorld, "S");
    mutableWorld = tiltWorld(mutableWorld, "E");
    const total = totalLoad(mutableWorld);
    console.log("after cycle #", i, total);
    totalLoads.push(total);
    // debugWorld(mutableWorld);
    const worldHash = hashWorld(mutableWorld);
    // console.log(hashMap.keys.length, worldHash)
    hashMap.set(worldHash, hashMap.get(worldHash) ?? 0 + 1);
    const allKeys = [...hashMap.keys()];
    if (allKeys.length === prevKeyLength) {
      console.log("hashMap size", prevKeyLength);
      repeatedHash = worldHash;
      break;
    }
    prevKeyLength = allKeys.length;
  }
  debugWorld(mutableWorld);
  console.table(totalLoads);

  const startOfLoop = [...hashMap.entries()].map(([hash], index) => ({ hash, index })).find(({ hash }) => {
    return hash === repeatedHash;
  });
  console.log(startOfLoop);
  const startOfLoopIdx = startOfLoop.index;
  const offsetTarget = maxCycles - startOfLoopIdx;
  const loopSize = [...hashMap.keys()].length - startOfLoopIdx;
  const cycleIdx = offsetTarget % loopSize;
  const tl = totalLoads[cycleIdx + startOfLoopIdx - 1];
  console.log(offsetTarget, loopSize, cycleIdx, tl);
})();

// 110407

// part2
// 87273

// find when it starts to repeat
// offset + repeat cycle * N = 1000000000
// solve for N
// N = (1000000000 - offset) / repeat cycle
// find total load when we're at lowest N ;)
// 1000000000 - 105 = 999,999,895
// 13 * 76,923,068
// 999999884
// 999,999,988

// 1000000000 - 2  = 999,999,998
// 999,999,998 % 7 = 4 (which is the index of the repeated hash)
