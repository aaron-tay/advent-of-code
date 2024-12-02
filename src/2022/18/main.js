const aoc = require("../../aoc");

const DIRECTIONS = {
  XF: [1, 0, 0],
  XB: [-1, 0, 0],
  YF: [0, 1, 0],
  YB: [0, -1, 0],
  ZF: [0, 0, 1],
  ZB: [0, 0, -1],
};
(async function main() {
  const lines = await aoc.processFile();

  function loc(x,y,z) {
    return `${x},${y},${z}`;
  }

  function getNeighbours({x,y,z}, worldSize) {
    const nPoints = Object.values(DIRECTIONS).map(([dx,dy,dz]) => {
      return {
        x: x + dx,
        y: y + dy,
        z: z + dz,
      }
    }).filter(n => {
      return n.x >= 0 && n.x <= worldSize.x+1 &&
      n.y >= 0 && n.y <= worldSize.y+1 &&
      n.z >= 0 && n.z <= worldSize.z+1
    });
    return nPoints;
  }

  function addDroplet(droplet, world, meta) {
    const neighbours = Object.values(DIRECTIONS).map(([dx,dy,dz]) => {
      return {
        x: droplet.x + dx,
        y: droplet.y + dy,
        z: droplet.z + dz,
      }
    });

    neighbours.forEach(n => {
      const c = loc(n.x, n.y, n.z);
      if (!meta[c]) { meta[c] = 0;}
      meta[c] += 1;
    });

    const c = droplet.key;
    world[c] = true;
  }

  function visit(world, worldSize) {
    let outerArea = 0;
    const visited = {};
    const openList = [{x: 0, y: 0, z: 0}];
    while (openList.length > 0) {
      const node = openList.shift();
      const nodeLoc = loc(node.x, node.y, node.z);
      if (world[nodeLoc]) {
        ++outerArea;
      }
      if (visited[nodeLoc]) { 
        continue;
      }
      visited[nodeLoc] = true;

      // we're at a droplet that stops our path
      if (world[nodeLoc]) {
        continue;
      }

      const neighbours = getNeighbours(node, worldSize);
      neighbours.forEach(n => {
        const neighbourLoc = loc(n.x, n.y, n.z);
        openList.push(n);
      });
    }
    console.log("OuterArea", outerArea);
    return visited;
  }

  function generateData(locations) {
    let world = {};
    let meta = {};
    let droplets = [];
    const worldSize = {
      x: 0, y: 0, z: 0
    }
    for (line of locations) {
      // console.log(line);
      const [x,y,z] = line.split(",").map(c => parseInt(c, 10));
      const droplet = {
        x,y,z,
        key: loc(x,y,z)
      }
      worldSize.x = Math.max(worldSize.x, x);
      worldSize.y = Math.max(worldSize.y, y);
      worldSize.z = Math.max(worldSize.z, z);
      addDroplet(droplet, world, meta);
      droplets.push(droplet);
    }

    return {
      world,
      meta,
      droplets,
      worldSize,
    };
  }

  function p1(squares, meta, context = "") {
    const outcomes = squares.map(d => {
      return 6 - (meta[d.key] ?? 0)
    });
    const result = outcomes.reduce((acc, c) => acc + c, 0);
    console.log(context, result);
    return result;
  }

  const {
    world,
    meta,
    droplets,
    worldSize,
  } = generateData(lines);
  const standard = p1(droplets, meta);
  console.log("p1", standard);

  console.log(worldSize);
  const visited = visit(world, worldSize);

  // const {
  //   world: reworld,
  //   meta: remeta,
  //   droplets: redroplets,
  //   worldSize: reworldSize,
  // } = generateData(Object.keys(visited));
  // // console.log(ndroplets)
  // const rep1 = p1(redroplets, remeta);
  // console.log("reworld", rep1);

  // Exclude unvisited empty regions as these are 'air pockets'
  let inaccessible = {};
  for (let x = 0; x < worldSize.x; x++) {
    for (let y = 0; y < worldSize.y; y++) {
      for (let z = 0; z < worldSize.z; z++) {
        const c = loc(x,y,z);
        if (!visited[c] && !world[c]) {
          inaccessible[c] = true;
        }
        // if (meta[c] === 6 && world[c]) {
        //   delete inaccessible[c];
        // }
      }
    }
  }

  const {
    world: nworld,
    meta: nmeta,
    droplets: ndroplets,
    worldSize: nworldSize,
  } = generateData(Object.keys(inaccessible));
  // console.log(ndroplets)
  const negative = p1(ndroplets, nmeta);

  // need to minus the inner edge (basically an inaccessibel square takes away)
  console.log("p2:", standard - negative);

})();

// find those totally enclosed
// find one edge enclosed
// ...


// ideas
// path from (0,0,0) to every point
// any which have no paths subtract

// ......
// .###..
// .# #..
// .###..
// ......
// ......
// .####.
// .#  #.
// .####.
// ......
// .####.
// .#  #.
// ..# #.
// ..###.
// ......
// ......
// .#####.
// .#   #.
// .# B #. B is inside so shouldn't be counted!?
// .#   #.
// .#####.
// .......

// That's not the right answer; your answer is too high. 
// Curiously, it's the right answer for someone else; you might be logged in to the wrong account or just unlucky. 
// In any case, you need to be using your puzzle input. 
// If you're stuck, make sure you're using the full input data; 
// there are also some general tips on the about page, or you can ask for hints on the subreddit. 
// Please wait one minute before trying again. (You guessed 2060.) [Return to Day 18]

// That's not the right answer; your answer is too low. 
// If you're stuck, make sure you're using the full input data; 
// there are also some general tips on the about page, or you can ask for hints on the subreddit. 
// Please wait one minute before trying again. (You guessed 1997.) [Return to Day 18]
