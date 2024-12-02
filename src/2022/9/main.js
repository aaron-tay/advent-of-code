const aoc = require("../../aoc");

// 0,0 bottom left, +X,+Y top right
const DIRECTIONS = [
  [1, 0, "e"],
  [0, -1, "s"],
  [-1, 0, "w"],
  [0, 1, "n"],
  [1, 1, "ne"],
  [-1, -1, "sw"],
  [-1, 1, "nw"],
  [1, -1, "se"]
];

(async function main() {
  const lines = await aoc.processFile();

  function debug(h, t) {
    const result = [];
    for (let y = 0; y < 6; ++y) {
      const row = [];
      for (let x = 0; x < 6; ++x) {
        if (h.x === x && h.y === y) {
          row.push("H");
        } else if (t && t.x === x && t.y === y) {
          row.push("T");
        } else {
          row.push(".");
        }
      }
      result.push(row);
    }
    console.table(result);
  }

  function debugNodes(nodes) {
    const gridSize = 15;
    const result = [];
    for (let y = -gridSize; y < gridSize; ++y) {
      const row = [];
      for (let x = -gridSize; x < gridSize; ++x) {
        const idx = nodes.findIndex(n => {
          const latest = n[n.length - 1];
          const {x: nx, y: ny} = latest;
          return nx === x && ny === y;
        });
        if (idx === 0) {
          row.push("H");
        } else if (idx > 0) {
          row.push(idx);
        } else if (x === 0 && y === 0) {
          row.push("s");
        } else {
          row.push(".");
        }
      }
      result.unshift(row);
    }
    console.table(result);
  }

  function loc(x, y) {
    return `${x}_${y}`;
  }

  // if h is touching t
  function isAdjacent(h, t) {
    if (h.x === t.x && h.y === t.y) { return true; }
    return DIRECTIONS.some(([dx, dy]) => {
      const nx = h.x + dx;
      const ny = h.y + dy;
      return (nx === t.x && ny === t.y);
    });
  }

  function manhattenDistance(h, t) {
    return (Math.abs(h.x - t.x) + Math.abs(h.y - t.y));
  }

  function directionFromCommand(urld) {
    if (urld === "R") {
      return DIRECTIONS[0];
    } else if (urld === "D") {
      return DIRECTIONS[1];
    } else if (urld === "L") {
      return DIRECTIONS[2];
    } else if (urld === "U") {
      return DIRECTIONS[3];
    }
    throw new Error("??");
  }

  function getDirection(from, to, scale = 1) {
    return DIRECTIONS.find(([dx, dy]) => {
      return (from.x + (dx*scale) === to.x && from.y + (dy*scale) === to.y);
    });
  }

  // [1, 1, "ne"],4
  // [-1, -1, "sw"],5
  // [-1, 1, "nw"],6
  // [1, -1, "se"]7
  function getDiagonal(head, tail) {
    const dx = head.x - tail.x;
    const dy = head.y - tail.y;
    if (dx >= 1 && dy >= 1) {
      return DIRECTIONS[4];
    } else if (dx >= 1 && dy <= -1) {
      return DIRECTIONS[7];
    } else if (dx <= -1 && dy >= 1) {
      return DIRECTIONS[6];
    } else if (dx <= -1 && dy <= -1) {
      return DIRECTIONS[5];
    }
    return null;
  }

  // const path = [{ x: 0, y: 0 }];
  // const pathT = [{ x: 0, y: 0 }];
  // const lineRegex = /(?<dir>.*) (?<vector>.*)/;
  // for (line of lines) {
  //   // console.log(line);
  //   const { groups: m } = lineRegex.exec(line);
  //   const { dir, vector: vectorraw } = m;
  //   const vector = parseInt(vectorraw, 10);
  //   const direction = getDirection(dir);
  //   console.log(direction, vector);

  //   const [dx, dy] = direction;;
  //   for (let i = 0; i < vector; ++i) {
  //     const prev = path[path.length-1];
  //     const h = {
  //       x: prev.x + dx,
  //       y: prev.y + dy,
  //       trace: line
  //     };
  //     path.push(h);

  //     const prevT = pathT[pathT.length - 1];
  //     console.log("H step");
  //     debug(h, prevT);
  //     const t = {
  //       x: prevT.x + dx,
  //       y: prevT.y + dy,
  //       trace: h
  //     }
  //     if (isAdjacent(h, prevT)) {
  //       console.log("adjacent")
  //       t.x = prevT.x;
  //       t.y = prevT.y;
  //     } else {
  //       console.log("t moved");
  //       const d = manhattenDistance(h, prevT);
  //       if (d === 3) {
  //         t.x = prev.x;
  //         t.y = prev.y;
  //       }
  //       pathT.push(t);
  //     }
  //     debug(h, t)
  //   }
  // }
  // const outcomes = pathT.map(({x, y}) => loc(x, y));
  // const unique = new Set(outcomes);
  // console.log(unique.size);

  // return new head position
  function moveHead(head, direction, line) {
    const [dx, dy] = direction;;
    return {
      x: head.x + dx,
      y: head.y + dy,
      trace: line
    };
  }

  function maybeLog(condition, ...args) {
    if (condition) {
      console.log(...args);
    }
  }

  // can assume not adjacent
  function rule1(head, tail) {
    const dir = getDirection(tail, head, 2);
    if (dir) {
      const [dx, dy] = dir;
      return {
        x: tail.x + dx,
        y: tail.y + dy,
      }
    }

    return null;
  }

  // can assume not adjacent
  function rule2(head, tail) {
    const d = manhattenDistance(tail, head);
    if (d !== 3) {
      return null;
    }
    if (d === 3) {
      const d = getDiagonal(head, tail);
      if (!d) { return null; }
      const [dx, dy] = d;
      return {
        x: tail.x + dx,
        y: tail.y + dy,
      };
    }
    return null;
  }

  function moveBody2(head, body) {
    if (isAdjacent(head, body)) {
      return body;
    }

    const r1 = rule1(head, body);
    if (r1) {
      return r1;
    }

    const r2 = rule2(head, body);
    if (r2) {
      return r2;
    }

    return body;
  }

  function moveBody(idx, prevHead, newHead, body, direction) {
    // const condition = idx === 5;
    const condition = false;
    maybeLog(condition, idx);
    if (isAdjacent(newHead, body)) {
      maybeLog(condition, ">r");
      return body;
    }
  
    const d = manhattenDistance(newHead, body);
    // if (d === 2) {
    //   maybeLog(condition, ">d2");
    //   const [dx, dy] = direction;
    //   const t = {
    //     x: body.x + dx,
    //     y: body.y + dy,
    //     trace: newHead
    //   }
    //   return t;
    // } else
    if (d === 3) {
      maybeLog(condition, ">d3");
      const [dx, dy] = getDiagonal(newHead, body);
      return {
        x: body.x + dx,
        y: body.y + dy,
      };
    } else {
      maybeLog(condition, ">touching");
      return {
        x: prevHead.x,
        y: prevHead.y
      };
    }
  }

  // const path = [{ x: 0, y: 0 }];
  const nodes = [];
  const numNodes = 10;
  for (let i = 0; i < numNodes; ++i) {
    nodes.push([{ x: 0, y: 0 }]);
  }
  const lineRegex = /(?<dir>.*) (?<vector>.*)/;
  for (line of lines) {
    // console.log(line);
    const { groups: m } = lineRegex.exec(line);
    const { dir, vector: vectorraw } = m;
    const vector = parseInt(vectorraw, 10);
    const direction = directionFromCommand(dir);
    console.log(direction, vector);

    for (let i = 0; i < vector; ++i) {
      const headNode = nodes[0];
      const prevHead = headNode[headNode.length-1];
      const newHead = moveHead(prevHead, direction);
      headNode.push(newHead);

      let leadingPrevNode = prevHead;
      let leadingNewNode = newHead;
      let leadingDirection = getDirection(leadingPrevNode, leadingNewNode);
      for (let n = 1; n < numNodes; ++n) {
        const bodyNode = nodes[n];
        const prevBody = bodyNode[bodyNode.length - 1];
        // const newBody = moveBody(n, leadingPrevNode, leadingNewNode, prevBody, leadingDirection);
        const newBody = moveBody2(leadingNewNode, prevBody);
        bodyNode.push(newBody);
        leadingPrevNode = prevBody;
        leadingNewNode = newBody;
        leadingDirection = getDirection(leadingPrevNode, leadingNewNode);
      }
      // debugNodes(nodes);
    }
  }
  const outcomes = nodes[numNodes-1].map(({x, y}) => loc(x, y));
  const unique = new Set(outcomes);
  console.table(unique);
  console.log(unique.size);

})();
