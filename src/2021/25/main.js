const aoc = require("../../aoc");

const DIRECTIONS = {
  EAST: { r: 0, c: 1 },
  SOUTH: { r: 1, c: 0 },
};

const FEATURE = {
  EMPTY: ".",
  EASTIE: ">",
  SOUTHIE: "v",
};

function nextCoordinate({r, c}, direction, world) {
  const nr = (direction.r + r) % (world.length);
  const nc = (direction.c + c) % (world[0].length);
  return {
    r: nr,
    c: nc,
  };
}

function canMove({r,c}, direction, world) {
  const { r: nr, c: nc } = nextCoordinate({r,c}, direction, world);
  return world[nr][nc] === FEATURE.EMPTY;
}

function collectEast(row, world) {
  const horizontal = world[row];
  const cucumbers = [];
  horizontal.forEach((feature, c) => {
    if (feature !== FEATURE.EASTIE) { return; }
    if (canMove({r:row, c}, DIRECTIONS.EAST, world)) {
      cucumbers.push({
        r: row,
        c
      });
    }
  });
  return cucumbers;
}

function collectSouth(column, world) {
  const vertical = world.map((row, r) => {
    return row[column];
  });
  const cucumbers = [];
  vertical.forEach((feature, rowIdx) => {
    if (feature !== FEATURE.SOUTHIE) { return; }
    if (canMove({r:rowIdx, c:column}, DIRECTIONS.SOUTH, world)) {
      cucumbers.push({
        r: rowIdx,
        c: column
      });
    }
  });
  return cucumbers;
}

function step(world) {
  const result = world.map(r => r.map(c => c));
  let didMove = false;

  for (let r = 0; r < world.length; ++r) {
    const cucumbers = collectEast(r, world);
    cucumbers.forEach(({r:or, c:oc}) => {
      const {r: nr, c: nc} = nextCoordinate({r:or, c:oc}, DIRECTIONS.EAST, world);
      result[nr][nc] = FEATURE.EASTIE;
      result[or][oc] = FEATURE.EMPTY;
    });
    didMove |= cucumbers.length > 0;
  }

  for (let c = 0; c < result[0].length; ++c) {
    const cucumbers = collectSouth(c, result);
    cucumbers.forEach(({r:or, c:oc}) => {
      const {r: nr, c: nc} = nextCoordinate({r:or, c:oc}, DIRECTIONS.SOUTH, result);
      result[nr][nc] = FEATURE.SOUTHIE;
      result[or][oc] = FEATURE.EMPTY;
    });
    didMove |= cucumbers.length > 0;
  }

  return {
    world: result,
    didMove,
  };
}

function p1(world) {
  let newWorld = world.map(r => r.map(c => c));
  let didMove = true;
  let steps = 0;
  while (didMove) {
    const stepResult = step(newWorld);
    didMove = stepResult.didMove;
    newWorld = stepResult.world;
    steps++;
  }
  console.table(newWorld);
  return steps;
}

(async function main() {
  const lines = await aoc.processFile();

  const world = lines.map(line => {
    return line.split("");
  });

  console.log(world);
  const result = p1(world)
  console.log(">", result);
})();
