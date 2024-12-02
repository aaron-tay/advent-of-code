const aoc = require("../../aoc");

const DIRECTIONS = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0]
};

function dirToDirection(dir) {
  switch(dir) {
    case "U": case "N": return "N";
    case "R": case "E": return "E";
    case "D": case "S": return "S";
    case "L": case "W": return "W";
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

  function worldDimensions(world) {
    const minX = Math.min(...Object.keys(world).map(loc => { const [x,y] = fromLoc(loc); return { x, y }}).map(({x}) => x));
    const maxX = Math.max(...Object.keys(world).map(loc => { const [x,y] = fromLoc(loc); return { x, y }}).map(({x}) => x));
    const minY = Math.min(...Object.keys(world).map(loc => { const [x,y] = fromLoc(loc); return { x, y }}).map(({y}) => y));
    const maxY = Math.max(...Object.keys(world).map(loc => { const [x,y] = fromLoc(loc); return { x, y }}).map(({y}) => y));
    
    const area = (Math.abs(maxX) + Math.abs(minX) + 1) * (Math.abs(maxY) + Math.abs(minY) + 1);
    return {
      minX,
      maxX,
      minY,
      maxY,
      area
    }
  }

  function debugWorld(world, cellFormatter = (c) => c, emptyFormatter = () => ".") {
    const { minX, maxX, minY, maxY } = worldDimensions(world);
    console.log(minX, maxX, minY, maxY);
    let out = "";
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const l = toLoc(x,y);
        if (!!world[l]) {
          out += emptyFormatter();
          continue;
        }
        out += cellFormatter(world[l], l);
      }
      out += "\n";
    }
    console.log(out);
  }
  
  function insideOrOutside(world) {
    const { minX, maxX, minY, maxY } = worldDimensions(world);

    const result = {};
    // assume outside but every # encountered flips it
    for (let y = minY; y <= maxY; y++) {
      let isInside = false;
      for (let x = minX; x <= maxX; x++) {
        const l = toLoc(x,y);
        const pl = toLoc(x-1, y);
        if (world[l] && !world[pl]) {
          isInside = !isInside;
        }
        result[l] = isInside;
      }
    }
    return result;
  }

  function mergeWorlds(world, other) {
    const { minX, maxX, minY, maxY } = worldDimensions(world);

    const result = {};
    // assume outside but every # encountered flips it
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const l = toLoc(x,y);
        if (!!world[l] || !!other[l]) {
          result[l] = "#";
        }
      }
    }
    return result;
  }

  const digPlans = [];
  for (line of lines) {
    console.log(line);
    const [rawDir, distance, code] = line.split(" ");
    const rgbaParts = /\(#(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2}))\)/i.exec(code);
    const [_, rgb] = rgbaParts;
    digPlans.push({
      dir: rawDir,
      heading: dirToDirection(rawDir),
      distance: +distance,
      rgb
    });
  }
  console.table(digPlans);

  const start = toLoc(0,0);
  const world = {};
  let currentLoc = start;
  digPlans.forEach(({heading, distance, rgb}) => {
    const [dx, dy] = DIRECTIONS[heading];
    console.log(heading, distance, rgb);
    for (let step = 0; step < distance; ++step) {
      const [x, y] = fromLoc(currentLoc);
      const nextLoc = toLoc(x + dx, y + dy);
      // console.log(currentLoc, nextLoc);
      world[nextLoc] = rgb;
      currentLoc = nextLoc;
    }
  });
  console.table(world);
  // debugWorld(world, (c) => c ? "#" : ".");
  
  const insideOrOutsideWorld = insideOrOutside(world);
  // debugWorld(insideOrOutsideWorld, (c) => c ? "." : "#", () => ".");

  const mergedWorlds = mergeWorlds(world, insideOrOutsideWorld);
  debugWorld(mergedWorlds, (c) => c ? "." : "#", () => ".");

  // const { area } = worldDimensions(world);
  // console.table(mergedWorlds);
  // const exteriors = Object.values(mergedWorlds).filter(c => c === "#");
  // console.log(area, exteriors.length);
})();

// 69698 too low