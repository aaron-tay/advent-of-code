const aoc = require("../../aoc");

const DIRECTIONS = [
  [1, 0, "e"],
  [0, -1, "s"],
  [-1, 0, "w"],
  [0, 1, "n"],
  // [1, 1, "ne"],
  // [-1, -1, "sw"],
  // [-1, 1, "nw"],
  // [1, -1, "se"]
];
(async function main() {
  const lines = await aoc.processFile();

  function loc(x, y) {
    return `${x}_${y}`;
  }

  function deloc(xy) {
    const [x,y] = xy.split("_").map(c => parseInt(c, 10));
    return {
      x,
      y,
    }
  }

  function getNode(x, y, map) {
    const width = map[0].length;
    const height = Object.values(map).length;

    if (y < 0 || y >= height) {
      return null;
    }
    if (x < 0 || x >= width) {
      return null;
    }
    // console.log(x,y);
    // console.log();
    return {
      x,
      y,
      elevation: map[y][x]
    }
  }

  function getNeighbours({x, y}, map) {
    const result = [];
    const c = getNode(x, y, map);
    DIRECTIONS.forEach(([dx, dy]) => {
      const node = getNode(x+dx, y+dy, map);
      if (node && node.elevation <= c.elevation+1) {
        // console.log(c, node, node.elevation <= c.elevation+1);
        result.push(node);
      }
    });
    return result;
  }

  function debugMap(map, property) {
    const width = Math.max(...Object.keys(map).map(xy => deloc(xy).x));
    const height = Math.max(...Object.keys(map).map(xy => deloc(xy).y));
    // pad all numbers based on length of largest number
    const padding = Math.max(width, height).toString().length;
    const table = [];
    for (let y = 0; y < height+1; ++y) {
      table[y] = [];
      for (let x = 0; x < width+1; ++x) {
        const d = property ? map[loc(x,y)]?.[property] : map[loc(x,y)] ?? ".";
        const output = (`${d}`).padStart(padding);
        table[y].push(output);
      }
    }
    // console.log(table.map(t => t.join("\t")).join("\n"));
    console.table(table);
  }

  // visited = {parent, distance}
  // function findTarget(start, target, map, parent, visited = {}) {
  //   const openList = [];
  //   openList.push(start);
  //   const sl = loc(start.x, start.y);
  //   visited[sl] = {
  //     parent: null,
  //     distance: 0,
  //   };

  //   function findNext() {
  //     let best = {};
  //     openList.filter(n => !visited[n]).forEach(n => {
  //       if (!best) {
  //         best.node = n;
  //       } else {
  //         const l = loc(n.x, n.y);
  //         if (visited[l].distance < best.distance) {
  //           best.node = n;
  //           best.distance = visited[l].distance;
  //         }
  //       }
  //     });
  //     return best.node;
  //   }

  //   while (openList.length) {
  //     const current = findNext();
  //     const ci = openList.indexOf(current);
  //     openList.splice(ci);
  //     // const current = openList.pop();
  //     // console.log("checking: ", current);
  //     const cl = loc(current.x, current.y);
  //     if (visited[cl].skip) {
  //       continue;
  //     }
  //     const distance = visited[cl]?.distance ?? 0;
  //     visited[cl].skip = true;

  //     const neighbours = getNeighbours(current, map);
  //     for (let i = 0; i < neighbours.length; ++i) {
  //       const n = neighbours[i];
  //       const l = loc(n.x, n.y);
  //       if (!visited[l]) {
  //         visited[l] = {
  //           parent: current,
  //           distance: distance + 1,
  //           skip: false,s
  //         };
  //         openList.push(n);
  //       }
  //       if ((distance + 1) < visited[l].distance) {
  //         console.log("better", l, cl, distance + 1, visited[l]);
  //         visited[l] = {
  //           parent: current,
  //           distance: distance + 1,
  //           skip: false,
  //         };
  //       }
  //     }
  //   }

  //   const distances = {};
  //   Object.keys(visited).forEach(k => {
  //     const c = visited[k];
  //     distances[k] = c.distance;
  //   })
  //   debugMap(distances);

  //   const l = loc(target.x, target.y);
  //   console.log(visited[l]);
  //   openList.push(target);
  //   const path = [];
  //   while (openList.length) {
  //     const current = openList.pop();
  //     path.push(current);
  //     if (current.x === start.x && current.y === start.y) {
  //       break;
  //     }
  //     const cl = loc(current.x, current.y);
  //     const parent = visited[cl]?.parent;
  //     openList.push(parent);
  //   }
  //   console.log(path);
  //   console.log(path.length);
  // }

  function makeQueue() {
    const ds = {}; // num: []
    let highest = 0;
    let length = 0;
    const add = (item, score) => {
      if (!ds[score]) {
        ds[score] = [];
      }
      ds[score].push(item);
      highest = Math.max(highest, score);
      length += 1;
    }
    const getBest = () => {
      for (let i = 0; i <= highest; ++i) {
        if (ds[i]?.length) {
          const next = ds[i].shift();
          length--;
          return next;
        }
      }
      return null;
    }
    return {
      add,
      getBest,
      length: () => length,
    }
  }

  function tracePath(target, meta) {
    const result = [];
    
    let nLoc = loc(target.x, target.y);
    while (nLoc) {
      const d = meta[nLoc];
      if (d?.parent) { result.push(d); }
      nLoc = d?.parent;
    }

    return result;
  }

  function shortestPath(start, target, map) {
    const visited = {}; // loc: true
    const meta = {}; // loc: {}
    const queue = makeQueue();
    queue.add(start, 0);
    meta[loc(start.x, start.y)] = {
      distance: 0
    };

    while (queue.length()) {
      const current = queue.getBest();
      const cl = loc(current.x, current.y);
      if (visited[cl]) { continue; }
      // console.log(cl, meta);

      if (!meta[cl]) { meta[cl] = {}; }
      visited[cl] = true;
      const distanceToCurrent = meta[cl]?.distance ?? 0;

      const neighbours = getNeighbours(current, map);
      neighbours.forEach(n => {
        const cn = loc(n.x, n.y);

        if (!meta[cn]) { meta[cn] = {}; }
        if (visited[cn]) { return; }
        const newDistance = distanceToCurrent + 1;
        if (newDistance < (meta[cn].distance ?? Number.POSITIVE_INFINITY)) {
          meta[cn].distance = newDistance
          meta[cn].parent = cl;
        }
        queue.add(n, newDistance);
      });
    }
    // console.table(meta);
    // debugMap(meta, "distance");
    const path = tracePath(target, meta);
    return {
      path,
      final: meta[loc(target.x, target.y)],
    };
  }

  const map = {};
  let y = 0;
  let t = null;
  let s = null;
  const starts = [];
  for (row of lines) {
    console.log(row);
    map[y] = [];
    row.split("").forEach((c, x) => {
      if (c === "E") {
        t = {x, y};
        map[y].push('z'.charCodeAt(0));
      } else if (c === "S") {
        s = {x, y};
        map[y].push(97);
        starts.push({x,y});
      } else {
        map[y].push(c.charCodeAt(0));
        if (c === "a") {
          starts.push({x,y});
        }
      }
    });
    y++;
  }
  console.table(map);
  const start = getNode(s.x, s.y, map);
  const target = getNode(t.x, t.y, map);

  console.log(start, "->", target);
  const result = shortestPath(start, target, map);
  // debugMap(result.path.reduce((acc, p) => {acc[p.parent] = p.distance; return acc}, {}));
  console.log(result.final);

  // get all 'a'
  let best = Number.POSITIVE_INFINITY;
  starts.forEach(candidate => {
    console.log(candidate);
    const r = shortestPath(candidate, target, map);
    if (r.final) {
      best = Math.min(r.final.distance, best);
    }
  });
  console.log(best);
})();

// That's not the right answer; your answer is too high. 
// Please wait one minute before trying again. (You guessed 499.) [Return to Day 12]

// That's not the right answer; your answer is too high. 
// Please wait one minute before trying again. (You guessed 498.) [Return to Day 12]
