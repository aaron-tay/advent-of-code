const { findIndex } = require("lodash");
const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const packetPairs = [];
  let buffer = [];
  let idx = 1;
  for (line of lines) {
    if (line === "") {
      packetPairs.push({
        idx: idx,
        left: buffer[0],
        right: buffer[1]
      });
      buffer = [];
      idx++;
    } else {
      buffer.push(eval(line));
    }
  }
  if (buffer) {
    packetPairs.push({
      idx: idx,
      left: buffer[0],
      right: buffer[1]
    });
    buffer = [];
  }

  function rule1(left, right) {
    // console.log(" rule 1");
    if (Number.isInteger(left) && Number.isInteger(right)) {
      if (left === right) {
        console.log(left, "===", right);
        return 0;
      } else if (left < right) {
        console.log(left, "<", right, true);
        return 1;
      } else if (left > right) {
        console.log(left, ">", right, false);
        return -1;
      }
    }
    // console.log("rule1 skipped", left, right);
    return 0;
  }

  function rule2(left, right) {
    // console.log(" rule 2");
    if (Array.isArray(left) && Array.isArray(right)) {
      for (let i = 0; i < left.length; ++i) {
        if (right[i] === undefined) {
          console.log("no more on right fail");
          return -1;
        }
        const c = compare(left[i], right[i]);
        if (c === -1) {
          console.log("fail");
          return -1;
        }
        if (c === 1) {
          console.log("OK");
          return 1;
        }
      }
      if (left.length < right.length) {
        console.log("too many on right => OK");
        return 1;
      }
      console.log("no more");
      return 0;
    }
    // console.log("rule2 skipped", left, right);
    return 0;
  }

  function rule3(left, right) {
    // console.log(" rule 3");
    if (Number.isInteger(left) && !Number.isInteger(right)) {
      return compare([left], right);
    } else if (Number.isInteger(right) && !Number.isInteger(left)) {
      return compare(left, [right]);
    }
    // console.log("rule3 skipped", left, right);
    return 0;
  }

  function compare(left, right) {
    console.log(`Compare `,left," vs ",right );
    let c = rule1(left, right);
    if (c === 1 || c === -1) { return c; }

    c = rule2(left, right);
    if (c === 1 || c === -1) { return c; }

    c = rule3(left, right);
    if (c === 1 || c === -1) { return c; }

    console.log("exhausted", left, right);
    return 0;
  }


  const outcomes = packetPairs.filter(({left, right}) => {
    const c = compare(left, right);
    return c === 1;
  });
  console.log(outcomes);
  const result = outcomes.reduce((acc, c) => acc + c.idx, 0);
  console.log(result);

  packetPairs.push({
    left: [[2]],
    right: [[6]]
  });
  const allPackets = [];
  packetPairs.forEach(pp => {
    allPackets.push(pp.left);
    allPackets.push(pp.right);
  });
  allPackets.sort(compare).reverse();
  // console.log(allPackets);
  const asString = allPackets.map(p => JSON.stringify(p));
  const two = asString.findIndex(p => p === "[[2]]")+1;
  const six = asString.findIndex(p => p === "[[6]]")+1;
  console.log(asString, two, six);
  console.log(two * six);
})();

// That's not the right answer. 
// Curiously, it's the right answer for someone else; you might be logged in to the wrong account or just unlucky. 
// In any case, you need to be using your puzzle input. 
// If you're stuck, make sure you're using the full input data; 
// there are also some general tips on the about page, or you can ask for hints on the subreddit. 
// Please wait one minute before trying again. (You guessed 6420.) [Return to Day 13]

// That's not the right answer. 
// If you're stuck, make sure you're using the full input data; 
// there are also some general tips on the about page, or you can ask for hints on the subreddit. 
// Please wait one minute before trying again. (You guessed 5108.) [Return to Day 13]

// That's not the right answer. 
// If you're stuck, make sure you're using the full input data; 
// there are also some general tips on the about page, or you can ask for hints on the subreddit. 
// Please wait one minute before trying again. (You guessed 7549.) [Return to Day 13]

// 5760