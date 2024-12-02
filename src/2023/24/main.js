const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function hailstoneToLine(hailstone) {
    const {x,y,z} = hailstone.position;
    const {dx,dy,dz} = hailstone.velocity;
    const x1 = x;
    const y1 = y;
    const x2 = x + dx;
    const y2 = y + dy;
    return {
      x1, y1, x2, y2
    };
  }

  function getLineIntersectionPointXY(l1, l2) {
    const { x1, x2, y1, y2 } = l1;
    const { x1: x3, x2: x4, y1: y3, y2: y4 } = l2;

    const denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    const ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    const ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
  }

  const hailstones = [];
  for (line of lines) {
    const [position, velocity] = line.split(" @ ").map(n => n.trim());
    const [x,y,z] = position.split(",").map(n => n.trim()).map(n => +n);
    const [dx,dy,dz] = velocity.split(",").map(n => n.trim()).map(n => +n);
    hailstones.push({
      raw: {
        position,
        velocity
      },
      position: {x,y,z},
      velocity: {dx,dy,dz}
    });
  }
  // console.log(hailstones);

  const intersections = [];
  for (let c = 0; c < hailstones.length; c++) {
    for (let i = c+1; i < hailstones.length; i++) {
      if (i === c) { continue; }
      const l1 = hailstoneToLine(hailstones[i]);
      const l2 = hailstoneToLine(hailstones[c]);
      const p = getLineIntersectionPointXY(l1, l2);
      console.log(hailstones[i], hailstones[c], l1, l2, p);
      intersections.push({
        l1, l2,
        p
      });
    }
  }
  const RANGE = {
    MIN: 200000000000000,
    MAX: 400000000000000
  };
  const inArea = intersections.filter(c => c.p).filter(({ l1, l2, p }) => {
    const { x1, x2, y1, y2 } = l1;
    const { x1: x3, x2: x4, y1: y3, y2: y4 } = l2;
    const l1xDir = x2 - x1;
    const l1yDir = y2 - y1;
    const l2xDir = x4 - x3;
    const l2yDir = y4 - y3;

    const { x, y } = p;
    // check that x,y are along the same direction as the lines
    const l1x = x - x1;
    const l1y = y - y1;
    const l2x = x - x3;
    const l2y = y - y3;
    const l1xDirMatch = l1xDir * l1x >= 0;
    const l1yDirMatch = l1yDir * l1y >= 0;
    const l2xDirMatch = l2xDir * l2x >= 0;
    const l2yDirMatch = l2yDir * l2y >= 0;
    return l1xDirMatch && l1yDirMatch && l2xDirMatch && l2yDirMatch;
  }).filter(({ p }) => {
    const { x, y } = p;
    return RANGE.MIN <= x && x <= RANGE.MAX && RANGE.MIN <= y && y <= RANGE.MAX;
  });
  console.log(inArea);
  console.log(inArea.length);
})();

// 0 nope :P wrong input file -.-"