const aoc = require("../../aoc");

const JET_LEFT = '<';
const JET_RIGHT = '>';

const EMPTY = ".";
const WALL = "|";
const FLOOR = "-";
const ROCK_RESTING = "#";
const ROCK_FALLING = "@";

const DIRECTIONS = {
  EAST: [1, 0, "e"],
  SOUTH: [0, -1, "s"],
  WEST: [-1, 0, "w"],
  // [0, 1, "n"],
  // [-1, 1, "nw"],
  // [1, 1, "ne"],
  // [-1, -1, "sw"],
  // [1, -1, "se"]
};

(async function main() {
  const lines = await aoc.processFile();

  const jets = lines[0].split("");
  // console.log(jets);

  function loc(x,y) {
    return `${x}_${y}`;
  }
  function deloc(x_y) {
    const [x,y] = x_y.split("_").map(c => parseInt(c, 10));
    return {
      x,y
    };
  }

  function makeShape(shapeData, shapeId) {
    const result = {};
    shapeData.forEach((l, idx) => {
      const row = l.split("");
      const y = (shapeData.length - 1) - idx;
      row.forEach((d, x) => {
        if (d === ROCK_RESTING) {
          const c = loc(x,y);
          result[c] = shapeId;
        }
      });
    });
    function horizontalCollision() {

    }
    return {
      shapeId: shapeId,
      data: result,
      height: shapeData.length,
    };
  }

  const shapes = [
    makeShape(["####"], "H"),
    makeShape([".#.","###",".#."], "W"),
    makeShape(["..#","..#","###",], "J"),
    makeShape(["#","#","#","#"], "M"),
    makeShape(["##", "##"], "O")
  ];
  // console.log(shapes);

  function move(origin, [dx, dy]) {
    return {
      x: origin.x + dx,
      y: origin.y + dy
    };
  }

  // function testArea(world, width, shapeOrigin, shape) {
  //   const result = {};
  //   const startY = shapeOrigin.y - 1;
  //   const height = shape.height;
  //   for (let x = 0; x < width; ++x) {
  //     for (let y = startY; y < startY + height; ++y) {
  //       const c = loc(x, y);
  //       result[c] = world[x,y];
  //     }
  //   }
  //   return result;
  // }

  // TRUE if there is an overlap between world and shape
  function hasCollisions(region, width, shapeOrigin, shape) {
    return Object.keys(shape.data).some(k => {
      const {x: dx, y: dy} = deloc(k);
      const x = shapeOrigin.x + dx;
      const y = shapeOrigin.y + dy;
      const x_y = loc(x,y);
      return region[x_y] || y <= -1 || x <= -1 || x >= width;
    });
  }

  function rockAtRest(world, shapeOrigin, shape) {
    let highest = 0;
    const p = Object.keys(shape.data).map(k => {
      const {x: dx, y: dy} = deloc(k);
      const x = shapeOrigin.x + dx;
      const y = shapeOrigin.y + dy;
      const x_y = loc(x,y);
      highest = Math.max(highest, y);
      // world[x_y] = shape[k];
      return {
        key: x_y,
        value: shape.data[k]
      }
    }).reduce((acc, c) => {
      acc[c.key] = c.value;
      return acc
    }, {});

    const result = {
      ...world,
      ...p,
    };
    return {
      newWorld: result,
      highestShapeY: highest
    };
  }

  function maybeTetris(world, width, highestPoint = 0) {
    const rowCountByY = {};
    Object.keys(world).forEach(k => {
      const {x, y} = deloc(k);
      if (world[k]) {
        if (!rowCountByY[y]) {
          rowCountByY[y] = [];
        }
        rowCountByY[y].push(k);
      }
    });

    // idea1 - keep the top N lines
    // console.log(world);
    // console.log(rowCountByY, highestPoint);
    const toRemove = Object.keys(rowCountByY).filter(k => k < highestPoint - 50).map(k => rowCountByY[k]).flat();
    // console.log(toRemove);
    toRemove.forEach(k => {
      delete world[k];
    });

    // endidea1

    // got it! need to do..
    // -> find highest path which goes from L to R (NE,E,SE)
    // cache this state because its the new 'floor'
    // delete everything underneath
    // when simulating check if floor state matches existing; if so, we can 'skip' levels
    // i reckon after a couple of iterations all states covered.
    // so we may need to disconnect world for an worldOrigin + floor

    // console.log(rowCountByY);
    // const rawY = Object.entries(rowCountByY).find(([k, v]) => v.length >= width)?.[0];
    // const y = parseInt(rawY, 10);
    // // console.log(">",y);
    // if (!y) { return world; }
    // const toRemove = Object.keys(rowCountByY).filter(k => k < y).map(k => rowCountByY[k]).flat();
    // if (toRemove.length) {
    //   console.log("REMOVING", toRemove, y);
    // }
    // toRemove.forEach(k => {
    //   delete world[k];
    // });
    return world;
  }

  function debugWorld(world, width, highestPoint, shapeOrigin, shape) {
    // return;
    const globalShapeData = Object.keys(shape.data).map(k => {
      const {x: dx, y: dy} = deloc(k);
      const x = shapeOrigin.x + dx;
      const y = shapeOrigin.y + dy;
      const x_y = loc(x,y);
      return {
        key: x_y,
        value: shape.data[k]
      }
    }).reduce((acc, c) => {
      acc[c.key] = c.value;
      return acc;
    }, {});

    for (let y = highestPoint + 7; y >= 0; --y) {
      const row = [];
      row.push(WALL);
      for (let x = 0; x < width; ++x) {
        const l = loc(x, y);
        const globalShape = globalShapeData[l] ? ROCK_FALLING : null;
        row.push(globalShape ?? world[l] ?? EMPTY)
      }
      row.push(WALL);
      row.push(` ${y}`);

      console.log(row.join(""));
    }
    console.log("+-------+");
  }

  // data for each "####" end location
  const fallCache = [];

  const width = 7;
  let world = {};
  let highestPoint = 0;
  let rockCount = 0;
  let jetIdx = 0;
  let shapeIdx = 0;
  let shapeOrigin = { x: 2, y: 3 }
  let fallingShape = shapes[shapeIdx];
  console.log(fallingShape);
  let iterations = 0;
  debugWorld(world, width, highestPoint, shapeOrigin, fallingShape);
  let jetBuffer = [];
  const p1Rounds = 10022;
  const p2Rounds = 1000000000000;;
  while (rockCount < p1Rounds) {
    // console.log(jetIdx, shapeIdx, shapeOrigin)
    const jet = jets[jetIdx];
    jetBuffer.push({ jet, jetIdx });
    // console.log(shapeOrigin);

    let nextOrigin = null;
    if (jet === JET_LEFT) {
      nextOrigin = move(shapeOrigin, DIRECTIONS.WEST)
    } else if (jet === JET_RIGHT) {
      nextOrigin = move(shapeOrigin, DIRECTIONS.EAST)
    } else {
      throw new Error(`unknown jet direction ${jet}`);
    }
    // check collisions
    const hasHorizontalCollision = hasCollisions(world, width, nextOrigin, fallingShape);
    // if none then update origin
    if (!hasHorizontalCollision) {
      shapeOrigin = nextOrigin;
    }
    // console.log(jet);
    // debugWorld(world, width, highestPoint, shapeOrigin, fallingShape);

    // drop down
    nextOrigin = move(shapeOrigin, DIRECTIONS.SOUTH);
    const hasVerticalCollision = hasCollisions(world, width, nextOrigin, fallingShape);
    if (hasVerticalCollision) {
      // we stop at shapeOrigin because moving down would collide
      const { newWorld, highestShapeY } = rockAtRest(world, shapeOrigin, fallingShape);
      // console.log(highestShapeY);
      highestPoint = Math.max(...Object.keys(newWorld).map(c => deloc(c).y), highestShapeY);

      // if (shapeIdx === 0) {
        const fallData = {
          height: highestPoint,
          origin: shapeOrigin,
          rockCount,
          start: jetBuffer[0],
          end: jetBuffer[jetBuffer.length-1],
          shapeIdx,
        };
        // console.table(fallData);
        fallCache.push(fallData);
      // }
      jetBuffer = [];

      shapeIdx = (shapeIdx + 1) % shapes.length;
      fallingShape = shapes[shapeIdx];
      shapeOrigin = {
        x: 2,
        y: highestPoint + 4
      };
      world = newWorld;
      // i think one we find a 'loop' then all we need to do is multiply close to the target then resume simulation to the target
      // world = maybeTetris(newWorld, width, highestPoint); // idea has some merit
      // console.log(Object.keys(world).length, highestPoint);
      rockCount++;
      // console.log(rockCount);
      // console.log("V");
      iterations++;
      if (iterations === 10000) {
        console.log(rockCount);
        debugWorld(world, width, highestPoint, shapeOrigin, fallingShape);
        iterations = 0;
      }
    } else {
      shapeOrigin = nextOrigin;
      // console.log("V");
      // iterations++;
      // if (iterations === 10000) {
      //   console.log(rockCount);
      //   debugWorld(world, width, highestPoint, shapeOrigin, fallingShape);
      //   iterations = 0;
      // }
    }

    jetIdx = (jetIdx + 1) % jets.length;
  }
  debugWorld(world, width, highestPoint, shapeOrigin, fallingShape);
  console.log(highestPoint+1);
  // console.log(Object.keys(world).length);
  console.table(fallCache);

  // goal -> find when we 'loop' back to the start
  // once we do, just need to multiply to just before p2Target then replay for the remainder

  // P2 done via excel but needed code to generate and find the information to get it done
  // basically there is a initial amount of rocks falling, then a looping point, then rocks to fill the rest
  // in the looping point the same number pattern occurs and the number of rocks and height increments the same
  // 1MM = height(initial amount) + (N * height(loop)) + height(remainder)
  // where N = floor((1MM - initial) / loop)
  // remainder = 1MM - initial - N
  // sum the three parts and that's the height
})();

// P1
// up to 10 looks ok...
// test: 2568 (mismatch against data, but takes about 5sec to run)
// real: 2994 (not trustworthy but also takes 5sec)
