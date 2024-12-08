const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const OPERATORS = [
    {
      operator: "+",
      fn: (a, b) => a + b,
    },
    {
      operator: "*",
      fn: (a, b) => a * b,
    },
    { operator: "||", fn: (a, b) => parseInt(`${a}${b}`, 10) },
  ];
  function canMake(target, numbers, history) {
    // console.log(target, numbers, history);
    if (history.total === target) {
      return structuredClone({
        ...history,
        result: true,
      });
    }
    if (numbers.length === 0) {
      return structuredClone({
        ...history,
        result: false,
      });
    }
    if (history.total > target) {
      return structuredClone({
        ...history,
        result: false,
      });
    }
    const [num, ...others] = numbers;
    return OPERATORS.reduce((acc, op) => {
      if (acc) {
        return acc;
      }
      const updatedHistory = structuredClone(history);
      updatedHistory.total = op.fn(updatedHistory.total ?? 0, num);
      updatedHistory.path ??= [];
      updatedHistory.path.push({
        operator: op.operator,
        number: num,
      });
      const result = canMake(target, others, updatedHistory);
      // console.log(result);
      if (result?.result) {
        // console.log("SUCCESS", result);
        return result;
      }
      return null;
    }, null);
  }

  const pt1 = lines.map((line) => {
    console.log(line);
    const [test, others] = line.split(": ");
    const testNumber = parseInt(test, 10);
    const numbers = others.split(" ").map((n) => parseInt(n, 10));
    // console.log(testNumber, ":", numbers);

    const [num, ...remainder] = numbers;
    const start = {
      total: num,
      path: [{ number: num }],
    };
    const r = canMake(testNumber, remainder, start);
    // console.log("?", r);
    return r;
  });
  console.log(pt1);
  console.log(
    "F",
    pt1.filter((n) => n)
  );
  console.log(pt1.filter((n) => n).reduce((acc, n) => acc + n.total, 0));
})();

// 42283209483350pt1
