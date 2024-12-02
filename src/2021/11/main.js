const aoc = require("../../aoc");

const DIRECTION = {
  N: [1, 0],
  S: [-1, 0],
  E: [0, 1],
  W: [0, -1],
  NE: [1, 1],
  SE: [-1, 1],
  SW: [-1, -1],
  NW: [1, -1]
}

// map is [r][c]
function getNeighbours({ r, c}, map) {
  const current = map[r][c];
  const result = Object.values(DIRECTION).filter(([dx, dy]) => {
    if (map[r+dx] === undefined) { return false; }
    if (map[r+dx][c+dy] === undefined) { return false; }
    const candidate = map[r+dx][c+dy];
    return candidate;
  }).map(([dx, dy]) => ({ r: r+dx, c: c+dy }));
  // console.log(">", result);
  return result;
}

function byLevel(pod) {
  const byLevel = {};
  pod.forEach((row, r) => {
    row.forEach((n, c) => {
      let level = n;
      if (n > 9) { level = 10 }
      if (!byLevel[level]) {
        byLevel[level] = [];
      }
      byLevel[level].push({ r, c });
    });
  });
  return byLevel;
}

function flashStep(pod) {
  let numFlashes = 0;

  let newPod = pod.map(r => r.map(c => c));
  newPod.forEach((row, r) => {
    row.forEach((n, c) => {
      newPod[r][c]++;
    });
  });
  const leveled = byLevel(newPod);
  const didFlash = new Set();
  let willFlash = leveled[10] || [];
  while (willFlash.length > 0) {
    // console.table(newPod);
    // console.table(willFlash);
    willFlash.forEach(({r, c}) => {
      didFlash.add(`${r}_${c}}`);
      numFlashes++;
      newPod[r][c] = 0;
    });

    willFlash.map(({ r, c }) => {
      const neighbours = getNeighbours({ r, c }, newPod);

      // console.log(neighbours);
      neighbours.forEach(({ r, c }) => {
        if (!didFlash.has(`${r}_${c}}`)) {
          // console.log(">>", neighbours);
          newPod[r][c]++;
        }
      });
    });

    const updatedPod = newPod.map(r => r.map(c => c));
    newPod = updatedPod;
    const leveled = byLevel(newPod);
    willFlash = leveled[10] || [];
  }
  // get 9s
  // get neighbours
  console.log("after");
  console.table(newPod);

  return {
    newPod,
    numFlashes
  };
}

(async function main() {
  const lines = await aoc.processFile();

  const pod = [];
  for (line of lines) {
    pod.push(line.split("").map(i => +i));
  }
  console.log(pod);

  let total = 0;
  let newPod = pod.map(r => r.map(c => c));
  let i = 1;
  let allFlashed = false;
  while (!allFlashed) {
    console.log("step", i);
    const { newPod: updated, numFlashes } = flashStep(newPod);
    newPod = updated;
    // console.log(numFlashes);
    total += numFlashes;
    ++i;
    allFlashed = numFlashes === 100;
  }
  console.log(">", total);

})();
