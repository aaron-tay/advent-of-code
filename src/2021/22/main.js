const aoc = require("../../aoc");

function makeKey({x,y,z}) {
  return `${x}_${y}_${z}`
}
function decodeKey(key) {
  return key.split("_").map(i => +i);
}

const LOW_BOUNDS = -50;
const HIGH_BOUNDS = 50;
function count(cubes) {
  let result = 0;
  for (let x = LOW_BOUNDS; x <= HIGH_BOUNDS; ++x) {
    for (let y = LOW_BOUNDS; y <= HIGH_BOUNDS; ++y) {
      for (let z = LOW_BOUNDS; z <= HIGH_BOUNDS; ++z) {
        const key = makeKey({x,y,z});
        if (cubes[key] === "on") {
          result++;
        }
      }
    }
  }
  return result;
}

function operate(operation) {
  const result = {};
  for (let x = operation.x.low; x <= operation.x.high; ++x) {
    for (let y = operation.y.low; y <= operation.y.high; ++y) {
      for (let z = operation.z.low; z <= operation.z.high; ++z) {
        const key = makeKey({x,y,z});
        result[key] = operation.op;
      }
    }
  }
  return result;
}

function getBounds(operations) {
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  operations.forEach(o => {
    minX = Math.min(o.x.low, minX);
    minY = Math.min(o.y.low, minY);
    minZ = Math.min(o.z.low, minZ);
    maxX = Math.max(o.x.high, maxX);
    maxY = Math.max(o.y.high, maxY);
    maxZ = Math.max(o.z.high, maxZ);
  });

  return {
    x: {
      min: minX,
      max: maxX,
    },
    y: {
      min: minY,
      max: maxY,
    },
    z: {
      min: minZ,
      max: maxX,
    },
  };
}

function p1(lines) {
  const operations = [];
  for (line of lines) {
    const [op, other] = line.split(" ");
    const [x,y,z] = other.split(",");
    const [xLow, xHigh] = x.split("=")[1].split("..").map(i => +i);
    const [yLow, yHigh] = y.split("=")[1].split("..").map(i => +i);
    const [zLow, zHigh] = z.split("=")[1].split("..").map(i => +i);

    operations.push({
      op,
      x: {
        low: xLow,
        high: xHigh,
      },
      y: {
        low: yLow,
        high: yHigh,
      },
      z: {
        low: zLow,
        high: zHigh,
      },
    });
  }
  console.log(operations);

  let cubes = {};
  operations.forEach((operation, idx) => {
    const result = operate(operation);
    // console.log(result);
    const updatedCubes = {
      ...cubes,
      ...result,
    };
    cubes = updatedCubes;
    console.log(idx);
  });
  const result = count(cubes);
  console.log(result);
}

(async function main() {
  const lines = await aoc.processFile();

  const operations = [];
  for (line of lines) {
    const [op, other] = line.split(" ");
    const [x,y,z] = other.split(",");
    const [xLow, xHigh] = x.split("=")[1].split("..").map(i => +i);
    const [yLow, yHigh] = y.split("=")[1].split("..").map(i => +i);
    const [zLow, zHigh] = z.split("=")[1].split("..").map(i => +i);

    operations.push({
      op,
      x: {
        low: xLow,
        high: xHigh,
      },
      y: {
        low: yLow,
        high: yHigh,
      },
      z: {
        low: zLow,
        high: zHigh,
      },
    });
  }
  console.log(operations);
  const bounds = getBounds(operations);
  console.table(bounds);
  for (let i = 0; i < (8000000000000); ++i) {
    if (i % 1000000000 === 0) {
      console.log(i);
    } 
  }
})();

// probably need to preprocess and run in batch as opposed to looping each operation
// can group 'same' operations
// just have to 'count' max-min=#cubes

// https://stackoverflow.com/questions/5556170/finding-shared-volume-of-two-overlapping-cuboids
// volumes of cubes
// each incoming cube needs to be considered against others
// delphinium-442f5