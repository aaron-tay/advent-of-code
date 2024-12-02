const aoc = require("../../aoc");

const DIRECTIONS = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0]
};

(async function main() {
  const lines = await aoc.processFile();

  // [x,y]
  function fromLoc(loc) {
    return loc.split(",").map(Number);
  }
  function toLoc(x, y) {
    return `${x},${y}`;
  }

  function findNeighbours(loc, world) {
    const [x,y] = fromLoc(loc);
    return Object.entries(DIRECTIONS).map(([dir, direction]) => {
      const [dx, dy] = direction;
      const [nx, ny] = [x + dx, y + dy]
      const neighbourLoc = toLoc(nx, ny);
      const neighbour = world[neighbourLoc];
      if (!neighbour) { return null; }
      return neighbourLoc;
    }).filter(c => c);
  };

  function inverseDirection(dir) {
    switch(dir) {
      case "N": return "S";
      case "S": return "N";
      case "E": return "W";
      case "W": return "E";
      default: throw new Error(`unknown dir ${dir}`);
    }
  }

  function debugWorld(world, cellFormatter) {
    const maxX = Math.max(...Object.values(world).map(({x}) => x));
    const maxY = Math.max(...Object.values(world).map(({y}) => y));
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

  function locFromDirection(x,y,direction) {
    const [dx, dy] = DIRECTIONS[direction];
    return toLoc(x + dx, y + dy);
  }
  function dirFromLoc(from, to) {
    const [fx, fy] = fromLoc(from);
    const [tx, ty] = fromLoc(to);
    if (fx === tx) {
      if (ty > fy) {
        return "S";
      } else {
        return "N";
      }
    } else {
      if (tx > fx) {
        return "E";
      } else {
        return "W";
      }
    }
  }

  function startingChar(x,y, world) {
    const currentLoc = toLoc(x,y);
    const enterables = [];
    const dirs = {};
    Object.entries(DIRECTIONS).forEach(([dir, direction]) => {
      const [dx, dy] = direction;
      const [nx, ny] = [x + dx, y + dy]
      const neighbourLoc = toLoc(nx, ny);
      const neighbour = world[neighbourLoc];
      if (!neighbour) { return; }
      const char = neighbour?.char;

      const neighbours = neighboursFromChar(char, nx, ny)
      // console.log(dir, neighbour, neighbours);

      if (neighbours.find(l => l === currentLoc)) {
        enterables.push(neighbourLoc);
        dirs[dir] = true;
      }
    });
    if (Object.keys(dirs).length !== 2) {
      throw new Error("invalid");
    }
    if (dirs.N && dirs.S) {
      return "|";
    }
    if (dirs.E && dirs.W) {
      return "-";
    }
    if (dirs.N && dirs.E) {
      return "L";
    }
    if (dirs.N && dirs.W) {
      return "J";
    }
    if (dirs.S && dirs.W) {
      return "7";
    }
    if (dirs.S && dirs.E) {
      return "F";
    }
    // console.log(enterables);
    return enterables;
  }

  function blockageFromChar(char) {
    switch (char) {
      case "|": {
        return ["E", "W"];
      }
      case "-": {
        return ["N", "S"];
      }
      default: return [];
    }
  }

  function neighboursFromChar(char, x, y) {
    switch(char) {
      case "|": {
        return [
          locFromDirection(x,y,"N"),
          locFromDirection(x,y,"S"),
        ];
      }
      case "-": {
        return [
          locFromDirection(x,y,"E"),
          locFromDirection(x,y,"W"),
        ];
      }
      case "L": {
        return [
          locFromDirection(x,y,"N"),
          locFromDirection(x,y,"E"),
        ];
      }
      case "J": {
        return [
          locFromDirection(x,y,"N"),
          locFromDirection(x,y,"W"),
        ];
      }
      case "7": {
        return [
          locFromDirection(x,y,"S"),
          locFromDirection(x,y,"W"),
        ];
      }
      case "F": {
        return [
          locFromDirection(x,y,"E"),
          locFromDirection(x,y,"S"),
        ];
      }
      case ".": {
        return [];
      }
      case "S": {
        return [];
      }
      default: throw new Error(`unknown char ${char}, ${x},${y}`);
    }
  }

  function p1GetLoopPath(start, world) {
    const visited = new Set();
    const path = [];

    let current = start.asLoc;
    while (!visited.has(current) && current) {
      visited.add(current);
      path.push(current);
      const { neighbours } = world[current];
      current = neighbours.find(neighbour => !visited.has(neighbour));
    }
    return {
      visited,
      path,
    };
  }

  const world = {};
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      const l = toLoc(x, y);
      const neighbours = [];
      const blockages = blockageFromChar(char).map(inverseDirection);
      world[l] = {
        x,y,
        char,
        neighbours,
        isStart: char === "S",
        blockages
      };
    });
  });

  const start = Object.values(world).find(({isStart}) => isStart);
  const realStartChar = startingChar(start.x, start.y, world);
  start.char = realStartChar;

  Object.values(world).forEach(({x,y,char}) => {
    const asLoc = toLoc(x,y);
    world[asLoc].asLoc = asLoc;
    const neighbours = neighboursFromChar(char, x, y);
    neighbours.forEach(neighbour => {
      if (world[neighbour]) {
        const reverseNode = world[neighbour];
        const rn = neighboursFromChar(reverseNode.char, reverseNode.x, reverseNode.y);
        if (rn.find(l => l === asLoc)) {
          world[neighbour].neighbours.push(toLoc(x,y));
        }
      }
    });
  });
  console.table(world);
  console.log(start);

  const loopPath = p1GetLoopPath(start, world);

  debugWorld(world, (cell, cellLoc) => {
    if (loopPath.visited.has(cellLoc)) {
      return "X";
    }
    return cell.char;
  });
  console.log("p1", ((loopPath.path.length) / 2));

  const pipeOnlyWorld = structuredClone(world);;
  Object.entries(pipeOnlyWorld).forEach(([loc, cell]) => {
    const bSet = new Set(pipeOnlyWorld[loc].blockages);
    const canEnterFrom = (inwardDirection) => {
      return !bSet.has(inwardDirection);
    }
    const canLeaveTo = (outwardDirection) => {
      return !bSet.has(outwardDirection);
    }
    pipeOnlyWorld[loc].canEnterFrom = canEnterFrom;
    pipeOnlyWorld[loc].adjacent = findNeighbours(loc, pipeOnlyWorld);
    if (!loopPath.visited.has(loc)) {
      pipeOnlyWorld[loc].char = ".";
    }
  });
  console.table(pipeOnlyWorld);

  //    y
  //  | ----- |
  // x| (x,y) | x+1
  //  | ----- |
  //    y+1
  // const waterWorld = {};
  // Object.entries(pipeOnlyWorld).forEach(([loc, cell]) => {
  //   // waterloc
  //   const wLoc = toLoc(fromLoc(loc));
  // });
  const insides = [];
  lines.forEach((line, y) => {
    let isInside = false;
    const stack = [];
    // process each character on the line
    // if we encounter "|" which is on the loopPath, we're transitioning between inside and outside, push this to the stack
    // if we encounter "F" or "L" which is on the loopPath, we're transitioning between inside and outside. push this to the stack
    // if we encounter "7" or "J" which is on the loopPath, pop from the stack to get out current transition state
    const d = [];
    line.split("").forEach((char, x) => {
      const l = toLoc(x, y);
      const isLoop = loopPath.visited.has(l);
      const prior = isInside;

      if (char === "S") {
        char = realStartChar;
      }

      if (isLoop) {
        if (isInside) {
          if (char === "|") {
            stack.push(isInside);
            isInside = false;
          } else if (char === "F" || char === "L") {
            stack.push(isInside);
            isInside = false;
          } else if (char === "7" || char === "J") {
            isInside = !isInside;
          }
        } else {
          if (char === "|") {
            stack.push(isInside);
            isInside = true;
          } else if (char === "F" || char === "L") {
            stack.push(isInside);
            isInside = true;
          } else if (char === "7" || char === "J") {
            isInside = !isInside;
          }
        }
      } else if (!isLoop && isInside) {
        insides.push(l);
      }
      if (y === 5) {
        d.push({
          prior, char, isLoop, isInside
        });
      }
    });
    console.log(d);
  });
  console.log(insides);
  console.log(insides.length);
  debugWorld(world, (cell, cellLoc) => {
    if (insides.find(l => l === cellLoc)) {
      return "X";
    }
    return cell.char;
  });


  // fill from 0,0
  // function floodfill(pipeOnlyWorld) {
  //   const visited = new Set();
  //   const toVisit = [toLoc(0,0)];

  //   const formatter = (cell, cellLoc) => {
  //     if (visited.has(cellLoc)) {
  //       return "X";
  //     }
  //     return cell.char;
  //   };

  //   while (toVisit.length > 0 && toVisit.length < 10) {
  //     debugWorld(pipeOnlyWorld, formatter);
  //     const current = toVisit.shift();
  //     visited.add(current);
  //     const { adjacent, canEnterFrom } = pipeOnlyWorld[current];
  //     adjacent.forEach(neighbour => {
  //       if (visited.has(neighbour)) { return; }
  //       if (canEnterFrom(dirFromLoc(current, neighbour))) {
  //         toVisit.push(neighbour);
  //       }
  //     });
  //   }
  //   return visited;
  // }
  // const visitedWorld = floodfill(pipeOnlyWorld);

  // function insideOutside(world, path) {
  //   const sidedWorld = {};

  //   function getOutsideDirection(dir) {
  //     switch(dir) {
  //       case "N": return "W";
  //       case "E": return "N";
  //       case "S": return "E";
  //       case "W": return "S";
  //       default: throw new Error(`unknown dir ${dir}`);
  //     }
  //   }
  //   function getInsideDirection(dir) {
  //     switch(dir) {
  //       case "N": return "E";
  //       case "E": return "S";
  //       case "S": return "W";
  //       case "W": return "N";
  //       default: throw new Error(`unknown dir ${dir}`);
  //     }
  //   }
  //   // corners need to add more cos we're 'turning' around it
  //   // double every turn path
  //   const morePaths = path.flatMap((loc, i) => {
  //     const {char} = world[loc];
  //     if (char === "7" || char === "J" || char === "F" || char === "L") {
  //       return [loc, loc];
  //     }
  //     return [loc];
  //   });
  //   console.log(morePaths);

  //   const allPaths = [...morePaths, morePaths[0]]; // so we end up back at the start
  //   for (let i = 0; i < allPaths.length - 2; i++) {
  //     const dir = dirFromLoc(allPaths[i], allPaths[i+1]);
  //     const outsideDir = getOutsideDirection(dir);
  //     const insideDir = getInsideDirection(dir);

  //     // console.log(outsideDir, insideDir);
  //     const outside = locFromDirection(...fromLoc(allPaths[i]), outsideDir);
  //     const inside = locFromDirection(...fromLoc(allPaths[i]), insideDir);
  //     sidedWorld[outside] ??= {
  //       x: fromLoc(outside)[0],
  //       y: fromLoc(outside)[1],
  //     };
  //     sidedWorld[outside].char = "O";

  //     // sidedWorld[inside] ??= {
  //     //   x: fromLoc(inside)[0],
  //     //   y: fromLoc(inside)[1],
  //     // };
  //     // sidedWorld[inside].char = "I";
  //   }

  //   return sidedWorld;
  // }
  // const ioWorld = insideOutside(world, a.path);
  // debugWorld(ioWorld, new Set());

  // const onlyInside = Object.entries(ioWorld).filter((i => !a.visited.has(i)));
  // console.table(onlyInside);
  
  // debugWorld(onlyInside, new Set());
  // find I then floodfill
})();

// 32 nope
// 6754 didn't check neighbour can connect back to origin

// E=>N outside
// S=>E outside
// W=>S outside
// N=>W outside

// path is edge graph
// 'fillable' is vertex graph
// fillable used for floodfill; any where not filled is 'inside'