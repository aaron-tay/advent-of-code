const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();
  const regex = /move (?<quantity>\d*) from (?<from>\d*) to (?<to>\d*)/;
  function parseInstruction(instruction) {
    const { groups: m } = regex.exec(instruction);
    return {
      quantity: parseInt(m.quantity, 10),
      from: parseInt(m.from, 10)-1,
      to: parseInt(m.to, 10)-1,
    }
  }

  function playInstruction({ quantity, from, to }, stacks) {
    console.table(stacks);
    const temp = [];
    for (let i = 0; i < quantity; ++i) {
      const item = stacks[from].pop();
      temp.push(item);
    }
    temp.reverse().forEach(item => {
      stacks[to].push(item);
    });
    console.table(stacks);
    return stacks;
  }

  let mode = "stack";
  const stacks = [];
  const instructions = [];
  for (line of lines) {
    // console.log(line);
    if (line.trim() === "") {
      mode = "instructions"
      continue;
    }
    if (mode === "stack") {
      stacks.push(line);
    }
    if (mode === "instructions") {
      instructions.push(line);
    }
  }
  console.log(stacks);
  const s = stacks[stacks.length - 1].split(" ").map(c => c.trim()).filter(c => c);
  const numStacks = parseInt(s[s.length-1], 10);
  console.log(numStacks);

  const bottomUp = stacks.slice(0, -1).reverse();
  console.log(bottomUp);
  const realStacks = []; //[[],..
  bottomUp.forEach(l => {
    const sl = l.match(/.{1,3}(\s?)/g).map(c => c.trim());
    console.log(sl);
    sl.forEach((item, idx) => {
      if (!realStacks[idx]) {
        realStacks[idx] = [];
      }
      if (item !== '') {
        realStacks[idx].push(item);
      }
    });
  });
  console.log(realStacks);

  for (instruction of instructions) {
    const p = parseInstruction(instruction);
    console.log(p);
    playInstruction(p, realStacks);
    console.log("> ", stacks);
  }
  console.log(stacks);

  const p1Result = realStacks.map(s => s[s.length - 1]).join("").replaceAll("[", "").replaceAll("]", "");
  console.log(p1Result);
})();
