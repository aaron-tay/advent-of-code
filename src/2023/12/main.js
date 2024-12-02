const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const memo = {};
  function combinations(n) {
    if (memo[n]) { return memo[n]; }

    var r = [];
    for(var i = 0; i < (1 << n); i++) {
      var c = [];
      for(var j = 0; j < n; j++) {
        c.push(i & (1 << j) ? '#' : '.');
      }
      r.push(c.join(''));
    }

    memo[n] = r;
    return r;  
  }

  function p1Line(line) {
    const [springs, rawRecords] = line.split(" ");

    const records = rawRecords.split(",").map(Number);
    const recordsAsCodes = records.map(record => {
      return "".padStart(record, "#");
    });

    const regexStr = "^(?:\\.*?)" + records.map(record => {
      return `(#{${record}})`;
    }).join("(?:\\.+?)") + "(?:\\.*?)$"
    // console.log(regexStr);
    const regex = new RegExp(regexStr, "g");
    // return ((str || '').match(re) || []).length
    // Regex.Matches(input, @"\d").Count

    // const matches = springs.match(regex);
    // console.log(matches);

    // remove redundant . symbols
    const dotlessStr = springs.replace(/^(\.)+/g, "").replace(/(\.)+$/g, "").replace(/(\.)+/g, ".");
    // const dotless = dotlessStr.split(".");

    const numWildcards = springs.split("").filter(c => c === "?").length;

    return {
      springCode: springs,
      records,
      recordsAsCodes,
      numWildcards,
      dotlessStr,
      dotlessArr: dotlessStr.split(""),
      // dotless,
      // maxLength: dotlessStr.length,
      regex,
      // matches,
    };
  }

  function p2Line(line) {
    const [rawSprings, rawRecords] = line.split(" ");
    const springs = [rawSprings,rawSprings,rawSprings,rawSprings,rawSprings].join("?");

    const records = [rawRecords,rawRecords,rawRecords,rawRecords,rawRecords].join(",").split(",").map(Number);
    const recordsAsCodes = records.map(record => {
      return "".padStart(record, "#");
    });

    const regexStr = "^(?:\\.*?)" + records.map(record => {
      return `(#{${record}})`;
    }).join("(?:\\.+?)") + "(?:\\.*?)$"
    // console.log(regexStr);
    const regex = new RegExp(regexStr, "g");
    // return ((str || '').match(re) || []).length
    // Regex.Matches(input, @"\d").Count

    // const matches = springs.match(regex);
    // console.log(matches);

    // remove redundant . symbols
    const dotlessStr = springs.replace(/^(\.)+/g, "").replace(/(\.)+$/g, "").replace(/(\.)+/g, ".");
    // const dotless = dotlessStr.split(".");

    const numWildcards = springs.split("").filter(c => c === "?").length;

    return {
      springCode: springs,
      records,
      recordsAsCodes,
      numWildcards,
      dotlessStr,
      dotlessArr: dotlessStr.split(""),
      // dotless,
      // maxLength: dotlessStr.length,
      regex,
      // matches,
    };
  }

  const allSprings = [];
  for (line of lines) {
    console.log(line);
    const p1 = p1Line(line);
    const p2 = p2Line(line);

    allSprings.push({
      ...p1,
      p2,
    });
  }

  console.table(allSprings);
  console.table(allSprings.map(s => s.p2));
  console.log(Math.max(...allSprings.map(spring => spring.maxLength)))

  function countCombinations(springs) {
    return springs.map((record) => {
      // console.log(record.dotlessArr);
      const permutations = combinations(record.numWildcards);
      const valid = permutations.filter(pu => {
        const p = pu.split("");
        // console.log(p);
        let n = 0;
        const c = record.dotlessArr.map((char, idx) => {
          if (char === "?") {
            return p[n++];
          }
          return char;
        }).join("");

        const matches = c.match(record.regex);
        // console.log(c, matches);
        return matches?.length ?? 0;
      });
      return valid.length;
    });
  }
  // 0 -> . | 1 -> #
  const results = countCombinations(allSprings);

  console.log(results);
  const p1 = results.reduce((acc, cur) => acc + cur, 0);
  console.log(p1);

  console.log(Math.max(...allSprings.map(s => s.p2.numWildcards)));
  const results2 = countCombinations(allSprings.map(s => s.p2));
  const p2 = results2.reduce((acc, cur) => acc + cur, 0);
  console.log(p2);
})();

