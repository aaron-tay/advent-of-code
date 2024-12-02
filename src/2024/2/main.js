const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const reports = [];
  for (line of lines) {
    // console.log(line);
    const levels = line.split(" ").map((c) => +c);
    console.log(levels);
    reports.push(levels);
  }

  const isSafe = (report) => {
    let isSafeDirection = null;
    for (let i = 1; i < report.length; ++i) {
      const prev = report[i - 1];
      const current = report[i];
      const difference = current - prev;
      const direction = Math.sign(difference);
      const absDiff = Math.abs(difference);
      if (!isSafeDirection) {
        isSafeDirection = direction;
      }
      if (direction === 0 || isSafeDirection !== direction) {
        return false;
      }
      if (absDiff >= 4) {
        return false;
      }
    }
    return true;
  };
  const safes = reports.filter(isSafe);
  console.log(safes);
  console.log(safes.length);

  const canDampenerToBeSafe = (report, idx) => {
    if (isSafe(report)) {
      return true;
    }

    // problem space small enough :)
    return report.some((_, i) => {
      const removed = [...report].filter((_, x) => x !== i);
      const s = isSafe(removed);
      if (s) {
        console.log(idx, s, report);
      }
      return s;
    });
  };

  const results = reports.map(canDampenerToBeSafe).filter(Boolean);
  // console.log(results);
  console.log(results.length);
})();
