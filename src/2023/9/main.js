const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const rows = [];
  for (line of lines) {
    console.log(line);
    const d = line.split(" ").map(Number);
    rows.push(d);
  }
  console.table(rows);

  const memo = {}; //key(rhs-lhs): child
  function differences(row) {
    const d = [];
    for (let i = 1; i < row.length; i++) {
      d.push(row[i] - row[i - 1]);
    }
    return d;
  }
  // rows.forEach((row) => {
  //   console.log(differences(row));
  // });

  function allZero(row) {
    return row.every((x) => x === 0);
  }

  function p1Predict(row) {
    // console.log(row);
    if (allZero(row)) {
      return 0;
    }

    const nextLevel = differences(row);
    const nextNumber = p1Predict(nextLevel);
    const lastNumberInLevel = row[row.length - 1];
    // console.log("> ", row, nextLevel, nextNumber);
    return lastNumberInLevel + nextNumber;
  }

  const p1Predictions = rows.map(p1Predict);
  console.log(p1Predictions)
  console.log(p1Predictions.reduce((a, b) => a + b, 0));



  function p2Predict(row) {
    // console.log(row);
    if (allZero(row)) {
      return 0;
    }

    const nextLevel = differences(row);
    const nextNumber = p2Predict(nextLevel);
    const firstNumberInLevel = row[0];
    // console.log("> ", row, nextLevel, nextNumber);
    return firstNumberInLevel - nextNumber;
  }

  const p2Predictions = rows.map(p2Predict);
  console.log(p2Predictions)
  console.log(p2Predictions.reduce((a, b) => a + b, 0));

})();

// 1743490457 p1

// 1053 p2