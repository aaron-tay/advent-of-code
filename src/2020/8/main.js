const aoc = require("../../aoc");

function parse(line) {
  const [op, arg] = line.split(" ");
  const isPositive = /\+/.test(arg);
  const digit = +(arg.substring(1));
  const delta = (isPositive ? digit : -digit);
  return {
    op,
    arg,
    delta,
  }
}

function p1(lines) {
  const executedLines = new Set();
  let acc = 0;
  let i = 0;
  for (i = 0; i < lines.length; ++i) {
    // console.log(i, lines[i]);
    if (executedLines.has(i)) {
      break;
    }
    executedLines.add(i);

    const { op, arg, delta } = parse(lines[i]);

    if (op === "acc") {
      acc += delta;
    } else if (op === "jmp") {
      i += delta-1;
    }
  }
  // console.log("p1>", acc);
  return {
    executedLines,
    acc,
    didFinish: i === lines.length,
  };
}

function changeOp(lines, lineNumber, toOp) {
  const result = lines.map(l => `${l}`);

  const { op, arg, delta } = parse(result[lineNumber]);
  result[lineNumber] = `${toOp} ${arg}`;

  return result;
}

(async function main() {
  const lines = await aoc.processFile();
  const {executedLines, acc, didFinish} = p1(lines);
  console.log("p1>", acc);

  // need to search all lines
  // try nop -> jmp
  const nopLines = [];
  [...lines].forEach((_, lineNum) => {
    const line = lines[lineNum];
    const { op, arg, delta } = parse(line);
    if (op === "nop") {
      nopLines.push(lineNum);
    }
  });
  console.log(nopLines);

  nopLines.forEach(lineNumber => {
    const newLines = changeOp(lines, lineNumber, "jmp");
    // console.log(lineNumber, "nop -> jmp", lines[lineNumber]);
    const {executedLines, acc, didFinish} = p1(newLines);
    if (didFinish) {
      console.log(">", acc);
      return;
    }
  });
  console.log("nop nup");

  // try jmp -> nop
  const jmpLines = [];
  [...lines].forEach((_, lineNum) => {
    const line = lines[lineNum];
    const { op, arg, delta } = parse(line);
    if (op === "jmp") {
      jmpLines.push(lineNum);
    }
  });
  console.log(jmpLines);

  jmpLines.forEach(lineNumber => {
    const newLines = changeOp(lines, lineNumber, "nop");
    // console.log(lineNumber, "jmp -> nop", lines[lineNumber]);
    // console.log(newLines);
    const {executedLines, acc, didFinish} = p1(newLines);
    if (didFinish) {
      console.log(">", acc);
      return;
    }
  })

})();

// 1584