const aoc = require("../../aoc");

function ventStraightPath({ x1, y1, x2, y2 }) {
  const result = [];

  if (x1 === x2) {
    for (let i = Math.min(y1, y2); i <= Math.max(y1, y2); i += 1) {
      const key = `${x1}_${i}`;
      result.push(key);
    }
  } else {
    for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i += 1) {
      const key = `${i}_${y1}`;
      result.push(key);
    }
  }

  return result;
}

function ventDiagonalPath({ x1, y1, x2, y2 }) {
  const result = [];

  const dy = Math.sign(y2-y1); 
  const dx = Math.sign(x2-x1);
  console.log(dx, dy);

  let x = x1;
  let y = y1;
  while ((x != x2 || y != y2)) {
    const key = `${x}_${y}`;
    result.push(key);
    x += dx;
    y += dy;
  }
  const key = `${x}_${y}`;
  result.push(key);

  return result;
}

function p1(lines) {
  const ventLines = []
  for (line of lines) {
    const [start, end] = line.split(" -> ");
    const [x1,y1] = start.split(",").map(i => +i);
    const [x2,y2] = end.split(",").map(i => +i);
    ventLines.push({
      x1, y1, x2, y2
    });
  }

  const onlyStraight = ventLines.filter(vl => {
    if (vl.x1 === vl.x2) { return true; }
    if (vl.y1 === vl.y2) { return true; }
    return false;
  });

  const overlaps = {};
  onlyStraight.forEach(vl => {
    console.log(vl);
    const path = ventDiagonalPath(vl);
    path.forEach(key => {
      if (!overlaps[key]) { overlaps[key] = 0; }
      overlaps[key]++;
    })
  });
  console.log(overlaps);
  let numOverlaps = 0;
  Object.keys(overlaps).forEach((key, idx) => {
    if (overlaps[key] > 1) {
      numOverlaps++;
    }
  });
  console.log(">", numOverlaps);
}

(async function main() {
  const lines = await aoc.processFile();

  p1(lines);

  const ventLines = []
  for (line of lines) {
    const [start, end] = line.split(" -> ");
    const [x1,y1] = start.split(",").map(i => +i);
    const [x2,y2] = end.split(",").map(i => +i);
    ventLines.push({
      x1, y1, x2, y2
    });
  }

  const overlaps = {};
  ventLines.forEach(vl => {
    console.log(vl);
    const path = ventDiagonalPath(vl);
    path.forEach(key => {
      if (!overlaps[key]) { overlaps[key] = 0; }
      overlaps[key]++;
    });
  });
  console.log(overlaps);
  let numOverlaps = 0;
  Object.keys(overlaps).forEach((key, idx) => {
    if (overlaps[key] > 1) {
      numOverlaps++;
    }
  });
  console.log(numOverlaps);

})();
