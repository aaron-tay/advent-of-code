const aoc = require("../../aoc");

function canMake(target, list) {
  const map = {};
  list.forEach(i => {
    map[i] = i;
  });

  let result = 0
  list.forEach((number) => {
    if (!!result) { return; }
    const remainder = target - number;
    const hasTaget = map[+remainder];
    if (hasTaget) {
      // console.log(">>>", line, result, (line * result));
      result = hasTaget;
    }
  });
  return !!result;
}

function p1(lines, window) {
  const rolling25 = [];
  let invalidNumber = 0;
  for (line of lines) {
    const number = +line;
    if (rolling25.length > window) {
      rolling25.shift();
      const isValid = canMake(number, rolling25);
      if (!isValid) {
        // console.log(rolling25);
        // console.log(number, isValid);
        return number;
      }
    }
    rolling25.push(number);
    // console.log(line);
  }
  return invalidNumber;
}

(async function main() {
  const lines = await aoc.processFile();

  const target = p1(lines, 25);

  console.log(">", target);

  const rollingSum = [];
  for (line of lines) {
    const number = +line;
    
    if (number > target) {
      console.log("WAH?");
      break;
    }

    // console.log(">", rollingSum);
    if (rollingSum.length > 2) {
      let sum = rollingSum.reduce((acc, curr) => {return (acc + curr)}, 0);
      while (sum > target) {
        rollingSum.shift();
        sum = rollingSum.reduce((acc, curr) => {return (acc + curr)}, 0);
      }
      if (sum === target) {
        console.log(">>?", rollingSum, sum);
        break;;
      }
    }
    rollingSum.push(number);
  }

  const min = Math.min(...rollingSum);
  const max = Math.max(...rollingSum);
  console.log(JSON.stringify(rollingSum), rollingSum.reduce((acc, curr) => {return (acc + curr)}, 0));
  console.log(">>", rollingSum, (min + max));

})();

// 31161678
