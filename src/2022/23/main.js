const aoc = require("../../aoc");

const ELF = "#";
const OPEN = ".";

const DIRECTIONS = Object.freeze([
  Object.freeze([0, -1, "n"]),
  Object.freeze([0, 1, "s"]),
  Object.freeze([-1, 0, "w"]),
  Object.freeze([1, 0, "e"]),
  Object.freeze([-1, -1, "nw"]),
  Object.freeze([1, -1, "ne"]),
  Object.freeze([-1, 1, "sw"]),
  Object.freeze([1, 1, "se"]),
]);
const DIRECTON_NONE = [0,0,"?"];

const PROPOSAL_LIST = Object.freeze([
  DIRECTIONS[0],
  DIRECTIONS[1],
  DIRECTIONS[2],
  DIRECTIONS[3],
]);

(async function main() {
  const lines = await aoc.processFile();

  const neighbourMemo = {};
  function getNeighbourDirections(mainDirection) { //nswe only expected
    const dirCode = mainDirection[2];
    if (neighbourMemo[dirCode]) {
      return neighbourMemo[dirCode];
    }

    const result = DIRECTIONS.filter(d => d[2].split("").includes(dirCode));

    neighbourMemo[dirCode] = result;
    return neighbourMemo[dirCode];
  }

  function debugGrid(grid, width, height, minX = 0, minY = 0) {
    const output = [];
    for (let y = minY; y < height; ++y) {
      const row = [];
      for (let x = minX; x < width; ++x) {
        const c = loc(x,y);
        row.push(grid[c] ?? OPEN);
      }
      output.push(row.join(""));
    }
    console.log(output.join("\n"));
  }

  function loc(x, y) {
    return `${x}_${y}`;
  }
  function deloc(xy) {
    const [x,y] = xy.split("_").map(c => parseInt(c, 10));
    return {x,y};
  }

  function transform(location, direction) {
    const [ dx, dy ] = direction;
    const { x, y } = location;
    return {
      x: x + dx,
      y: y + dy
    };
  }

  function getProposedDirection(elfLocation, elves, directionOrder) {
    const isElfNearby = DIRECTIONS.map(d => transform(elfLocation, d)).map(({x,y}) => loc(x,y)).some(c => elves[c]);
    if (!isElfNearby) { return null; }

    const result = directionOrder.find(d => {
      const nDir = getNeighbourDirections(d);
      const nLocs = nDir.map(d => transform(elfLocation, d)).map(({x,y}) => loc(x,y));
      return !nLocs.some(c => elves[c]);
    });

    return result;
  }

  function firstHalf(elves, directionOrder) {
    const result = {};

    let numRealProposals = 0;
    Object.keys(elves).forEach(c => {
      const { x, y } = deloc(c);
      const pDirection = getProposedDirection({x,y}, elves, directionOrder);
      if (pDirection) {
        result[c] = transform({ x, y }, pDirection);
        numRealProposals++;
      } else {
        result[c] = { x, y };
      }
    });

    return {
      result,
      numRealProposals
    };
  }

  function secondHalf(elfProposals) {
    const collisions = {};
    Object.keys(elfProposals).forEach(currentElfLoc => {
      const proposal = elfProposals[currentElfLoc];
      const pLoc = loc(proposal.x, proposal.y);
      if (!collisions[pLoc]) {
        collisions[pLoc] = [];
      }
      collisions[pLoc].push(currentElfLoc);
    });

    // find those with no collisions (i.e. at most one in its square)
    const result = {};
    Object.keys(collisions).forEach(pLoc => {
      if (collisions[pLoc]?.length === 1) {
        result[pLoc] = ELF;
      } else {
        collisions[pLoc].forEach(el => {
          result[el] = ELF;
        })
      }
    });

    return result;
  }

  function boundingBox(elves) {
    const result = {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    }

    Object.keys(elves).map(deloc).forEach(({x,y}) => {
      result.minX = Math.min(result.minX, x);
      result.maxX = Math.max(result.maxX, x+1);
      result.minY = Math.min(result.minY, y);
      result.maxY = Math.max(result.maxY, y+1);
    });
    return result;
  }

  function area(bb) {
    return (bb.maxX - bb.minX) * (bb.maxY - bb.minY);
  }

  const world = {};
  const elves = {};
  lines.forEach((line, yy) => {
    console.log(line);
    line.split("").forEach((v, xx) => {
      const c = loc(xx,yy);
      world[c] = v;
      if (v === ELF) {
        elves[c] = v;
      }
    });
  });
  console.table(elves);

  const numRounds = 10000000000000;
  let roundElves = {...elves};
  let directionOrder = [...PROPOSAL_LIST];
  for (let round = 0; round < numRounds; ++round) {
    console.log(round);
    const { result: p, numRealProposals } = firstHalf(roundElves, directionOrder);
    // console.table(p);
    const r = secondHalf(p);
    // debugGrid(r, 8, 8, -3, -3);
    roundElves = r;
    const f = directionOrder.shift();
    directionOrder.push(f);
    if (numRealProposals === 0) {
      console.log("p2 => ",round+1);
      // no-one moving
      round = numRounds;
    }
  }
  // console.log();
  // const bb = boundingBox(roundElves);
  // console.table(bb);
  // debugGrid(roundElves, bb.maxX, bb.maxY, bb.minX, bb.minY);
  // const bbArea = area(bb);
  // const p1Result = bbArea - Object.keys(roundElves).length;
  // console.log(bbArea, p1Result);
  
})();

// That's not the right answer; your answer is too high. 
// Please wait one minute before trying again. (You guessed 6889.) [Return to Day 23]