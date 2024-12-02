const aoc = require("../../aoc");

function countsLetters(template) {
  let result = {};

  template.split("").forEach(c => {
    if (!result[c]) { result[c] = 0; }
    result[c] += 1;
  });

  return result;
}

function p2CountLetter(pairCounts, offsets) {
  let result = {};

  Object.keys(pairCounts).forEach(p => {
    const [first, second] = p.split("");
    const multiplier = pairCounts[p];

    if (!result[first]) { result[first] = 0; }
    result[first] += multiplier;

    if (!result[second]) { result[second] = 0; }
    result[second] += multiplier;
  });
  // we've double counted so divide by 2
  Object.keys(result).forEach(c => {
    result[c] = Math.floor(result[c] / 2);
  });
  // add the special offsets
  Object.keys(offsets).forEach(c => {
    if (!result[c]) { result[c] = 0; }
    result[c] += 1;
  });

  return result;
}

function makePairs(template) {
  let result = [];
  const offsets = {};

  for (let c = 1; c < template.length; ++c) {
    const first = template.charAt(c-1);
    const second = template.charAt(c);
    const pair = `${first}${second}`;
    result.push(pair);
  }
  offsets[template.charAt(0)] = 1;
  offsets[template.charAt(template.length-1)] = 1;

  return {
    pairs: result,
    offsets,
  };
}

function apply(template, ruleMap) {
  let result = [];

  result.push(template.charAt(0));
  for (let c = 1; c < template.length; ++c) {
    const first = template.charAt(c-1);
    const second = template.charAt(c);
    const pair = `${first}${second}`;
    if (ruleMap[pair]) {
      result.push(ruleMap[pair]);
    }
    result.push(second);
  }

  return result.join("");
}

function p2Apply(pairCounts, ruleMap) {
  const updatedPairCounts = {};
  Object.keys(pairCounts).forEach(key => {
    const quantity = pairCounts[key];

    const [first, second] = key.split("");
    if (ruleMap[key]) {
      const newPairs = [
        `${first}${ruleMap[key]}`,
        `${ruleMap[key]}${second}`
      ];
      newPairs.forEach(p => {
        if (!updatedPairCounts[p]) { updatedPairCounts[p] = 0; }
        updatedPairCounts[p] += quantity;
      });
    }
  });
  return updatedPairCounts
}

function p1(lines) {
  let isTemplate = true;
  let template = "";
  const rules = [];
  for (line of lines) {
    if (line === "") {
      isTemplate = false;
      continue;
    }
    if (isTemplate) {
      template = line;
      continue;
    }
    const [source, destination] = line.split(" -> ");
    rules.push({
      source,
      destination,
    });
  }
  // console.log(template);
  // console.log(rules);

  const ruleMap = {};
  rules.forEach(r => {
    ruleMap[r.source] = r.destination;
  });
  let cycle = template;
  for (let i = 0; i < 10; ++i) {
    console.log(i, cycle.length);
    const updated = apply(cycle, ruleMap);
    cycle = updated;
    // console.log(updated);
  }
  const counts = countsLetters(cycle);
  const max = Object.values(counts).reduce((acc, curr) => Math.max(acc, curr), 0);
  const min = Object.values(counts).reduce((acc, curr) => Math.min(acc, curr), Infinity);
  console.log(max, min, max-min);
}

(async function main() {
  const lines = await aoc.processFile();
  p1(lines);

  let isTemplate = true;
  let template = "";
  const rules = [];
  for (line of lines) {
    if (line === "") {
      isTemplate = false;
      continue;
    }
    if (isTemplate) {
      template = line;
      continue;
    }
    const [source, destination] = line.split(" -> ");
    rules.push({
      source,
      destination,
    });
  }
  // console.log(template);
  // console.log(rules);

  const ruleMap = {};
  rules.forEach(r => {
    ruleMap[r.source] = r.destination;
  });
  const { pairs, offsets }  = makePairs(template);
  let cycle = {};
  let cycleOffsets = offsets;
  pairs.forEach(p => {
    if (!cycle[p]) { cycle[p] = 0; }
    cycle[p]++;
  });
  console.log(">", pairs, cycle);
  for (let i = 0; i < 40; ++i) {
    console.log(i);
    const updated = p2Apply(cycle, ruleMap);
    cycle = updated;
  }

  const counts = p2CountLetter(cycle, cycleOffsets);
  const max = Object.values(counts).reduce((acc, curr) => Math.max(acc, curr), 0);
  const min = Object.values(counts).reduce((acc, curr) => Math.min(acc, curr), Infinity);
  console.log(max, min, max-min);

})();
