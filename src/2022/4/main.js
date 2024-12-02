const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  // lhs is contained within rhs
  function isSuperset(set, subset) {
    for (const elem of subset) {
      if (!set.has(elem)) {
        return false;
      }
    }
    return true;
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

  function makeSection(code) {
    const [low, high] = code.split("-").map(i => parseInt(i, 10));
    const result = [];
    for (let i = low; i <= high; ++i) {
      result.push(i);
    }
    return new Set(result);
  }

  function p1() {
    const outcomes = [];
    for (line of lines) {
      // console.log(line);
      const [l, r] = line.split(",");
      const left = makeSection(l);
      const right = makeSection(r);
      // larger of two on left
      const hasAll = left.size > right.size ? isSuperset(left, right) : isSuperset(right, left);
      // console.log(left, right, hasAll);
      if (hasAll) {
        outcomes.push(line);
      }
    }
    console.log(outcomes.length);
  }


  const outcomes = [];
  for (line of lines) {
    // console.log(line);
    const [l, r] = line.split(",");
    const left = makeSection(l);
    const right = makeSection(r);
    // larger of two on left
    const hasCommon = intersection(left, right);
    if (hasCommon.size > 0) {
      outcomes.push(line);
    }
  }
  console.log(outcomes.length);
})();
