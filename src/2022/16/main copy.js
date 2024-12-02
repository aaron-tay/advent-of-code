const { findLastIndex } = require("lodash");
const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function parseLine(line) {
    // Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
    const [l, r] = line.split("; ");
    const id = l.split(" has ")[0].trim().split(" ")[1];
    const rate = parseInt(l.split("rate=")[1], 10);
    const valves = r.split(/(valves|valve)/)[2].split(", ").map(c => c.trim());
    // console.log(id, rate, valves);
    return {
      id,
      rate,
      valves
    }
  }

  function expectedRewardForValve(id, ifReleasedOnStep, valves) {
    const valve = valves[id];

    // valve already used
    if (valve.isOpened) { return 0; }

    // first step is 0
    // subsequent steps release the actual rate
    let result = 0;
    for (let i = ifReleasedOnStep - 1; i > 0; --i) {
      result += valve.rate;
    }
    return result;
  }

  const pipeValves = {};
  for (line of lines) {
    const pv = parseLine(line);
    pipeValves[pv.id] = pv;
  }
  console.log(pipeValves);

  // need to stop loops
  function isLoop(path, candidateId, valves) {
    const didVisit = path.map(p => p.id).includes(candidateId);
    if (!didVisit) { return false; }

    const lastValveId = path[path.length - 1].id;
    return valves[lastValveId].valves.includes(candidateId);
  }

  function noNeedToBother(valves) {
    return !Object.values(valves).some(v => !v.isOpened && v.rate !== 0);
  }

  const memo = {};
  function memoizeResult(key) {
    return (value) => {
      memo[key] = value;
      return memo[key];
    };
  }
  function maximisePressure(myCurrentValveId, elephantValveId, totalPressure, stepsRemaining, valves, history = []) {
    // console.log("".padStart(30-stepsRemaining), myCurrentValveId, elephantValveId, totalPressure, stepsRemaining);
    // const memoKey = `${[myCurrentValveId, elephantValveId].sort().join("_")}_${totalPressure}_${stepsRemaining}`;
    const memoKey = `${myCurrentValveId}_${elephantValveId}_${totalPressure}_${stepsRemaining}`;
    // console.log(memoKey);
    if (memo[memoKey]) {
      return memo[memoKey];
    }

    if (stepsRemaining <= 0) {
      return memoizeResult(memoKey)({
        totalPressure,
        history,
      });
    }

    if (noNeedToBother(valves)) {
      return memoizeResult(memoKey)({
        totalPressure,
        history,
      });
    }
    // if (isLoop(history, currentValveId, valves)) {
    //   return {
    //     totalPressure,
    //     history,
    //   };
    // }
    const myPv = valves[myCurrentValveId];
    const myIsOpened = myPv.isOpened ?? false;

    const myFutureStates = myPv.valves.map(v => {
      let bestOpened = 0;
      if (!myIsOpened && stepsRemaining >= 2) {
        // console.log("open", currentValveId);
        const output = expectedRewardForValve(myCurrentValveId, stepsRemaining, valves);
        const newPressure = totalPressure + output;
        const updatedValve = {
          ...myPv,
          isOpened: true,
        }
        const updatedValves = {
          ...valves,
          [myPv.id]: updatedValve
        }
        bestOpened = maximisePressure(v, elephantValveId, newPressure, stepsRemaining - 2, updatedValves, [...history, 
          { step: stepsRemaining, id: "OPEN", eid: elephantValveId,pressure: totalPressure}, 
          { step: stepsRemaining-1, id: myCurrentValveId, eid: elephantValveId, pressure: newPressure}
        ]);
      }

      const bestNothing = maximisePressure(v, elephantValveId, totalPressure, stepsRemaining - 1, valves, [...history, 
        { step: stepsRemaining, id: myCurrentValveId, eid: elephantValveId, pressure: totalPressure}
      ]);

      return [bestOpened, bestNothing].reduce((acc, c) => {
        if (c.totalPressure > acc.totalPressure) {
          return c;
        }
        return acc;
      }, {
        totalPressure: 0
      });
    });
    
    const pv = valves[elephantValveId];
    const isOpened = pv.isOpened ?? false;

    const futureStates = pv.valves.map(v => {
      let bestOpened = 0;
      if (!isOpened && stepsRemaining >= 2) {
        // console.log("open", currentValveId);
        const output = expectedRewardForValve(elephantValveId, stepsRemaining, valves);
        const newPressure = totalPressure + output;
        const updatedValve = {
          ...pv,
          isOpened: true,
        }
        const updatedValves = {
          ...valves,
          [pv.id]: updatedValve
        }
        bestOpened = maximisePressure(myCurrentValveId, v, newPressure, stepsRemaining - 2, updatedValves, [...history, 
          { step: stepsRemaining, id: myCurrentValveId, eid: "OPEN", pressure: totalPressure}, 
          { step: stepsRemaining-1, id: myCurrentValveId, eid: elephantValveId, pressure: newPressure}
        ]);
      }

      const bestNothing = maximisePressure(myCurrentValveId, v, totalPressure, stepsRemaining - 1, valves, [...history, 
        { step: stepsRemaining, id: myCurrentValveId, eid: elephantValveId, pressure: totalPressure}
      ]);

      return [bestOpened, bestNothing].reduce((acc, c) => {
        if (c.totalPressure > acc.totalPressure) {
          return c;
        }
        return acc;
      }, {
        totalPressure: 0
      });
    });

    return memoizeResult(memoKey)([...myFutureStates, ...futureStates].reduce((acc, c) => {
      if (c.totalPressure > acc.totalPressure) {
        return c;
      }
      return acc;
    }, {
      totalPressure: 0
    }));
  }

  const start = "AA";
  const result = maximisePressure(start, start, 0, 30, pipeValves);
  console.log(result);

})();
