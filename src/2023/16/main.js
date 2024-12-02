const aoc = require("../../aoc");

const DIRECTIONS = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0]
};
const ROTATIONS = {
  L: -1,
  R: 1
};
// returns the KEY
function rotate(direction, rotation) {
  const directions = Object.keys(DIRECTIONS);
  const index = directions.indexOf(direction);
  const nextIndex = (index + rotation + directions.length) % directions.length;
  return directions[nextIndex];
}
function enteringFrom(heading) {
  switch (heading) {
    case "N": return "S";
    case "E": return "W";
    case "S": return "N";
    case "W": return "E";
  }
}

(async function main() {
  const lines = await aoc.processFile();

  function fromLoc(loc) {
    return loc.split(",").map(Number);
  }
  function toLoc(x, y) {
    return `${x},${y}`;
  }
  function toVec(x,y,heading) {
    return `${x},${y},${heading}`;
  }
  function fromVec(vec) {
    const [rx, ry, d] = vec.split(",");
    return [+rx, +ry, d];
  }

  function makeBeamDirections(char) {
    switch (char) {
      case "|": {
        return {
          N: ["S"],
          E: ["N", "S"],
          S: ["N"],
          W: ["N", "S"]
        };
      }
      case "-": {
        return {
          N: ["E", "W"],
          E: ["W"],
          S: ["E", "W"],
          W: ["E"]
        };
      }
      case "/": {
        return {
          N: ["W"],
          E: ["S"],
          S: ["E"],
          W: ["N"]
        };
      }
      case "\\": {
        return {
          N: ["E"],
          E: ["N"],
          S: ["W"],
          W: ["S"]
        };
      }
      default: {
        return {
          N: ["S"],
          E: ["W"],
          S: ["N"],
          W: ["E"]
        };
      }
    }
  }

  const world = {};
  lines.forEach((line, y) => {
    console.log(line);
    line.split("").forEach((c, x) => {
      const loc = toLoc(x,y);
      world[loc] = {
        char: c,
        beamDirectionEnterExit: makeBeamDirections(c)
      };
    });
  });
  // console.log(world);

  function findEnergisedTiles(input, start = toVec(0,0,"E")) {
    const visited = new Set();
    const queue = [start];
    const trace = [];
    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) {
        continue;
      }
      visited.add(current);
      
      const [x, y, heading] = fromVec(current);
      const tile = world[toLoc(x,y)];
      if (!tile) { continue; }

      trace.push(current);
      const enteringFromHeading = enteringFrom(heading);
      const beamDirections = tile.beamDirectionEnterExit[enteringFromHeading];
      // console.log(current, tile.char, enteringFromHeading, "beamDirections", beamDirections);
      beamDirections.forEach((bHeading) => {
        const direction = DIRECTIONS[bHeading];
        const [dx, dy] = direction;
        const nextVec = toVec(x + dx, y + dy, bHeading)
        // console.log(" ", nextVec);
        queue.push(nextVec);
      });
    }

    // console.log(visited);
    // console.log(trace);

    const asLocs = trace.map(t => fromVec(t)).map(([x,y]) => toLoc(x,y));
    const uniqueLocs = new Set(asLocs);
    return {
      trace,
      uniqueLocs,
    };
  }

  const r = findEnergisedTiles(world);
  console.log(r.uniqueLocs.size);

  const maxX = Math.max(...Object.keys(world).map(fromLoc).map(([x,y]) => x));
  const maxY = Math.max(...Object.keys(world).map(fromLoc).map(([x,y]) => y));
  console.log(maxX, maxY);

  const startings = [];
  for (let x = 0; x <= maxX; x++) {
    const loc = toLoc(x,0);
    const tile = world[loc];
    startings.push(toVec(x,0,"S"));
  }
  for (let x = 0; x <= maxX; x++) {
    const loc = toLoc(x,maxY);
    const tile = world[loc];
    startings.push(toVec(x,maxY,"N"));
  }
  for (let y = 0; y <= maxY; y++) {
    const loc = toLoc(0,y);
    const tile = world[loc];
    startings.push(toVec(0,y,"E"));
  }
  for (let y = 0; y <= maxY; y++) {
    const loc = toLoc(maxX,y);
    const tile = world[loc];
    startings.push(toVec(maxX,y,"W"));
  }
  console.log(startings);

  const s = startings.map(s => findEnergisedTiles(world, s)).map(r => r.uniqueLocs.size);
  console.log(Math.max(...s));
})();
