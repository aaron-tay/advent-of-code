const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  let total = 0;
  let total2 = 0;
  for (line of lines) {
    // console.log(line);
    const [policy, letterColon, pw] = line.split(" ");
    // console.log(policy, letterColon, pw);
    const [lo, hi] = policy.split("-");
    const [letter] = letterColon.split(":");

    const occurrance = pw.split(letter).length - 1;
    // console.log(occurrance);
    if (lo <= occurrance && occurrance <= hi) {
      // console.log("OK");
      total++;
    }

    console.log(letter, pw.charAt(lo-1), pw.charAt(hi-1));
    if (
      (pw.charAt(lo-1) === letter && pw.charAt(hi-1) !== letter) ||
        (pw.charAt(lo-1) !== letter && pw.charAt(hi-1) === letter)) {
        console.log("P2", line);
      total2++;
    }
  }

  console.log(">> ", total, total2);
})();

// 13:06
// 13:13
// 13:20
