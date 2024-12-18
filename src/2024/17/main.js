const aoc = require("../../aoc");

const REGISTERS = {
  A: "A",
  B: "B",
  C: "C",
};
BigInt.prototype.toJSON = function () {
  return { $bigint: this.toString() };
};
(async function main() {
  const lines = await aoc.processFile();

  const [registerLines, programLines] = aoc.groupLines(lines);
  const registers = {};
  registerLines.forEach((line) => {
    const { id, value } = /Register (?<id>.): (?<value>\d*)/.exec(line).groups;
    console.log(id, value);
    registers[id] = BigInt(value);
  });
  const program = programLines[0]
    .split(" ")[1]
    .split(",")
    .map((n) => Number(n));
  console.log(program);

  function comboOperand(operand, registers) {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return operand;
      case 4:
        return registers[REGISTERS.A];
      case 5:
        return registers[REGISTERS.B];
      case 6:
        return registers[REGISTERS.C];
      case 7:
      default:
        throw new Error(`invalid operand ${operand}`);
    }
  }

  const instructions = {
    adv: {
      opcode: 0,
      op: "adv",
      fn(operand, registers) {
        const numerator = BigInt(registers[REGISTERS.A]);
        const denominator = BigInt(2) ** BigInt(comboOperand(operand, registers));
        const result = BigInt(numerator / denominator);
        registers[REGISTERS.A] = result;
      },
    },
    bxl: {
      opcode: 1,
      op: "bxl",
      fn(operand, registers) {
        const result = BigInt(registers[REGISTERS.B]) ^ BigInt(operand);
        registers[REGISTERS.B] = result;
      },
    },
    bst: {
      opcode: 2,
      op: "bst",
      fn(operand, registers) {
        const result = BigInt(comboOperand(operand, registers)) % BigInt(8);
        registers[REGISTERS.B] = result;
      },
    },
    jnz: {
      opcode: 3,
      op: "jnz",
      fn(operand, registers) {
        if (BigInt(registers[REGISTERS.A]) === 0n) {
          return;
        }
        return operand;
      },
    },
    bxc: {
      opcode: 4,
      op: "bxc",
      fn(operand, registers) {
        const result = BigInt(registers[REGISTERS.B]) ^ BigInt(registers[REGISTERS.C]);
        registers[REGISTERS.B] = result;
      },
    },
    out: {
      opcode: 5,
      op: "out",
      fn(operand, registers, printer) {
        const result = BigInt(comboOperand(operand, registers)) % BigInt(8);
        printer.push(result);
      },
    },
    bdv: {
      opcode: 6,
      op: "bdv",
      fn(operand, registers) {
        const numerator = BigInt(registers[REGISTERS.A]);
        const denominator = BigInt(2) ** BigInt(comboOperand(operand, registers));
        const result = BigInt(numerator / denominator);
        registers[REGISTERS.B] = result;
      },
    },
    cdv: {
      opcode: 7,
      op: "cdv",
      fn(operand, registers) {
        const numerator = BigInt(registers[REGISTERS.A]);
        const denominator = BigInt(2) ** BigInt(comboOperand(operand, registers));
        const result = BigInt(numerator / denominator);
        registers[REGISTERS.C] = result;
      },
    },
  };
  const cache = {};
  function findInstruction(opcode) {
    if (cache[opcode]) {
      return cache[opcode];
    }
    const instruction = Object.values(instructions).find((i) => i.opcode === opcode);
    cache[opcode] = instruction;
    return instruction;
  }

  function runProgram(program, registers) {
    let iPtr = 0;
    const printer = [];
    const programRegisters = structuredClone(registers);
    while (iPtr < program.length) {
      const opcode = program[iPtr];
      const operand = program[iPtr + 1];
      const instruction = findInstruction(opcode);
      // console.log(opcode, operand, instruction, programRegisters, printer, iPtr);
      const ptr = instruction.fn(operand, programRegisters, printer);
      if (ptr !== undefined) {
        iPtr = ptr;
      } else {
        iPtr += 2;
      }
    }
    return {
      output: printer.join(","),
      registers: programRegisters,
    };
  }

  function pt1() {
    const result = runProgram(program, registers);
    console.log(result.registers);
    console.log("pt1> ", result.output);
    return result;
  }
  const p1Output = pt1();

  function pt2() {
    const reference = p1Output;
    const referenceProgram = program.join(",");
    // 281474976710656 (8^16)
    // 8589934592
    // const min = 247841339989000n; // 281518900100000n;
    // const max = min + 8n ** 12n; //247842240100000n; //36068900100000n;
    // 246290604621824
    // basically 8^16, try each digit to narrow it down. binary search could find it
    // 248863537559736n
    const min = 248863537559736n - 8n * 16n; //8n ** 15n;
    const max = 248863537559736n; //8n ** 16n;
    for (let nn = 0n; nn <= 7n; nn += 1n) {
      // lol let's do it manually. run, eyeball and retry. can prob code it
      //           [0n, 0n, 0n, 0n, 12, 0n, 0n, 045, 0n, 0n, 0n, 0n, 0n, 4n, 0n, 7n];
      // const bits = [0n, 0n, 27, 0n, 57, 0n, 36, 4n, 3n, 0n, 2n, 4n, 6n, 2n, 0n, 7n];
      const bits = [nn, 7n, 2n, 4n, 1n, 5n, 6n, 5n, 3n, 0n, 2n, 4n, 6n, 2n, 0n, 7n];
      console.log(bits);
      // for (let i = min; i < max; i += 1n) {
      const i = bits.reduce((acc, b, idx) => acc + BigInt(b * 8n ** BigInt(idx)), 0n);
      // 321685687669321n
      const changedRegisters = structuredClone(registers);
      changedRegisters[REGISTERS.A] = i;
      const result = runProgram(structuredClone(program), changedRegisters);
      console.log(i, "\n", result.registers, result.output, " \n", reference.registers, referenceProgram);
      if (
        // JSON.stringify(result.registers) === JSON.stringify(reference.registers) &&
        result.output === referenceProgram
      ) {
        console.log("PT2> ", i);
        return;
      }
      if (result.output.length > referenceProgram.length) {
        console.log("LG> ", i); // too high
        return;
      }
      // if (result.output.length < referenceProgram.length) {
      //   console.log("SM> ", i); // too high
      //   return;
      // }
    }
  }
  //
  pt2();
})();

// 150000000
// 134238548 ...737
// 204748205 too high

// 25620154 too low!?
// 16969349 too low!?
// 16777001 lower bound
// 134218001 too large?? ok need bigint XD

// 2,4,1,1,7,5,0,3,4,7,1,6,5,5,3,0
