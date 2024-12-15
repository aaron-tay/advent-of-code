const aoc = require("../../aoc");

const DIRECTIONS = [
  [1, 0, "e"],
  [0, 1, "s"],
  [-1, 0, "w"],
  [0, -1, "n"],
  // [1, 1, "ne"],
  // [-1, -1, "sw"],
  // [-1, 1, "nw"],
  // [1, -1, "se"],
];
const CODES = DIRECTIONS.map(([, , d]) => d);
(async function main() {
  const lines = await aoc.processFile();

  function commandToDirection(command) {
    switch (command) {
      case ">":
        return DIRECTIONS[0];
      case "v":
        return DIRECTIONS[1];
      case "<":
        return DIRECTIONS[2];
      case "^":
        return DIRECTIONS[3];
      default:
        throw new Error(`UNKNOWN ${command}`);
    }
  }

  const grouped = aoc.groupLines(lines);
  console.log("G", grouped);

  const commands = grouped[1].join("").split("").map(commandToDirection);

  const key = (x, y) => `${x}_${y}`;
  const unkey = (keyStr) => {
    const [x, y] = keyStr.split("_");
    return { x: +x, y: +y };
  };

  function nextPosition(loc, direction) {
    const { x, y } = unkey(loc);
    const nx = x + direction[0];
    const ny = y + direction[1];
    const nLoc = key(nx, ny);
    return {
      loc: nLoc,
      x: nx,
      y: ny,
    };
  }

  function move(robot, direction) {
    const nextPos = nextPosition(robot.loc, direction);
    return {
      ...robot,
      loc: nextPos.loc,
      x: nextPos.x,
      y: nextPos.y,
    };
  }

  const world = {};
  const robotStart = {};
  const boxes = new Set();
  grouped[0].forEach((line, y) => {
    line.split("").forEach((char, x) => {
      const loc = key(x, y);
      if (char === "@") {
        robotStart.x = x;
        robotStart.y = y;
        robotStart.loc = loc;
        robotStart.type = "robot";
      } else {
        world[loc] = char;
        if (char === "O") {
          boxes.add(loc);
        }
      }
    });
  });
  const height = grouped[0].length;
  const width = grouped[0][0].length;

  function render(world, robot, w = width, h = height) {
    for (let y = 0; y < h; ++y) {
      const line = [];
      for (let x = 0; x < w; ++x) {
        const loc = key(x, y);
        if (loc === robot.loc) {
          line.push("@");
        } else {
          line.push(world[loc]);
        }
      }
      console.log(line.join(""));
    }
  }

  function isSpace(world, loc) {
    return world[loc] === ".";
  }
  function isWall(world, loc) {
    return world[loc] === "#";
  }
  function isBox(world, loc) {
    return world[loc] === "O";
  }
  function moveObject(world, obj, direction) {
    const nextLoc = nextPosition(obj.loc, direction);
    world[nextLoc.loc] = world[obj.loc];
    world[obj.loc] = ".";
  }

  function push(world, robot, direction) {
    // console.log(robot, direction);
    // returns new world
    const newWorld = structuredClone(world);
    let prev = structuredClone(robot);
    let next = move(robot, direction);
    const chain = [];
    while (true) {
      //  || isBox(world, next.loc) need to check next???
      if (isWall(world, next.loc)) {
        chain.splice(0);
        break;
      }
      if (isSpace(world, next.loc)) {
        chain.push(prev);
        break;
      }
      chain.push(prev);
      prev = next;
      next = move(next, direction);
    }
    // console.log("chain", chain);
    chain.reverse().forEach((obj) => {
      // console.log(" ", obj);
      moveObject(newWorld, obj, direction);
    });
    let newRobot = chain.length > 0 ? move(robot, direction) : structuredClone(robot);
    // console.log(newRobot);
    return {
      newWorld,
      newRobot,
    };
  }

  function scorePt1(world) {
    const boxes = [];
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const loc = key(x, y);
        if (world[loc] === "O") {
          boxes.push(loc);
        }
      }
    }
    const score = boxes.reduce((acc, box) => {
      const { x, y } = unkey(box);
      const gpsCoord = 100 * y + x;
      return acc + gpsCoord;
    }, 0);
    return score;
  }

  function pt1(world, robot, commands) {
    let resultWorld = structuredClone(world);
    let resultRobot = structuredClone(robot);
    commands.forEach((cmd, idx) => {
      const { newWorld, newRobot } = push(resultWorld, resultRobot, cmd);
      resultWorld = newWorld;
      resultRobot = newRobot;

      // console.log(`\n\n${idx}, ${resultRobot.loc}, ${cmd[2]} ---\n`);
      // render(resultWorld, resultRobot);
    });
    const result = scorePt1(resultWorld);
    console.log(result);
  }

  // render(world, robotStart);
  // pt1(world, robotStart, commands);
  // console.log(world, robotStart);

  const expandedWorld = {};
  grouped[0].forEach((line, y) => {
    line.split("").forEach((char, dx) => {
      const x1 = dx * 2;
      const x2 = x1 + 1;
      const loc = key(x1, y);
      const loc2 = key(x2, y);
      if (char === "#") {
        expandedWorld[loc] = char;
        expandedWorld[loc2] = char;
      } else if (char === "O") {
        expandedWorld[loc] = "[";
        expandedWorld[loc2] = "]";
      } else if (char === ".") {
        expandedWorld[loc] = char;
        expandedWorld[loc2] = char;
      } else if (char === "@") {
        expandedWorld[loc] = char;
        expandedWorld[loc2] = ".";
        robotStart.x = x1;
        robotStart.y = y;
        robotStart.loc = loc;
      }
    });
  });
  const eHeight = height;
  const eWidth = width * 2;
  console.log(expandedWorld);
  render(expandedWorld, robotStart, eWidth, eHeight);

  function getMaybeBox(world, nextLoc) {
    const { x, y } = unkey(nextLoc);
    if (world[nextLoc] === "[") {
      return [nextLoc, key(x + 1, y)];
    } else if (world[nextLoc] === "]") {
      return [key(x - 1, y), nextLoc];
    }
    // not a box
    return null;
  }

  const ivCache = {};
  function isVertical(direction) {
    if (ivCache[direction[2]]) {
      return ivCache[direction[2]];
    }
    const c = ["s", "n"].includes(direction[2]);
    ivCache[direction[2]] = c;
    return c;
  }

  function wideMoveObj(world, obj, direction) {
    const { x, y } = unkey(obj.loc);

    if (world[obj.loc] === "@") {
      moveObject(world, obj, direction);
      return;
    }

    if (isVertical(direction)) {
      if (world[obj.loc] === "[") {
        const rhs = {
          ...obj,
          loc: key(x + 1, y),
          x: x + 1,
          y,
        };
        moveObject(world, obj, direction);
        moveObject(world, rhs, direction);
      } else if (world[obj.loc] === "]") {
        const lhs = {
          ...obj,
          loc: key(x - 1, y),
          x: x - 1,
          y,
        };
        moveObject(world, lhs, direction);
        moveObject(world, obj, direction);
      }
    } else {
      // <>
      if (world[obj.loc] === "[") {
        const rhs = {
          ...obj,
          loc: key(x + 1, y),
          x: x + 1,
          y,
        };
        moveObject(world, rhs, direction);
        moveObject(world, obj, direction);
      } else if (world[obj.loc] === "]") {
        const lhs = {
          ...obj,
          loc: key(x - 1, y),
          x: x - 1,
          y,
        };
        moveObject(world, lhs, direction);
        moveObject(world, obj, direction);
      }
    }
  }

  // [], false, null
  function widePush(world, obj, direction) {
    if (obj.type === "box") {
      let lhs = move(left, direction);
      let rhs = move(right, direction);
      // both lhs+rhs need to succeed
    } else {
      let next = move(robot, direction);
    }
  }

  function pushRecursive(world, locs, direction) {
    const lhs = world[locs[0].loc];
    const rhs = world[locs[1].loc];
    console.log(" PR", locs[0].loc, locs[1].loc, lhs, rhs);
    if (lhs === "#" || rhs === "#") {
      return null; // cannot move
    }
    if (lhs === "." && rhs === ".") {
      return locs;
    }

    const result = [];
    // NB: something here is not checking both left and right of the next positions. it's just going forward
    if (lhs === "[") {
      console.log(" l [");
      // one up
      const n1 = move(locs[0], direction);
      const n2 = move(locs[1], direction);
      const r = pushRecursive(world, [n1, n2], direction);
      if (r === null) {
        return null;
      }
      result.push(locs[0], locs[1], ...r);
    } else if (lhs === "]") {
      console.log(" l ]");
      // up to left
      const { x, y } = unkey(locs[0].loc);
      const nPos = {
        loc: key(x - 1, y),
        x: x - 1,
        y,
      };

      const n1 = move(nPos, direction);
      const n2 = move(locs[0], direction);
      const r = pushRecursive(world, [n1, n2], direction);
      if (r === null) {
        return null;
      }
      result.push(locs[0], locs[1], ...r);
    } else if (rhs === "[") {
      console.log(" r ]");
      // up to right
      // up to left
      const { x, y } = unkey(locs[0].loc);
      const nPos = {
        loc: key(x + 1, y),
        x: x + 1,
        y,
      };

      const n1 = move(locs[0], direction);
      const n2 = move(nPos, direction);
      const r = pushRecursive(world, [n1, n2], direction);
      if (r === null) {
        return null;
      }
      result.push(locs[0], locs[1], ...r);
    } else {
      console.log("??");
    }
    return result;
  }

  function push2(world, robot, direction) {
    if (!isVertical(direction)) {
      return push(world, robot, direction);
    }

    // console.log(robot, direction);
    // returns new world
    const newWorld = structuredClone(world);
    let prev = structuredClone(robot);
    let next = move(robot, direction);
    const verticalChain = [];

    if (world[next.loc] === "[") {
      const { x, y } = unkey(next.loc);
      const nPos = {
        loc: key(x + 1, y),
        x: x + 1,
        y,
      };
      const r = pushRecursive(world, [next, nPos], direction);
      if (r !== null) {
        verticalChain.push(prev);
        verticalChain.push(...r);
      }
    } else if (world[next.loc] === "]") {
      const { x, y } = unkey(next.loc);
      const nPos = {
        loc: key(x - 1, y),
        x: x - 1,
        y,
      };
      const r = pushRecursive(world, [nPos, next], direction);
      if (r !== null) {
        verticalChain.push(prev);
        verticalChain.push(...r);
      }
    } else if (world[next.loc] === ".") {
      verticalChain.push(prev);
    }

    console.log("chain");
    verticalChain.reverse().forEach((obj) => {
      console.log(" ", obj);
      wideMoveObj(newWorld, obj, direction);
    });
    let newRobot = verticalChain.length > 0 ? move(robot, direction) : structuredClone(robot);
    // console.log(newRobot);
    return {
      newWorld,
      newRobot,
    };
  }

  function pt2(world, robot, commands) {
    let resultWorld = structuredClone(world);
    let resultRobot = structuredClone(robot);
    commands.forEach((cmd, idx) => {
      const { newWorld, newRobot } = push2(resultWorld, resultRobot, cmd);
      resultWorld = newWorld;
      resultRobot = newRobot;

      console.log(`\n\n${idx}, ${resultRobot.loc}, ${cmd[2]} ---\n`);
      render(resultWorld, resultRobot, eWidth, eHeight);
    });
    // const result = scorePt1(resultWorld);
    // console.log(result);
  }
  pt2(expandedWorld, robotStart, commands);
})();
