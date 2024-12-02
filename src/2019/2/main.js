const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function processOp(code, a, b, to, global) {
    const newG = structuredClone(global);
    switch (code) {
      case 1:
        newG[to] = newG[a] + newG[b];
        return newG;
      case 2:
        newG[to] = newG[a] * newG[b];
        return newG;
      case 99:
        return null;
      default:
        throw new Error(`Unknown code ${code}`);
    }
  }

  let code = lines[0].split(",").map(Number);
  const result = run(code, 12, 2);
  // code[1] = 12;
  // code[2] = 2;
  // console.log(code);
  // for (let i = 0; i < code.length; i += 4) {
  //   const [op, a, b, to] = [code[i], code[i+1], code[i+2], code[i+3]];
  //   const newCode = processOp(op, a, b, to, code);
  //   console.log(op, a, b, to, code, newCode);
  //   if (!newCode) {
  //     break;
  //   }
  //   code = newCode;
  // }
  console.log(result);

  function run(inputCode, noun, verb) {
    let ccode = structuredClone(inputCode);
    ccode[1] = noun;
    ccode[2] = verb;
    // console.log(ccode);
    for (let i = 0; i < ccode.length; i += 4) {
      const [op, a, b, to] = [ccode[i], ccode[i+1], ccode[i+2], ccode[i+3]];
      const newCode = processOp(op, a, b, to, ccode);
      // console.log(op, a, b, to, ccode, newCode);
      if (!newCode) {
        break;
      }
      ccode = newCode;
    }
    return ccode[0];
  }

  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      const result = run(code, noun, verb);
      if (result === 19690720) {
        console.log(noun, verb, 100 * noun + verb);
        return;
      }
    }
  }

})();

// 2347
