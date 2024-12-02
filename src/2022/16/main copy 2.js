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

  let globallyBestFoundSoFar = 0;
  function noNeedToBother(valves, totalPressure, stepsRemaining) {
    // if there are valves opened, but continuing is useless because we can't generate a high enough value then just end.
    // NOTE: we keep a global score against all memo at the same level
    const candidates = Object.values(valves).filter(v => !v.isOpened && v.rate !== 0);
    const bestFuture = candidates.sort((a,b) => b.rate-a.rate).map((c, idx) => {
      if (stepsRemaining >= idx*2) {
        return expectedRewardForValve(c.id, stepsRemaining-(idx*2), valves);
      }
      return 0;
    }).reduce((acc, c) => acc+c, 0);

    console.log(totalPressure, bestFuture, globallyBestFoundSoFar);
    if (totalPressure + bestFuture < globallyBestFoundSoFar) {
      return true; // no need to bother
    }
    return !Object.values(valves).some(v => !v.isOpened && v.rate !== 0);
  }

  const memo = {};
  function memoizeResult(key) {
    return (value) => {
      memo[key] = value;
      return memo[key];
    };
  }

  // i think we're close.. need to tweak the algorithm but the idea is there
  // need t oocheck against all combinations
  function maximisePressure(myCurrentValveId, elephantValveId, totalPressure, stepsRemaining, elephantStepsRemaining, valves, history = []) {
    const memoKey = `${[myCurrentValveId, elephantValveId].sort().join("_")}_${totalPressure}_${[stepsRemaining,elephantStepsRemaining].sort().join("_")}`;
    // const memoKey = `${myCurrentValveId}_${elephantValveId}_${totalPressure}_${stepsRemaining}`;
    // console.log(memoKey);
    if (memo[memoKey]) {
      // console.log("memo", memoKey);
      return memo[memoKey];
    }
    // console.log("".padStart(30-stepsRemaining), myCurrentValveId, elephantValveId, totalPressure, stepsRemaining);

    if (stepsRemaining <= 0 || elephantStepsRemaining <= 0) {
      return memoizeResult(memoKey)({
        totalPressure,
        history,
      });
    }

    if (noNeedToBother(valves, totalPressure, stepsRemaining)) {
      return memoizeResult(memoKey)({
        totalPressure,
        history,
      });
    }

    function whenOpeningValve(valveId, valve, sr, oldValves) {
      const output = expectedRewardForValve(valveId, sr, oldValves);
      const updatedValve = {
        ...valve,
        isOpened: true,
      }
      const updatedValves = {
        ...oldValves,
        [valve.id]: updatedValve
      }
      return {
        output,
        updatedValves,
      };
    };

    // combinations [iMove+eMoves, iMove+eOpens, iMove+eRest, iOpen+eMoves, iOpen+eOpens, iOpen+eRest, iRest+eMoves, iRest+eOpens, iRest+eRest]
    function bestResult(candidates) {
      return candidates.reduce((acc, c) => {
        if (c.totalPressure > acc.totalPressure) {
          return c;
        }
        return acc;
      }, {
        totalPressure: 0
      });
    }

    const myValve = valves[myCurrentValveId];
    const isMyValveOpened = myValve.isOpened ?? false;

    // likely douple counting here - not taking into account the elephant's proper movements??
    const myFutureStates = myValve.valves.map(nextValveForMe => {
      let best_iOpen_eStates = 0;
      if (!isMyValveOpened && stepsRemaining >= 2) {
        // console.log("open", currentValveId);
        const { output, updatedValves } = whenOpeningValve(myCurrentValveId, myValve, stepsRemaining, valves);
        
        // iOpen + [elephant]
        const elephantValve = updatedValves[elephantValveId];
        const isElephantValveOpened = elephantValve.isOpened ?? false;
        const iOpen_eStates = elephantValve.valves.map(nextValveForElephant => {
          let iOpen_eOpen = 0;

          if (!isElephantValveOpened && elephantStepsRemaining >= 2) {
            // console.log("open", currentValveId);
            const { output: eOutput, updatedValves: eUpdatedValves } = whenOpeningValve(elephantValveId, elephantValve, elephantStepsRemaining, updatedValves);
            const newPressure = totalPressure + output + eOutput;

            iOpen_eOpen = maximisePressure(nextValveForMe, nextValveForElephant, newPressure, stepsRemaining - 2, elephantStepsRemaining - 2, eUpdatedValves, [...history, 
              { step: stepsRemaining, id: myCurrentValveId, action: "OPEN", eid: elephantValveId, eAction: "OPEN", pressure: newPressure}, 
              { step: stepsRemaining-1, id: myCurrentValveId, action: "OPEN", eid: elephantValveId, eAction: "MOVE", pressure: newPressure}
            ]);
          }

          const iOpen_eMove = maximisePressure(nextValveForMe, nextValveForElephant, totalPressure+output, stepsRemaining - 1, elephantStepsRemaining - 1, updatedValves, [...history, 
            { step: stepsRemaining, id: myCurrentValveId, action: "OPEN",eid: elephantValveId, pressure: totalPressure+output}
          ]);
          // console.log("iOpen+eOthers", iOpen_eOpen, iOpen_eMove);
          return bestResult([iOpen_eOpen, iOpen_eMove]);
        });
        // console.log("iOpen_eStates", iOpen_eStates);
        best_iOpen_eStates = bestResult([...iOpen_eStates]);
      }

      const elephantValve = valves[elephantValveId];
      const isElephantValveOpened = elephantValve.isOpened ?? false;
      const best_iMove_eStates = elephantValve.valves.map(nextValveForElephant => {
        let iMove_eOpen = 0;

        if (!isElephantValveOpened && elephantStepsRemaining >= 2) {
          // console.log("open", currentValveId);
          const { output: eOutput, updatedValves: eUpdatedValves } = whenOpeningValve(elephantValveId, elephantValve, elephantStepsRemaining, valves);
          const newPressure = totalPressure + eOutput;

          iMove_eOpen = maximisePressure(nextValveForMe, nextValveForElephant, newPressure, stepsRemaining - 1, elephantStepsRemaining - 2, eUpdatedValves, [...history, 
            { step: stepsRemaining, id: myCurrentValveId, action: "OPEN", eid: "OPEN", eAction: "OPEN", pressure: newPressure}, 
            { step: stepsRemaining-1, id: myCurrentValveId, action: "OPEN", eid: elephantValveId, eAction: "MOVE",pressure: newPressure}
          ]);
        }

        const iMove_eMove = maximisePressure(nextValveForMe, nextValveForElephant, totalPressure, stepsRemaining - 1, elephantStepsRemaining - 1, valves, [...history, 
          { step: stepsRemaining, id: myCurrentValveId, eid: elephantValveId, pressure: totalPressure}
        ]);

        return bestResult([iMove_eOpen, iMove_eMove]);
      });

      // console.log("best", best_iOpen_eStates, best_iMove_eStates);
      return bestResult([best_iOpen_eStates, ...best_iMove_eStates]);
    });

    const result = memoizeResult(memoKey)(bestResult([...myFutureStates]));
    globallyBestFoundSoFar = Math.max(globallyBestFoundSoFar, result?.totalPressure);
    return result;
  };

  const start = "AA";
  const result = maximisePressure(start, start, 0, 26, 26, pipeValves);
  console.log(result);

})();

// 1731 (test - incorrect)
// 2476 (real - incorret)
