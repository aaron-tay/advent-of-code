const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  let sum = 0;
  let highest = 0;
  const totals = [];
  for (line of lines) {
    console.log(line);
    if (line === "") {
      if (sum > highest) {
        highest = sum;
      }
      totals.push(sum);
      console.log(">");
      sum = 0;
    } else {
      sum += parseInt(line, 10);
    }
  }
  totals.push(sum);

  console.log(">", highest);
  console.log(totals);
  const a = totals.sort((a, b) => b - a);
  console.log(a[0] + a[1] + a[2]);
})();
