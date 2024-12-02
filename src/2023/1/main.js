const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function wordToNumber(word) {
    switch(word) {
      case "one": return 1;
      case "two": return 2;
      case "three": return 3;
      case "four": return 4;
      case "five": return 5;
      case "six": return 6;
      case "seven": return 7;
      case "eight": return 8;
      case "nine": return 9;
      default: return word;
    }
  }

  function part1(input) {
    const a = [];
    for (line of input) {
      console.log(line);
  
      const first = line.split("").find(c => {
        return /\d/.test(c);
      });
      const last = line.split("").findLast(c => {
        return /\d/.test(c);
      });
      console.log(first, last)
      a.push(+`${first}${last}`);
    }
    console.log(a.reduce((a, b) => a + b, 0));
  }

  const numbers = [
    "eight"
,"seven"
,"three"
,"four"
,"five"
,"nine"
,"one"
,"two"
,"six"
  ];

  function part2(input) {
    const a = [];
    for (line of input) {
      console.log(line);
      const firstA = line.split("").findIndex((c ,idx) => {
        const word = numbers.find(numbers => {
          return numbers === line.substr(idx, numbers.length);
        });
        if (word) { return true; }
        return /\d/.test(c);
      });
      const first = (() => {
        const word = numbers.find(numbers => {
          return numbers === line.substr(firstA, numbers.length);
        });
        if (word) { return wordToNumber(word); }
        return line[firstA];
      })();

      const lastA = line.split("").findLastIndex((c, idx) => {
        const word = numbers.find(numbers => {
          return numbers === line.substr(idx, numbers.length);
        });
        if (word) { return true; }
        return /\d/.test(c);
      });
      const last = (() => {
        const word = numbers.find(numbers => {
          return numbers === line.substr(lastA, numbers.length);
        });
        if (word) { return wordToNumber(word); }
        return line[lastA];
      })();

      console.log(line, first, last);
      a.push(+`${first}${last}`);
    }
    console.log(a.reduce((a, b) => a + b, 0));
  }

  part2(lines);

})();
