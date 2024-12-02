const aoc = require("../../aoc");

const REGISTERS = ["w", "x", "y", "z"];

function execute(operation, registers, input) {
  const { op, lhs, rhs } = operation;
  let updated = {...registers};

  const getValue = () => {
    if (Object.keys(registers).some(r => r === rhs)) {
      return +registers[rhs];
    }
    return +rhs;
  }

  switch (op) {
    case "inp": {
      updated[lhs] = input;
      break;
    }
    case "add": {
      updated[lhs] = registers[lhs] + getValue();
      break;
    }
    case "mul": {
      updated[lhs] = registers[lhs] * getValue();
      break;
    }
    case "div": {
      updated[lhs] = Math.floor(registers[lhs] / getValue());
      break;
    }
    case "mod": {
      updated[lhs] = registers[lhs] % getValue();
      break;
    }
    case "eql": {
      updated[lhs] = (registers[lhs] === getValue()) ? 1 : 0;
      break;
    }
  }

  return updated;
}

function parse(line) {
  const [op, lhs, rhs] = line.split(" ");
  return {
    op,
    lhs,
    rhs
  }
}

function newRegisters() {
  let registers = {};
  REGISTERS.forEach(r => {
    registers[r] = 0
  });

  return registers;
}

// x and y get mul 0 before they're used so no need to consider them for memoisation
function magicHash(program, registers, inputs) {
  const programHash = program.id;
  const registersHash = ["w","z"].map(k => `${k}:${registers[k]}`).join("_");
  const inputHash = inputs.join("_");
  return [programHash, registersHash, inputHash].join("_");
}

let programMemo = null;
async function initialiseCache() {
  try {
    const data = await aoc.cache.readFile("/tmp/2021-12-24-memo");
    programMemo = JSON.parse(data) || {};
    console.log(programMemo);
  } catch (err) {
    console.log(err);
    programMemo = {};
  }
}
async function updateCache() {
  console.log("writing");
  await aoc.cache.writeFile("/tmp/2021-12-24-memo", JSON.stringify(programMemo));
}

async function run(program, registers, inputs) {
  const hash = magicHash(program, registers, inputs);
  if (programMemo[hash]) {
    return {
      registers: programMemo[hash],
      isCached: true,
    };
  }
  const stream = [...inputs];
  program.operations.forEach(o => {
    let i = null;
    if (o.op === "inp") {
      i = stream.shift();
    }
    const updated = execute(o, registers, i);
    registers = {
      ...updated
    };
  });

  programMemo[hash] = registers;
  if (Object.keys(programMemo).length % 1000 === 0) {
    await updateCache();
  }
  return {
    registers,
    isCached: false,
  }
}

let count = 0;
async function runMonad(programs, registers, digits = []) {
  if (programs.length === 0) {
    ++count;
    console.log(digits.join(""), count, Object.keys(programMemo).length);
    console.table(registers);
    return {
      num: digits,
      isValid: registers['z'] === 0,
      registers,
    };
  }

  const program = programs.slice(0)[0];
  // const nexts = [];
  // for (let i = 9; i >= 1; i -= 1) {
  //   const registersForThisState = {...registers}; 
  //   const {
  //     registers: updated,
  //     isCached
  //   } = await run(program, registersForThisState, [i]);
  //   const remainingPrograms = programs.slice(1);
  //   const monadResult = await runMonad(remainingPrograms, updated, [...digits, i]);
  //   if (monadResult.isValid) {
  //     return monadResult;
  //   }
  // }
  const nexts = [];
  for (let i = 9; i >= 1; i -= 1) {
    const registersForThisState = {...registers}; 
    const {
      registers: updated,
      isCached
    } = await run(program, registersForThisState, [i]);
    nexts.push({
      digit: i,
      updated,
    });
  }
  let goodResult = null;
  for await (const {digit, updated} of nexts) {
    if (goodResult) { return goodResult; }
    const remainingPrograms = programs.slice(1);
    const monadResult = await runMonad(remainingPrograms, updated, [...digits, digit]);
    if (monadResult.isValid) {
      goodResult = monadResult;
      return monadResult;
    }
  }

  return {
    num: null,
    isValid: false,
    registers,
  }
}

function simulate(program) {
  let registers = newRegisters();
  const outputs = [];
  for (let i = 9; i >= 1; i -= 1) {
    const registersForThisState = {...registers}; 
    const {
      registers: updated,
      isCached
    } = run(program, registersForThisState, [i]);
    outputs.push({
      registers: JSON.stringify(updated),
      isCached
    });
  }
  console.table(outputs);
}

async function monad(operations) {
  // separate into miniprograms as each may need to rerun
  const programs = [];
  let buffer = [];
  let programId = 1;
  operations.forEach(o => {
    if (o.op === "inp") {
      if (buffer.length > 0) {
        programs.push({
          id: programId++,
          operations: buffer
        });
      }
      buffer = [];
    }
    buffer.push(o);
  });
  programs.push({
    id: programId++,
    operations: buffer
  });

  let registers = newRegisters();
  return await runMonad(programs, registers, []);
  // simulate(programs[0]);
  // return 0;
}

(async function main() {
  if (!programMemo) {
    await initialiseCache();
  }
  const lines = await aoc.processFile();

  const operations = [];
  for (line of lines) {
    const o = parse(line);
    operations.push(o);
  }
  console.table(operations);
  // const result = run(operations, [15]);
  // console.table(result);
  const result = await monad(operations);
  console.log(">", result);

})();

// x and y get mul 0 before they're used so no need to consider them for memoisation
// z at end of program is counting down to something. 771718723ish when 99999893979999ish
