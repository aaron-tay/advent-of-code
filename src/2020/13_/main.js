const aoc = require("../../aoc");

function p1(lines) {
  const earliestTimestamp = +lines[0];
  const buses = lines[1].split(",").filter(i => i !== "x");

  let step = 0;
  let result = null;
  while (result === null) {
    const candidate = earliestTimestamp + step;
    const busId = buses.filter(b => (candidate % b) === 0);
    if (busId.length === 1) {
      result = {
        busId: busId[0],
        time: candidate,
      };
    }
    step += 1;
  }

  console.log(result);
  console.log(result.busId * (result.time - earliestTimestamp));
}

function bruteforce(lines) {

  const rawBuses = lines[1].split(",");
  const buses = [];
  rawBuses.forEach((b, idx) => {
    if (b === "x") { return; }
    buses.push({
      busId: b,
      offset: idx,
    });
  });
  console.log(buses);
  
  const largestBus = buses.reduce((acc, curr) => {
    if (+curr.busId > +acc.busId) {
      return curr;
    }
    return acc;
  }, buses[0]);

  const knownFloor = 1; //401003800000000; // 100000000000000
  const multiplier = Math.floor(knownFloor / +largestBus.busId);
  let timestamp = +largestBus.busId * multiplier;
  console.log(timestamp, largestBus);
  while (true) {
    if (timestamp % 100000000 === 0) {
      console.log(timestamp, timestamp / +largestBus.busId);
    }
    const zero = timestamp - largestBus.offset;
    const allMatched = buses.every((bus, index) => {
      const expected = zero + bus.offset;
      return (expected % bus.busId === 0);
    });
    if (allMatched) {
      console.log(zero);
      break;
    }

    timestamp += +largestBus.busId;
  }
}

function busMultipliers(buses) {
  const mainBus = buses[0];
  // multiple of first bus
  const busMultiple = {}; // busId: N
  let remainingBuses = [...buses];

  const knownFloor = 0;
  const multiplier = Math.floor(knownFloor / +mainBus.busId);
  let timestamp = +mainBus.busId * multiplier;
  while (remainingBuses.length > 0) {
    console.log(timestamp);

    const matchingBuses = [];
    const nonMatchingBuses = [];

    remainingBuses.forEach(bus => {
      const zero = timestamp - mainBus.offset;
      const expected = zero + bus.offset;
      console.log(bus.busId, bus.offset, zero, expected, expected % bus.busId === 0);
      if (expected % bus.busId === 0) {
        matchingBuses.push(bus);
        const bmult = (zero / mainBus.busId);
        console.log(bmult);
        busMultiple[bus.busId] = bmult;
      } else {
        nonMatchingBuses.push(bus);
      }
    });

    remainingBuses = nonMatchingBuses;
    timestamp += (+mainBus.busId);
  }
  console.table(Object.keys(busMultiple).map(key => {
    const theBus = buses.find(b => b.busId == key);
    return {
      busId: theBus.busId,
      offset: theBus.offset,
      multiple: busMultiple[key],
      timestampBase: busMultiple[key] * 23,
      timestamp: (busMultiple[key] * 23) + theBus.offset,
    }
  }).sort((a,b) => a.offset - b.offset));
  return busMultiple;
}

(async function main() {
  const lines = await aoc.processFile();

  p1(lines);

  const rawBuses = lines[1].split(",");
  const buses = [];
  rawBuses.forEach((b, idx) => {
    if (b === "x") { return; }
    buses.push({
      busId: +b,
      offset: +idx,
    });
  });
  console.log(buses);
  
  // find bus with same offset as first bus
  const matchingBus = buses.find(b => {
    return b.offset === +buses[0].busId;
  });
  // const matchingBus = null;
  console.log(matchingBus);
  if (!matchingBus) {
    bruteforce(lines);
    return;
  }
  const mainBus = buses[0];

  const busMultiplier = busMultipliers(buses);
  
  const knownFloor = 406327200000000; // 100000000000000
  const multiplier = Math.floor(knownFloor / +mainBus.busId);
  let timestamp = +mainBus.busId * multiplier;
  console.log(timestamp, mainBus, matchingBus);
  while (true) {
    if (timestamp % 100000000 === 0) {
      console.log(timestamp, timestamp / +mainBus.busId);
    }
    const zero = timestamp - mainBus.offset;
    const allMatched = buses.every((bus, index) => {
      const expected = zero + bus.offset;
      return (expected % bus.busId === 0);
    });
    if (allMatched) {
      console.log(zero);
      break;
    }

    timestamp += (+mainBus.busId * +busMultiplier[matchingBus.busId]);
  }
})();

//401003800000000 too low
//795352783121169 upper bound (too high)

//short 4199 upper
//harder 1687931 upper
