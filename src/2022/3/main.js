const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const findCommon = (left, right) => {
    const common = intersection(new Set(left), new Set(right));
    return [...common];
  }

  function intersection(setA, setB) {
    const _intersection = new Set();
    for (const elem of setB) {
      if (setA.has(elem)) {
        _intersection.add(elem);
      }
    }
    return _intersection;
  }
  
  const getScore = (item) => {
    if (item === item.toUpperCase()) {
      return item.charCodeAt(0) - 65 + 26 + 1;
    }
    return item.charCodeAt(0) - 97 + 1;
  }

  function p1() {
    const outcomes = [];
    for (line of lines) {
      console.log(line);
      const mid = line.length / 2;
      const left = line.substr(0, mid);
      const right = line.substr(mid);
      console.log(left, right);
  
      const common = findCommon(left, right);
      const score = getScore(common[0]);
      console.log(common, score);
      outcomes.push(score);
    }
    const gameScore = outcomes.reduce((acc, s) => (acc + s), 0);
    console.log(gameScore);
  }
  // p1();

  const findCommonMore = (left, right, other) => {
    const common = intersectionMore(new Set(left), new Set(right), new Set(other));
    return [...common];
  }

  function intersectionMore(setA, setB, setC) {
    const res = [setA, setB, setC].reduce((a, b) => new Set([...a].filter(x => b.has(x))));
    return res;
  }
  
  const outcomes = [];
  let buffer = [];
  for (line of lines) {
    buffer.push(line);
    if (buffer.length === 3) {
      console.log(line);
      const [l, r, o] = buffer;
      console.log(l, r, o);
  
      const common = findCommonMore(l, r, o);
      const score = getScore(common[0]);
      console.log(common, score);
      outcomes.push(score);
      buffer = [];
    }
  }
  const gameScore = outcomes.reduce((acc, s) => (acc + s), 0);
  console.log(gameScore);

})();
