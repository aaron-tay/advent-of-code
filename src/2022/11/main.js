const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function parseMonkey(lines) {
    const monkeyIdRegex = /Monkey (?<id>.*?):/;
    const { groups: m } = monkeyIdRegex.exec(lines[0]);
    const monkeyId = parseInt(m.id, 10);

    const items = lines[1].split(": ")[1].split(",").map(c => parseInt(c.trim(), 10));
    const [op1, operator, op2] = lines[2].split(": ")[1].split(" = ")[1].split(" ");
    const conditionRegex = /Test: divisible by (?<value>.*)/;
    const { groups: mc } = conditionRegex.exec(lines[[3]]);
    const divisor = parseInt(mc.value, 10);

    const trueRegex = /If true: throw to monkey (?<value>.*)/;
    const { groups: tc } = trueRegex.exec(lines[[4]]);
    const trueMonkey = parseInt(tc.value, 10);

    const falseRegex = /If false: throw to monkey (?<value>.*)/;
    const { groups: fc } = falseRegex.exec(lines[[5]]);
    const falseMonkey = parseInt(fc.value, 10);

    const operation = (old) => {
      const safeOp2 = op2 === "old" ? "old" : parseInt(op2, 10);
      const safeOld = old;
      if (operator === "+") {
        if (safeOp2 === "old") {
          return safeOld + safeOld;
        }
        return safeOld + safeOp2;
      } else if (operator === "*") {
        if (safeOp2 === "old") {
          return safeOld * safeOld;
        }
        return safeOld * safeOp2;
      }
      // console.log(">", safeOp2);
      // return eval(`let old=BigInt(${old}); ${op1} ${operator} ${safeOp2}`);
    }

    const predicate = (c) => {
      return c % divisor === 0;
    }
    const monkeyToThrowTo = (predicate) => {
      if (predicate) { return trueMonkey; }
      return falseMonkey;
    }

    return {
      id: monkeyId,
      items,
      divisor,
      operation,
      predicate,
      monkeyToThrowTo,
      ops: `${op1} ${operator} ${op2}`,
      trueMonkey,
      falseMonkey,
      inspections: 0,
    };
  }

  const monkeys = {};
  const asList = [];
  let buffer = [];
  for (line of lines) {
    // console.log(line);
    buffer.push(line);
    if (line === "") {
      const monkey = parseMonkey(buffer);
      monkeys[monkey.id] = monkey;
      asList.push(monkey);
      buffer = [];
    }
  }
  if (buffer) {
    const monkey = parseMonkey(buffer);
    monkeys[monkey.id] = monkey;
    asList.push(monkey);
  }

  console.table(monkeys);
  console.log(monkeys[3].operation(10));

  function p1() {
    for (let i = 0; i < 20; ++i) {
      asList.forEach(monkey => {
        while (monkey.items.length > 0) {
          monkey.inspections++;
          const item = monkey.items.shift();
          const worryLevel = monkey.operation(item);
          const newItem = Math.floor(worryLevel / 3);
          const theTest = monkey.predicate(newItem);
          const nextMonkeyId = monkey.monkeyToThrowTo(theTest);
          // console.table([item, worryLevel, newItem, theTest, nextMonkeyId]);
          const nextMonkey = monkeys[nextMonkeyId];
          nextMonkey.items.push(newItem);
        }
      });
      console.log(i);
      console.table(asList.map(m => m.items));
    }

    const outcome = [...asList];
    outcome.sort((a,b) => b.inspections - a.inspections);
    console.table(outcome.map(m => m.inspections));
    const result = outcome[0].inspections * outcome[1].inspections;
    console.log(result);
  }
  // p1();
  // return;

  const magic = asList.map(m => m.divisor).reduce((acc, c) => acc * c, 1);
  console.log(magic);

  function minimise(n) {
    // if (n < magic) { return n; }
    let result = n;
    while (result > magic) {
      result -= magic;
    }
    return result;
  }

  for (let i = 0; i < 10000; ++i) {
    asList.forEach(monkey => {
      while (monkey.items.length > 0) {
        monkey.inspections++;
        const item = monkey.items.shift();
        const worryLevel = monkey.operation(item);
        const newItem = minimise(worryLevel);
        // const newItem = worryLevel % magic === 0 ? magic : worryLevel;
        // const newItem = worryLevel;
        const theTest = monkey.predicate(newItem);
        // if divisible then we can simply mod is back to the divisor
        // const newItem = theTest ? BigInt(monkey.divisor) : BigInt(worryLevel);

        const nextMonkeyId = monkey.monkeyToThrowTo(theTest);
        // console.table([item, worryLevel, newItem, theTest, nextMonkeyId]);
        const nextMonkey = monkeys[nextMonkeyId];
        nextMonkey.items.push(newItem);
      }
    });
    console.log(i);
    // console.table(asList.map(m => m.items));
    if (i % 1000 === 0 || i % 1000 === 999 || i % 1000 === 1) {
      console.log(i);
      console.table(asList);
    }
  }

  const outcome = [...asList];
  outcome.sort((a,b) => b.inspections - a.inspections);
  console.table(outcome.map(m => m.inspections));
  const result = outcome[0].inspections * outcome[1].inspections;
  console.log(result);
})();

// 2973848085
// 2637849596
// 21472945832

// 18085004878