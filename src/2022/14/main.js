const aoc = require("../../aoc");

// + is downwards
const DIRECTIONS = [
  // [1, 0, "e"],
  // [0, -1, "s"],
  // [-1, 0, "w"],
  [0, 1, "n"],
  [-1, 1, "nw"],
  [1, 1, "ne"],
  // [-1, -1, "sw"],
  // [1, -1, "se"]
];

const ROCK = "#";
const EMPTY = ".";
const SAND = "o";
const SOURCE = "+";
const IGNORE = "!";

(async function main() {
  const source = {x:500, y:0};
  const lines = await aoc.processFile();

  function loc(x, y) {
    return `${x}_${y}`;
  }

  function setValue(x, y, map, value) {
    const c = loc(x,y);
    map[c] = value;
  }

  function getValue(x, y, map) {
    const c = loc(x,y);
    return map[c];
  }

  function debugMap(map) {
    const width = 80;
    const height = 180;
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = source.x-width; x < source.x+width; x++) {
        if (x === source.x && y === source.y) {
          row.push(SOURCE);
        } else {
          const v = getValue(x, y, map) ?? EMPTY;
          row.push(v);
        }
      }
      console.log(row.join(""));
    }
  }

  function addPathToMap(start, end, map) {
    if (start.x === end.x) {
      const x = start.x;
      for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); ++y) {
        setValue(x, y, map, ROCK);
      }
    } else if (start.y === end.y) {
      const y = start.y;
      for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); ++x) {
        setValue(x, y, map, ROCK);
      }
    } else {
      throw new Error(`not straight line: ${start} ${end}`);
    }
  }

  function addRockPathsToMap(paths, map) {
    // always at least 2
    let start = paths[0];
    for (let i = 1; i < paths.length; ++i) {
      const end = paths[i];
      addPathToMap(start, end, map);
      start = end;
    }
  }

  function newPosition(pos, [dx, dy]) {
    return {
      x: pos.x + dx,
      y: pos.y + dy
    };
  }

  const DOWN = [0, 1, "n"];
  const DOWN_LEFT = [-1, 1, "nw"];
  const DOWN_RIGHT = [1, 1, "ne"];
  function nextFallPosition(sandPosition, map) {
    // down
    let dPos = newPosition(sandPosition, DOWN);
    let v = getValue(dPos.x, dPos.y, map);
    if (v !== ROCK && v !== SAND) {
      return dPos;
    }

    // down-left
    dPos = newPosition(sandPosition, DOWN_LEFT);
    v = getValue(dPos.x, dPos.y, map);
    if (v !== ROCK && v !== SAND) {
      return dPos;
    }

    // down-right
    dPos = newPosition(sandPosition, DOWN_RIGHT);
    v = getValue(dPos.x, dPos.y, map);
    if (v !== ROCK && v !== SAND) {
      return dPos;
    }

    return sandPosition;
  }

  function p1() {
    const map = {};
    let deepestTrench = 0;
    let farLeft = 500;
    let farRight = 500;
    for (line of lines) {
      const paths = line.split(" -> ").map(p => {
        const [x,y] = p.split(",").map(c => parseInt(c, 10));
        return {x,y};
      });
      addRockPathsToMap(paths, map);
      const deepest = Math.max(...paths.map(({x,y}) => y));
      deepestTrench = Math.max(deepestTrench, deepest);
      
      const left = Math.min(...paths.map(({x,y}) => x));
      farLeft = Math.min(farLeft, left);
      const right = Math.max(...paths.map(({x,y}) => x));
      farRight = Math.max(farRight, right);
    }
    console.log(deepestTrench, farLeft, farRight);
    deepestTrench = deepestTrench + 2;
    // let's put a bounding box around our rocks
    const filledMap = {...map};

    addRockPathsToMap([{
      x: farLeft-5,
      y: deepestTrench,
    },{
      x: farRight+5,
      y: deepestTrench,
    }], filledMap);
    addRockPathsToMap([{
      x: farLeft-5,
      y: 0,
    },{
      x: farLeft-5,
      y: deepestTrench,
    }], filledMap);
    addRockPathsToMap([{
      x: farRight+5,
      y: 0,
    },{
      x: farRight+5,
      y: deepestTrench,
    }], filledMap);
    // debugMap(map);
    // return;
  
    let step = 0;
    let atRestUnits = 0;
    let sandPosition = {...source};
    let numStuck = 0;
    console.log(sandPosition);
    while (true) {
      const ds = nextFallPosition(sandPosition, filledMap);
      if (sandPosition.x === ds.x && sandPosition.y === ds.y) {
        // at rest
        sandPosition = {...source};
        setValue(ds.x, ds.y, filledMap, SAND);
        atRestUnits++;
      } else {
        sandPosition = ds;
      }
      if (sandPosition.y > deepestTrench) {
        break;
      }
      if (sandPosition.y === source.y && sandPosition.x === source.x) {
        numStuck++;
        if (numStuck > 50000) { break;}
      }
      ++step;
    }
    debugMap(filledMap);
    console.log(atRestUnits);
    return {
      map,
      filledMap,
      deepestTrench,
      farLeft,
      farRight,
    };
  }
  const {
    map,
    filledMap,
    deepestTrench,
    farLeft,
    farRight,
  } = p1();
  debugMap(filledMap);

  // only count empty spaces between sand
  const emptySegments = [];
  for (let y = 0; y < deepestTrench; ++y) {
    let buffer = [];
    let lastSeenType = IGNORE;
    let shouldCount = false;
    for (let x = farLeft-5; x < farRight+5; ++x) {
      const f = getValue(x, y, filledMap) ?? EMPTY;
      if (lastSeenType !== f) {
        if (f !== EMPTY) {
          if (lastSeenType === EMPTY && shouldCount) {
            emptySegments.push(buffer.length);
          }
        }
        buffer = [];
        lastSeenType = f;
      }
      if (f === SAND) {
        shouldCount = true;
      }
      buffer.push(f);
    }
  }
  console.log(emptySegments);
  const rocks = Object.values(map).filter(v => v === ROCK);

  // const totalArea = 30276;
  const totalArea = (deepestTrench / 2) * (2 + ((deepestTrench - 1) * 2));
  // const shelters = longPaths.map(l => l - 2).reduce((acc, c) => acc+c, 0);
  const shelters = emptySegments.reduce((acc, c) => acc+c, 0);
  const result = totalArea - rocks.length - shelters;
  console.log(deepestTrench, totalArea, shelters, rocks.length, result);
})();

// total area - rocks - (horizontal-2)*number of horizontal
// where horizontal > 3

// h = deepestTrench
// w = 
// 174 479 548
// 1 3 5 7 9
// (174/2)(2 + (174-1)*2) => 30,276

// That's not the right answer; your answer is too high. 
// If you're stuck, make sure you're using the full input data; 
// there are also some general tips on the about page, or you can ask for hints on the subreddit. 
// Please wait one minute before trying again. (You guessed 29932.) [Return to Day 14]
// 29932

// 29044