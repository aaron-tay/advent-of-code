const aoc = require("../../aoc");

const DIRECTIONS = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0]
};

function fromLoc(loc) {
  return loc.split(",").map(Number);
}
function toLoc(x, y) {
  return `${x},${y}`;
}
function getBounds(input) {
  const keys = Object.keys(input);
  const [minX, minY] = fromLoc(keys[0]);
  const [maxX, maxY] = fromLoc(keys[keys.length - 1]);
  return { minX, minY, maxX, maxY };
}
function inverseDirection(direction) {
  switch (direction) {
    case "N":
      return "S";
    case "E":
      return "W";
    case "S":
      return "N";
    case "W":
      return "E";
    default:
      return null;
  }
}
function directionOfTravel(fromLoc, toLoc) {
  const [fromX, fromY] = fromLoc.split(",").map(Number);
  const [toX, toY] = toLoc.split(",").map(Number);
  if (fromX === toX) {
    if (fromY < toY) {
      return "S";
    } else {
      return "N";
    }
  } else if (fromY === toY) {
    if (fromX < toX) {
      return "E";
    } else {
      return "W";
    }
  } else {
    return null;
  }
}

(async function main() {
  const lines = await aoc.processFile();

  function getAdjacentLocs(loc) {
    const [x, y] = fromLoc(loc);
    return Object.values(DIRECTIONS).map(([dx, dy]) => toLoc(x + dx, y + dy));
  }
  function getAdjacentCells(loc, theWorld) {
    return getAdjacentLocs(loc).map(loc => theWorld[loc]).filter(c => c);
  }

  function getSlopeDirection(char) {
    switch (char) {
      case "^":
        return "N";
      case ">":
        return "E";
      case "v":
        return "S";
      case "<":
        return "W";
      default:
        return null;
    }
  }

  const world = {};
  lines.forEach((line, y) => {
    console.log(line);
    line.split("").forEach((c, x) => {
      const loc = toLoc(x,y);
      const maybeSlope = getSlopeDirection(c);
      world[loc] = {
        loc,
        char: c,
        isSlope: maybeSlope !== null,
        slopeDirection: maybeSlope,
        isWall: c === "#",
        isEmpty: c === "."
      };
    });
  });
  console.table(world);
  Object.keys(world).forEach(loc => {
    const cell = world[loc];
    const adjacentCells = getAdjacentCells(loc, world);
    const nonRockNeighbours = adjacentCells.filter(c => !c.isWall);
    cell.neighbours = nonRockNeighbours;

    const canEnterFrom = (direction) => {
      // for part1 uncomment this
      if (cell.isSlope) {
        // console.log("cef   ", direction, cell.slopeDirection)
        if (direction === cell.slopeDirection) {
          return false;
        }
      }
      if (cell.isWall) {
        return false;
      }
      return true;
    }
    cell.canEnterFrom = canEnterFrom;
  });

  const { maxY, maxX } = getBounds(world);
  function getEmptyCell(row, theWorld) {
    for (let x = 0; x < maxX; ++x) {
      const loc = toLoc(x, row);
      // console.log(loc, theWorld[loc]);
      if (theWorld[loc].char === ".") {
        return loc;
      }
    }
    return null;
  }

  let startLoc = getEmptyCell(0, world);
  let endLoc = getEmptyCell(maxY, world);
  // console.log(startLoc, endLoc);
  world[startLoc].isStart = true;
  world[endLoc].isEnd = true;

  function getLongestPathLength(startLoc, endLoc, theWorld, currentLength = 0, visited = {}, memo = {}) {
    console.log(">", startLoc, endLoc);

    if (memo[startLoc]) {
      console.log("memo", startLoc, memo[startLoc]);
      return memo[startLoc];
    }
    if (startLoc === endLoc) {
      memo[startLoc] = currentLength;
      console.log("END", currentLength);
      return currentLength;
    }
    if (visited[startLoc]) {
      console.log("visited", startLoc);
      return 0;
    }

    const currentVisited = {
      ...visited,
      [startLoc]: true
    };

    const startCell = theWorld[startLoc];

    const distancesToEndFromNeighbour = startCell.neighbours.filter(n => {
      return !currentVisited[n.loc];
    }).filter(neighbour => {
      const directionToNeighbour = directionOfTravel(startLoc, neighbour.loc);
      const directionEnteringNeighbour = inverseDirection(directionToNeighbour);
      return neighbour.canEnterFrom(directionEnteringNeighbour);
    }).map(neighbour => {
      const directionToNeighbour = directionOfTravel(startLoc, neighbour.loc);
      const directionEnteringNeighbour = inverseDirection(directionToNeighbour);

      console.log("  ", startLoc, neighbour.loc, directionToNeighbour, directionEnteringNeighbour);
      const pathLength = getLongestPathLength(neighbour.loc, endLoc, theWorld, currentLength + 1, currentVisited, memo);
      return pathLength;
    }).filter(c => c > 0);

    const longestPath = distancesToEndFromNeighbour.reduce((acc, curr) => {
      if (curr > acc) {
        return curr;
      }
      return acc;
    }, 0);

    if (longestPath > memo[startLoc]) {
      memo[startLoc] = longestPath;
    }
    return longestPath;
  }

  let c = 0;
  function getAllPaths(startLoc, endLoc, theWorld, visited = {}, memo = {}) {
    ++c;
    console.log(">", startLoc, endLoc);
    if (memo[startLoc]) {
      console.log("MEMO");
      return memo[startLoc];
    }
    // if (visited[endLoc]) {
    //   return [];
    // }

    const paths = [];
    paths.push(startLoc);

    if (startLoc === endLoc) {
      memo[startLoc] = paths;
      return paths;
    }

    const currentVisited = {
      ...visited,
      [startLoc]: true
    };

    const startCell = theWorld[startLoc];
    const neighbourPaths = startCell.neighbours.filter(n => {
      return !currentVisited[n.loc];
    }).map(neighbour => {
      const directionToNeighbour = directionOfTravel(startLoc, neighbour.loc);
      const directionEnteringNeighbour = inverseDirection(directionToNeighbour);

      // console.log("   ", startLoc, neighbour.loc, directionToNeighbour, directionEnteringNeighbour);
      if (neighbour.canEnterFrom(directionEnteringNeighbour)) {
        const path = getAllPaths(neighbour.loc, endLoc, theWorld, currentVisited, memo);
        return path;
      }

      return [];
    }).filter(p => p[p.length - 1] === endLoc);
    // console.log(">>>", neighbourPaths);

    const longestPath = neighbourPaths.reduce((acc, curr) => {
      if (curr.length > acc.length) {
        return curr;
      }
      return acc;
    }, []);
    // console.log("LP", longestPath);

    paths.push(...longestPath);
    if (paths.length > (memo[startLoc]?.length ?? 0)) {
      console.log("update memo", paths);
      memo[startLoc] = paths;
    }
    return paths;
  }

  // can optimised - if there's only one path then that doesn't need to be recalculated

  // const path = getAllPaths(startLoc, endLoc, world, {}, {});
  // console.log("PATH", JSON.stringify(path));
  // console.log(path.length - 1);
  // console.log(c);

  const cd = getLongestPathLength(startLoc, endLoc, world, 0, {}, {});
  console.log(cd);
})();
