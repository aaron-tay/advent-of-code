const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const cycles = [];
  const debug = [];
  let register = 1;
  for (line of lines) {
    console.log(line);
    if (line === "noop") {
      cycles.push(register);
      debug.push(`${line}`);
    } else {
      const addRegex = /addx (?<value>.*)/;
      const { groups: m } = addRegex.exec(line);
      const value = parseInt(m.value, 10);
      cycles.push(register);
      debug.push(`${line}_wait`);
      register += value;
      cycles.push(register);
      debug.push(`${line}_apply`);
    }
  }
  function p1() {
    const outcomes = [];
    cycles.forEach((v, idx) => {
      console.log(idx, debug[idx], "->", cycles[idx]);
      const cycleCount = idx+2;
      if (cycleCount === 20) {
        const value = cycleCount * v;
        console.log(cycleCount, v, value);
        outcomes.push(value);
      } else {
        if (cycleCount >= 60) {
          if ((cycleCount-60) % 40 === 0) {
            const value = cycleCount * v;
            console.log(cycleCount, v, value);
            outcomes.push(value);
          }
        }
      }
    });
  
    const result = outcomes.reduce((acc, c) => acc + c, 0);
    console.log(result);
  }

  function cycleInSprite(pixelLocation, register) {
    return register-1 <= pixelLocation && pixelLocation <= register+1;
  }

  const outcomes = [];
  let row = [];
  const crt = [];
  cycles.forEach((v, idx) => {
    // console.log(idx, debug[idx], "->", cycles[idx]);
    const cycleCount = idx+1;
    const shouldDraw = cycleInSprite(cycleCount % 40, cycles[idx]);
    if (shouldDraw) {
      row.push("#");
    } else {
      row.push(".");
    }
    if (cycleCount % 40 === 0) {
      crt.push(row.join(""));
      row = [];
    }
  });
  console.log(crt);
  BUCACBUZ
})();
