const aoc = require("../../aoc");

(async function main() {
  const debugMode = true;
  const lines = await aoc.processFile();

  const list = [];
  let originalOrder = 0;
  for (line of lines) {
    const number = line;
    // console.log(number);
    list.push(`${originalOrder}_${number}`);
    ++originalOrder;
  }

  function asNumbers(list) {
    return list.map(c => c.split("_").map(c => parseInt(c, 10))[1] ?? "?");
  }

  const memo = {};
  function memoizeResult(key) {
    return (value) => {
      memo[key] = value;
      return memo[key];
    };
  }

  function getNextLocation(currentIdx, amountToMove, size) {
    const memoKey = `${currentIdx}_${amountToMove}_${size}`;
    if (memo[memoKey]) {
      return memo[memoKey].nextLocation;
    }

    let difference = currentIdx + amountToMove;
    let nextLocation = currentIdx;
    if (difference < 0) {
      nextLocation = size - (Math.abs(difference) % size);
    } else {
      nextLocation = (difference) % size;
    }

    // const loopsAround = Math.floor(Math.abs((difference) / size));
    // nextLocation += (Math.sign(difference) * loopsAround)

    // let difference = (currentIdx + amountToMove);
    // let nextLocation = difference % size;

    // let loopsAround = Math.floor(Math.abs((difference) / size));
    // loops around could be more than size so also need to rescale it
    // while (loopsAround > 0) {
    //   loopsAround -= size;
    // }
    // while (loopsAround <= 0) {
    //   loopsAround += size;
    // }
    // nextLocation += (Math.sign(difference) * loopsAround)
    // while (nextLocation > 0) {
    //   nextLocation -= size;
    // }
    // while (nextLocation <= 0) {
    //   nextLocation += size;
    // }
    // if (debugMode) console.log(nextLocation);

    return memoizeResult(memoKey)({
      nextLocation,
    }).nextLocation;
  }

  function mix(list, original) {
    // returns mixed list
    const workingList = [...list];
  
    const size = original.length;
    // console.log("S:", asNumbers(workingList).join(", "));
    original.forEach(key => {
      const [originalOrder, number] = key.split("_").map(c => parseInt(c, 10));
      const idx = workingList.indexOf(key);
      const d = workingList.splice(idx, 1)[0];
      if (d !== key) { throw new Error(`wrong number ${number} != ${d}`); }
      // console.log(originalOrder, number);

      const nextLocation = getNextLocation(idx, number, size - 1);
      // let difference = (idx + number);
      // let nextLocation = (difference) % size;
  
      // const loopsAround = Math.floor(Math.abs((difference) / size));
      // nextLocation += (Math.sign(difference) * loopsAround)
  
      workingList.splice(nextLocation, 0, key);
      // console.log(asNumbers(workingList).join(", "), "| ", number, " =>", idx, nextLocation);
    });
    return workingList;
  }

  function p1(list, cycles = 1) {
    let workingList = [...list];
    for (let c = 0; c < cycles; ++c) {
      workingList = mix(workingList, list);
      // console.log("E:", asNumbers(workingList).join(", "));
    }
    const numberList = asNumbers(workingList);
    const idx = numberList.indexOf(0);
    const size = workingList.length;
    const outcomes = [1000, 2000, 3000].map(c => (c + idx) % size).map(c => numberList[c]);
    console.log("OUTCOME: ", outcomes, "=>", outcomes.reduce((acc, c) => acc + c, 0));
  }
  p1(list, 1);
  console.log(" ---- ");

  const decryptionKey = 811589153;
  // const decryptionKey = 23;
  const p2List = list.map(key => {
    const [originalOrder, number] = key.split("_").map(c => parseInt(c, 10));
    return `${originalOrder}_${number * decryptionKey}`;
  });
  // console.log(asNumbers(p2List));
  p1(p2List, 10);
})();

// 0, -2434767459, 3246356612, -1623178306, 2434767459, 1623178306, 811589153
// 0 1 2 3
//  A B C
// e.g. move A + 10: B C => A B C
// e.g. move A + 11: B C => B A C
// e.g. move A + 12: B C => B C A == A B C
// e.g. move A - 10: B C => A B C
// e.g. move A - 11: B C => B A C
// e.g. move C - 10: B C => C A B == A B C
// e.g. move C - 11: B C => A C B


// 8115891530000
// 3246356612

// That's not the right answer. 
// If you're stuck, make sure you're using the full input data; 
// there are also some general tips on the about page, or you can ask for hints on the subreddit. 
// Please wait one minute before trying again. (You guessed 5270.) [Return to Day 20]

// (You guessed 5195.)

// That's not the right answer; your answer is too high. 
// If you're stuck, make sure you're using the full input data; 
// there are also some general tips on the about page, or you can ask for hints on the subreddit. 
// Please wait one minute before trying again. (You guessed 3587.)

// 3246356612

// 2622 P1 answer

// 1538773034088 correct!