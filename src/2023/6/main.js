const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const races = [];
  for (line of lines) {
    console.log(line);
    if (line.startsWith("Time: ")) {
      const data = line.split("Time: ")[1].split(" ").map(t => t.trim()).map(Number).filter(t => t);
      console.log(data);
      const t = parseInt(data.join(""), 10);
      const i = 0;
      // data.forEach((t, i) => {
        races[i] ??= {};
        races[i].time = t
      // });

    } else if (line.startsWith("Distance: ")) {
      const data = line.split("Distance: ")[1].split(" ").map(t => t.trim()).map(Number).filter(t => t);
      console.log(data);
      const t = parseInt(data.join(""), 10);
      const i = 0;
      races[i].distance = t
      // data.forEach((t, i) => {
      //   races[i].distance = t
      // });
    }
  }

  console.table(races);


  function totalDistance(durationHeld, totalDuration) {
    const remainder = totalDuration - durationHeld;

    return durationHeld * remainder;
  }

  [0,1,2,3,4,5,6,7].map(i => {
    console.log(totalDistance(i, 7))
  });

  function actions(race) {
    const results = [];
    for (let i = 0; i <= race.time; i++) {
      const d = totalDistance(i, race.time);
      if (d > race.distance) {
        results.push({
          pressTime: i,
          traveled: d,
        });
      }
    }
    console.log(results);
    return results;
  }

  const scores = races.map(actions);
  console.log(scores.reduce((a, b) => a * b.length, 1));
})();
