const aoc = require("../../aoc");

function p1(lines) {
  const memory = {};
  let currentMask = "";
  for (line of lines) {
    // mask = 1X11X010X000X0X101X00100011X10100111
    // mem[40278] = 36774405
    if (line.startsWith("mask")) {
      [_, currentMask] = line.split(" = ");
      console.log(currentMask);
      continue;
    }

    const [m, n] = line.split(" = ");
    const memValue = +n;
    const memId = m.split("[")[1].split("]")[0];
    console.log(currentMask, memId, memValue, memValue.toString(2));
    if (!memory[memId]) { memory[memId] = ""; }
    const old = memory[memId].split("").reverse();
    const memBits = memValue.toString(2).padStart(36, '0').split("").reverse();
    const revMask = currentMask.split("").reverse();

    const revNew = revMask.map((m, idx) => {
      if (m === "X") {
        return (memBits[idx] || old[idx] || 0)
      }
      return m;
    });
    const toWrite = revNew.reverse().join("");
    console.table({
      dec: memValue,
      value: memValue.toString(2).padStart(36, '0'),
      mask: currentMask,
      result: toWrite,
      resDec: parseInt(toWrite, 2)
    });
    memory[memId] = toWrite;
    console.log(memory);
  }
  const res = Object.values(memory).reduce((acc, curr) => acc + parseInt(curr, 2), 0);
  console.log(res);
}

function p2Apply(memoryAddressDecimal, mask) {
  const memAddrBits = memoryAddressDecimal.toString(2).padStart(36, '0').split("").reverse();
  const revMask = mask.split("").reverse();
  const revNew = revMask.map((m, idx) => {
    if (m === "X") {
      return "X";
    }
    if (m === "0") {
      return memAddrBits[idx];
    }
    return m;
  });
  // console.log(memoryAddressDecimal, mask);
  // console.table(revNew);
  return revNew.reverse().join("");
}

function sumFloating(floating) {
  let result = 0;

  // split into non-float and floating
  const revFloating = floating.split("").reverse();
  const nonFloating = revFloating.map(m => {
    if (m === "X") { return 0; }
    return m;
  });
  let nonFloatingResult = parseInt(nonFloating.reverse().join(""), 2);
  const numFloating = revFloating.filter(m => m === "X").length;
  const multiplier = Math.pow(2, numFloating);

  console.table({
    floating,
    nonFloatingResult,
    multiplier,
  });
  const floatingSum = revFloating.map((m, idx) => {
    if (m !== "X") { return 0; }
    const value = Math.pow(2, idx);
    console.log(m, idx, value, (multiplier / 2));
    return (value * (multiplier / 2));
  }).reduce((acc, curr) => acc + curr, 0);

  console.log(multiplier * nonFloatingResult, floatingSum);
  result = (multiplier * nonFloatingResult) + (floatingSum);

  return result;
}

(async function main() {
  const lines = await aoc.processFile();
  // p1(lines);

  const memory = {}; // id:[...]
  let currentMask = "";
  for (line of lines) {
    // mask = 1X11X010X000X0X101X00100011X10100111
    // mem[40278] = 36774405
    if (line.startsWith("mask")) {
      [_, currentMask] = line.split(" = ");
      console.log(currentMask);
      continue;
    }

    const [m, n] = line.split(" = ");
    const memValue = +n;
    const memId = +(m.split("[")[1].split("]")[0]);
    // console.log(currentMask, memId, memValue, memId.toString(2));
    if (!memory[memId]) { memory[memId] = []; }

    console.log(memId, memId.toString(2), currentMask);
    const toWrite = p2Apply(memId, currentMask);
    console.log("writing", toWrite);
    // console.table(toWrite);
    memory[memId] = toWrite;
  }
  const res = Object.values(memory).reduce((acc, curr) => acc + sumFloating(curr), 0);
  console.log(res);
})();

// 16114926336752 too high
// 16003257187056
