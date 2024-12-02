const aoc = require("../../aoc");

function run(velocity, targetArea) {
  let hasHitTarget = false;
  let currentPosition = {x:0, y:0};
  let currentVelocity = {...velocity};
  let t = 0;
  let maxHeight = 0;

  let hasOvershot = false;
  while (!hasOvershot && !hasHitTarget) {
    t++;
    const { 
      position: newPosition,
      velocity: newVelocity } = step({ position: currentPosition, velocity: currentVelocity });
    currentPosition = newPosition;
    currentVelocity = newVelocity;
    hasHitTarget = withinBounds(currentPosition, targetArea);
    
    maxHeight = Math.max(maxHeight, currentPosition.y);

    if (currentVelocity.x > 0) {
      hasOvershot = (currentPosition.x > targetArea.high.x);
      continue;
    } else if (currentVelocity.x < 0) {
      hasOvershot = (currentPosition.x < targetArea.low.x);
      continue;
    }
    hasOvershot = (currentPosition.y < targetArea.low.y);
  }

  return {
    hasHitTarget,
    endPosition: currentPosition,
    velocity,
    t,
    maxHeight
  }
}

function step({ position, velocity }) {
  const newPos = {...position};
  const newVel = {...velocity};

  newPos.x += velocity.x;
  newPos.y += velocity.y;
  if (velocity.x < 0) {
    newVel.x += 1;
  } else if (velocity.x > 0) {
    newVel.x -= 1;
  }
  newVel.y -= 1;

  return {
    position: newPos,
    velocity: newVel,
  };
}

function withinBounds(pos, bounds) {
  return (
    (bounds.low.x <= pos.x && pos.x <= bounds.high.x)
    && 
    (bounds.low.y <= pos.y && pos.y <= bounds.high.y)
  );
}

(async function main() {
  const lines = await aoc.processFile();

  // target area: x=20..30, y=-10..-5
  console.log(lines[0]);
  const [_target,_area,xData,yData] = lines[0].replace(",", "").split(" ");
  const [xLow,xHigh] = xData.split("=")[1].split("..").map(i => +i);
  const [yLow,yHigh] = yData.split("=")[1].split("..").map(i => +i);

  console.log({xLow, xHigh}, {yLow, yHigh});
  const bounds = {
    low: {x: xLow, y:yLow},
    high: {x: xHigh, y: yHigh}
  }

  const maxVelocity = {
    x: bounds.high.x,
    y: Math.abs(bounds.high.y) + Math.abs(bounds.low.y),
  }
  // const result = run({x:6, y:9}, bounds);
  // console.table(result)
  let bestResult = {
    maxHeight: 0
  };
  console.log(maxVelocity.x, maxVelocity.y, maxVelocity.x * maxVelocity.y);
  let count = 0;
  for (let x = -maxVelocity.x*10; x < maxVelocity.x*10; ++x) {
    for (let y = -maxVelocity.y*10; y < maxVelocity.y*10; ++y) {
      const result = run({x, y}, bounds);
      if (result.hasHitTarget) {
        if (result.maxHeight > bestResult.maxHeight) {
          bestResult = result;
          console.table(result);
        }
        count++;
      }
    }
  }
  console.table(bestResult)
  console.log(count);

})();
