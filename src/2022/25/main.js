const aoc = require("../../aoc");

const DOUBLE_MINUS = "=";
const SINGLE_MINUS = "-";

(async function main() {
  const lines = await aoc.processFile();

  const limitMemo = {};
  function highest(power) {
    const memoKey = `${power}`;
    if (limitMemo[memoKey]) {
      return limitMemo[memoKey];
    }
    const powers = [];
    for (let i = 0; i <= power; ++i) {
      powers.push(2);
    }
    const result = powers.reduce((acc, c, e) => {
      acc += c * (5 ** e);
      return acc;
    }, 0);
    limitMemo[memoKey] = result;
    return result;
  }

  function lowest(power) {
    const memoKey = `_${power}`;
    if (limitMemo[memoKey]) {
      return limitMemo[memoKey];
    }
    const result = -highest(power);
    limitMemo[memoKey] = result;
    return result;
  }

  function getBestMultiple(decimal, power) {
    for (let c = -2; c <= 2; ++c) {
      const d = (5 ** power) * c;
      const remainder = decimal - d;
      const low = lowest(power-1);
      const high = highest(power-1);
      
      // console.log(decimal, `_^${power}*${c}=${d}`, remainder, low, high)
      if (low <= remainder && remainder <= high) {
        return c;
      }
    }

    throw new Error(`cannot fit: ${decimal} ${lowest(power)} ${highest(power)}`);
  }

  function decimalToSnafu(decimal) {
    let highestPower = 0;
    while (decimal > (5 ** highestPower)) {
      highestPower++;
    }
    // console.log(decimal, highestPower);

    const powers = [];

    // look at the difference
    // find the largest number matching (if <0 then = or -; if >0 1 or 2)
    let working = decimal;
    while (highestPower >= 0) {
      let c = getBestMultiple(working, highestPower);
      // console.log(working, highestPower, "=>", c);
      powers.push(c);
      const d = (5 ** highestPower) * c;
      const remainder = working - d;
      working = remainder;
      highestPower--;
    }

    return powers.map(p => {
      if (p === -2) { return DOUBLE_MINUS; }
      if (p === -1) { return SINGLE_MINUS; }
      return p;
    }).join("");
  }

  function snafuToDecimal(snafu) {
    const powers = [];
    const working = [...snafu.split("")];
    working.reverse();
    working.forEach(c => {
      if (c === DOUBLE_MINUS) {
        powers.push(-2);
      } else if (c === SINGLE_MINUS) {
        powers.push(-1)
      } else if (c === "0") {
        powers.push(0);
      } else if (c === "1") {
        powers.push(1);
      } else if (c === "2") {
        powers.push(2);
      }
    });
    
    const result = powers.reduce((acc, c, e) => {
      acc += c * (5 ** e);
      return acc;
    }, 0);
    return result;
  }

  const numbers = [];
  for (line of lines) {
    const decimal = snafuToDecimal(line);
    numbers.push({
      snafu: line,
      decimal: decimal,
    });
    console.log(line, decimal);
  }

  const result = numbers.map(c => c.decimal).reduce((acc, c) => acc + c, 0);
  console.log(result);
  console.log(decimalToSnafu(result));
})();


// That's not the right answer. 
// Please wait one minute before trying again. (You guessed 34182852926025.) [Return to Day 25]