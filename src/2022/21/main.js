const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const inverseOperation = {
    '+': '-',
    '-': "+",
    "/": "*",
    "*": "/",
  };

  function parse(line) {
    const [id, action] = line.split(": ");
    
    const operation = action.split("").find(c => ["+", "-", "/", "*"].includes(c));
    let output = null;
    const dependencies = [];
    const deps = action.split(operation).map(c => c.trim())
    // console.log(operation, deps);
    if (operation) {
      dependencies.push(...deps);
    } else {
      output = parseInt(action.trim(), 10);
    }

    const operate = (allMonkeys) => {
      if (operation) {
        const [lhs, rhs] = action.split(operation).map(c => c.trim());
        const left = allMonkeys[lhs];
        const right = allMonkeys[rhs];
        return eval(`${left.output} ${operation} ${right.output}`);
      }
      return parseInt(action.trim(), 10);
    }
    return {
      id,
      dependencies,
      operate,
      output,
      trace: [],
      operation,
    }
  }

  function newMonkeys() {
    const monkeys = {};
    for (line of lines) {
      const monkey = parse(line);
      monkeys[monkey.id] = monkey;
    }

    return monkeys;
  }

  function outputResult(targetId, allMonkeys) {
    if (allMonkeys[targetId].output) {
      return allMonkeys[targetId].output;
    }

    const monkey = allMonkeys[targetId];
    monkey.dependencies.forEach(nextIds => {
      outputResult(nextIds, allMonkeys);
    });
    monkey.output = monkey.operate(allMonkeys);
    return monkey.output;
  }

  function traceHumn(targetId, allMonkeys) {
    if (targetId === "humn") {
      return ["humn"];
    }

    const monkey = allMonkeys[targetId];

    monkey.dependencies.forEach(nextIds => {
      const r = traceHumn(nextIds, allMonkeys);
      if (r?.includes("humn")) {
        monkey.trace = [{
          id: monkey.id, operation: monkey.operation, other: monkey.dependencies.find(c => c !== nextIds)
        }, ...r];
      }
    });

    return monkey.trace || [];
  }

  function p1(target, allMonkeys) {
    const result = outputResult(target, allMonkeys);
    console.log(target, ": ", result);
    return result;
  }
  // 70674280581468
  // monkeys["humn"].output = 7241459543179.395;
  const monkeys = newMonkeys();
  p1("root", monkeys);
  // console.table(monkeys);

  // TARGET:   // 19509776378502
  const rootMonkey = monkeys["root"];
  const humanPath = traceHumn("root", monkeys);
  humanPath.shift();
  humanPath.pop();

  const dependencies = rootMonkey.dependencies;
  const originCode = humanPath[0].id;
  const origin = p1(originCode, monkeys);
  const target = p1(dependencies.find(c => c !== originCode), monkeys);
  console.log("GOAL:", target);

  // can be solved using binary search
  let result = 0;
  // let guess = 2000000000000;
  let guess = 3243420789700;
  let scan = 1;
  let direction = 1;
  // 2000000000000 <> 2000000000000
  while (result !== (target * 2)) {
    const monkeys = newMonkeys();
    monkeys["humn"].output = guess;
    result = p1("root", monkeys);
    console.log(guess, result, " == ", target*2, result < target*2 ? "V" : "^");
    guess = guess + (direction * scan);
  }
  console.log(guess);

  // 38652791935443.49
  // 39019552757004
  // 39019375030627
  // 39019374054659
  // // rebase against target and update dependencies. basically add another

  // // console.log(humanPath);
  // const invert = humanPath.map(({ operation, ...others }) => ({ operation: inverseOperation[operation], ...others }));
  // console.log(invert);
  // const c = invert.reduce((acc, c) => {
  //   const { id, operation, other } = c;

  //   // console.log(`${acc} ${operation} ${monkeys[other].output}`);
  //   const next = eval(`${acc} ${operation} ${monkeys[other].output}`);
  //   // acc = next;
  //   return next;
  // }, target);
  // console.log(c);

  // const newInput = [];
  // // everyone on RIGHT can be treated as OUT
  // // everyone on LEFT needs to be remapped
  // invert.reverse();
  // invert.forEach((n, idx) => {
  //   const code = `@${idx}`;
  //   const nextCode = `@${idx+1}`;
  //   const operation = n.operation;

  //   const action = `${nextCode} ${operation} ${n.other}`;
  //   newInput.push(`${code}: ${action}`);
  // });
  // newInput.push(`@${invert.length}: ${target}`);
  // console.log(newInput);
  
  // const another = newMonkeys();
  // delete another["humn"];
  // delete another["root"];

  // // p1("root", another);
  // const magic = {};
  // for (line of newInput) {
  //   const monkey = parse(line);
  //   magic[monkey.id] = monkey;
  // }
  // const p2Monkeys = {
  //   ...another,
  //   ...magic,
  // };
  // p1("@0", p2Monkeys);

})();


// humn: 5
// ptdq: humn - dvpt
// lgvd: ljgn * ptdq
// cczh: sllz + lgvd
// pppw: cczh / lfqf
// root: sjmn === pppw

// root = TARGET = XYZ
// humn = (((TARGET * lfqf) - sllz)) / ljgn + dvpt....

// (sllz + (ljgn * (??? - dvpt))) / lfqf = TARGET

// sllz + (ljgn * (??? - dvpt)) = TARGET * lfqf

// ljgn * (??? - dvpt) = ((TARGET * lfqf) - sllz)

// (??? - dvpt) = (((TARGET * lfqf) - sllz)) / ljgn

// ??? = ((((TARGET * lfqf) - sllz)) / ljgn) + dvpt
// ??? =   + dvpt
// ??? = aaa + dvpt
//       aaa = bbb / ljgn
//       bbb = ccc - sllz
//       ccc = TARGET * lfqf
//       ddd = {TARGET}
//       eee = {lfqf}

// root: pppw + sjmn
// dbpl: 5
// cczh: sllz + lgvd
// zczc: 2
// ptdq: humn - dvpt
// dvpt: 3
// lfqf: 4
// humn: 5
// ljgn: 2
// sjmn: drzm * dbpl
// sllz: 4
// pppw: cczh / lfqf
// lgvd: ljgn * ptdq
// drzm: hmdt - zczc
// hmdt: 32


// That's not the right answer; your answer is too high. 
// Please wait one minute before trying again. (You guessed 7241459543177.) [Return to Day 21]
// 562949953421311