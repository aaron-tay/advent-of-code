const aoc = require("../../aoc");

function p1(lines) {
  const original = lines[0].split(",");

  let fishes = [...original];
  for (let days = 0; days < 80; days += 1) {
    const loopedFishes = fishes.map(f => f - 1);
    const newFishes = loopedFishes.filter(f => f === -1).map(i => 8);
    loopedFishes.forEach((f, idx) => {
      if (f === -1) {
        loopedFishes[idx] = 6;
      }
    });

    fishes = [...loopedFishes, ...newFishes];
    // console.log(days, fishes);
    console.log(days);
  }

  console.log(fishes.length);
}

(async function main() {
  const lines = await aoc.processFile();

  p1(lines);

  const original = lines[0].split(",").map(f => +f);

  //-1
  const fishBuckets = [0,0,0,0,0,0,0,0,0];
  original.forEach(f => {
    if (!fishBuckets[f+1]) { fishBuckets[f+1] = 0; }
    fishBuckets[f+1] += 1;
  });
  console.log(JSON.stringify(fishBuckets));

  let spawn = 0;
  for (let days = 0; days < 257; days += 1) {
    spawn = fishBuckets.shift();
    fishBuckets.push(spawn);
    if (spawn > 0) {
      fishBuckets[6] += spawn;
    }

    // console.log(days, JSON.stringify(fishBuckets), fishBuckets.reduce((acc, c) => acc+c, 0), spawn);
  }
  const sum = fishBuckets.reduce((acc, c) => acc+c, 0);
  console.log(sum);

})();
