const aoc = require("../../aoc");

function p2Score(char) {
  switch (char) {
    case ")":
      return 1;
    case "]":
      return 2;
    case "}":
      return 3;
    case ">":
      return 4;
    default:
      throw new Error("unknown");
  }
}

function getMatching(char) {
  switch (char) {
    case "(":
      return ")"
    case "[":
      return "]"
    case "{":
      return "}"
    case "<":
      return ">"
    default:
      throw new Error("unknown");
  }
}

function score(char) {
  switch (char) {
    case ")":
      return 3;
    case "]":
      return 57;
    case "}":
      return 1197;
    case ">":
      return 25137;
    default:
      throw new Error("unknown");
  }
}

function isOpen(char) {
  switch (char) {
    case "(":
    case "[":
    case "{":
    case "<":
      return true;
    default:
      return false;
  }
}

function isMatching(left, right) {
  switch (left) {
    case "(":
      return right === ")"
    case "[":
      return right === "]"
    case "{":
      return right === "}"
    case "<":
      return right === ">"
    default:
      return false;
  }
}

function p1(lines) {
  let sum = 0;
  const corruptLines = [];
  const nonCorruptLines = [];
  for (line of lines) {
    let isCorrupt = false;
    let illegalCharacter = null;
    const stack = [];
    const chars = line.split("");
    chars.forEach(c => {
      if (isCorrupt) { return; }
      if (isOpen(c)) {
        stack.push(c);
      } else {
        const left = stack.pop(c);
        if (!isMatching(left, c)) {
          isCorrupt = true;
          illegalCharacter = c;
        }
      }
    });
    if (isCorrupt) {
      // console.log(line, stack);
      corruptLines.push(line);
      sum += score(illegalCharacter);
    } else {
      nonCorruptLines.push(line);
    }
  }
}

(async function main() {
  const lines = await aoc.processFile();

  p1(lines);

  let sum = 0;
  const corruptLines = [];
  const nonCorruptLines = [];
  const allScores =[];
  for (line of lines) {
    let isCorrupt = false;
    let illegalCharacter = null;
    const stack = [];
    const chars = line.split("");
    chars.forEach(c => {
      if (isCorrupt) { return; }
      if (isOpen(c)) {
        stack.push(c);
      } else {
        const left = stack.pop(c);
        if (!isMatching(left, c)) {
          isCorrupt = true;
          illegalCharacter = c;
        }
      }
    });
    if (isCorrupt) {
      // console.log(line, stack);
      corruptLines.push(line);
      sum += score(illegalCharacter);
    } else {
      nonCorruptLines.push(line);

      console.log(stack);
      stack.reverse();
      const newScore = stack.map(getMatching).reduce((acc, curr) => {
        return ((acc * 5) + p2Score(curr));
      }, 0);
      console.log(newScore);
      allScores.push(newScore);
    }
  }
  allScores.sort((a, b) => a - b);
  console.log(allScores[Math.floor(allScores.length / 2)]);

})();
