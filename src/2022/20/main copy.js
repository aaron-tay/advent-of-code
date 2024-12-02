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

    let difference = (currentIdx + amountToMove);
    let nextLocation = difference % size;

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

  function p1(list) {
    const original = [...list];
    const workingList = [...list];
  
    const size = original.length;
    // console.log("S:", asNumbers(workingList).join(", "));
    original.forEach(key => {
      const [originalOrder, number] = key.split("_").map(c => parseInt(c, 10));
      const idx = workingList.indexOf(key);
      const d = workingList.splice(idx, 1)[0];
      if (d !== key) { throw new Error(`wrong number ${number} != ${d}`); }
      // console.log(originalOrder, number);

      let difference = (idx + number);
      let nextLocation = (difference) % size;
  
      const loopsAround = Math.floor(Math.abs((difference) / size));
      nextLocation += (Math.sign(difference) * loopsAround)
  
      workingList.splice(nextLocation, 0, key);
      // console.log(asNumbers(workingList).join(", "), "| ", number, " =>", idx, nextLocation);
    });
    // console.log("E:", asNumbers(workingList).join(", "));
    const numberList = asNumbers(workingList);
    const idx = numberList.indexOf(0);
    const outcomes = [1000, 2000, 3000].map(c => (c + idx) % size).map(c => numberList[c]);
    console.log("OUTCOME: ", outcomes, "=>", outcomes.reduce((acc, c) => acc + c, 0));
  }
  p1(list);
  console.log(" ---- ");

  function p2(list) {
    const original = [...list];
    const workingList = [...list];
  
    const size = original.length;
    const debugBuffer = [];
    // console.log("S:", asNumbers(workingList).join(", "));
    original.forEach(key => {
      const debug = {};
      if (debugMode) debug.start = [...asNumbers(workingList)].join(", ");

      const [originalOrder, number] = key.split("_").map(c => parseInt(c, 10));
      const idx = workingList.indexOf(key);
      // const d = workingList.splice(idx, 1)[0];
      // if (d !== key) { throw new Error(`wrong number ${number} != ${d}`); }
      workingList[idx] = "DUMMY";
      // console.log([...asNumbers(workingList)].join(", "))
      // console.log(originalOrder, number);
  
      let nextLocation = getNextLocation(idx, number, size);
      if (debugMode) debug.deltaFrom = idx;
      if (debugMode) debug.deltaDistance = number;
      if (debugMode) debug.deltaTo = nextLocation;

      workingList.splice(workingList.indexOf("DUMMY"), 1);
      workingList.splice(nextLocation, 0, key);

      if (debugMode) debug.end = [...asNumbers(workingList)].join(", ");
      debugBuffer.push(debug);
    });
    if (debugMode) console.table(debugBuffer);
    console.log("E:", asNumbers(workingList).join(", "));
    const numberList = asNumbers(workingList);
    const idx = numberList.indexOf(0);
    const outcomes = [1000, 2000, 3000].map(c => (c + idx) % size).map(c => numberList[c]);
    console.log("OUTCOME: ", outcomes, "=>", outcomes.reduce((acc, c) => acc + c, 0));
  }
  const decryptionKey = 811589153;
  // const decryptionKey = 23;
  const p2List = list.map(key => {
    const [originalOrder, number] = key.split("_").map(c => parseInt(c, 10));
    return `${originalOrder}_${number * decryptionKey}`;
  });
  // console.log(Math.max(...asNumbers(p2List)));
  p2(list);
  // p2(p2List);
})();

// 0, -2434767459, 3246356612, -1623178306, 2434767459, 1623178306, 811589153


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