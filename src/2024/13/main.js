const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const machinesLines = aoc.groupLines(lines);
  console.log(machinesLines);

  function countTokens(countA, countB) {
    return countA * 3 + countB * 1;
  }

  function parseButton(buttonLine) {
    const [lx, ly] = buttonLine.split(": ")[1].split(",");
    const x = lx.split("+")[1];
    const y = ly.split("+")[1];
    return {
      dx: parseInt(x, 10),
      dy: parseInt(y, 10),
    };
  }
  function parsePrize(prizeLine) {
    const [lx, ly] = prizeLine.split(": ")[1].split(",");
    const x = lx.split("=")[1];
    const y = ly.split("=")[1];
    return {
      x: parseInt(x, 10),
      y: parseInt(y, 10),
    };
  }

  function parse(machineLines) {
    return {
      buttonA: parseButton(machineLines[0]),
      buttonB: parseButton(machineLines[1]),
      prize: parsePrize(machineLines[2]),
    };
  }

  const machines = machinesLines.map((machineLines) => {
    const machine = parse(machineLines);
    return machine;
  });
  console.table(machines);

  const cache = {};
  function movement(button, multiplier) {
    const key = `${button.dx}_${button.dy}_${multiplier}`;
    if (cache[key]) {
      return cache[key];
    }
    const r = {
      x: button.dx * multiplier,
      y: button.dy * multiplier,
    };
    cache[key] = r;
    return r;
  }

  function isOverPrize(da, db, prize) {
    const total = {
      x: da.x + db.x,
      y: da.y + db.y,
    };
    // console.log(da, db, prize, total);
    return total.x === prize.x && total.y === prize.y;
  }
  function hasOvershot(da, db, prize) {
    const total = {
      x: da.x + db.x,
      y: da.y + db.y,
    };
    // console.log(da, db, prize, total);
    return total.x > prize.x || total.y > prize.y;
  }

  function findAttempts(machine) {
    const attempts = [];
    for (let a = 0; a < 100; ++a) {
      // console.log(a);
      const da = movement(machine.buttonA, a);
      for (let b = 0; b < 100; ++b) {
        const db = movement(machine.buttonB, b);
        if (hasOvershot(da, db, machine.prize)) {
          break;
        }
        const canWin = isOverPrize(da, db, machine.prize);
        if (canWin) {
          // console.log("PRESSED", a, b);
          attempts.push({
            a,
            b,
            spend: countTokens(a, b),
          });
        }
      }
    }
    return attempts;
  }

  // const pt1 = machines.map((machine) => {
  //   const attempts = findAttempts(machine);
  //   return Math.min(attempts.map((a) => a.spend));
  // });
  // console.log(pt1.reduce((acc, c) => acc + c, 0));

  const pt2Machines = machines.map((machine) => {
    return {
      ...machine,
      prize: {
        x: machine.prize.x + 10000000000000,
        y: machine.prize.y + 10000000000000,
      },
    };
  });
  console.table(pt2Machines);

  function buttonToPoint(button) {
    return {
      x: button.dx,
      y: button.dy,
    };
  }
  function fromPrize(prize, button) {
    return {
      x: prize.x - button.dx,
      y: prize.y - button.dy,
    };
  }

  function lineEquation(pt1, pt2) {
    const A = pt2.y - pt1.y;
    const B = pt1.x - pt2.x;
    const C = pt1.y * (pt2.x - pt1.x) - (pt2.y - pt1.y) * pt1.x;
    return { A, B, C };
  }

  function findIntersection(line1, line2) {
    const x = (line1.C * line2.B - line1.B * line2.C) / (line1.B * line2.A - line2.B * line1.A);
    const y = (-line1.A / line1.B) * x - line1.C / line1.B;
    return { x: Math.round(x), y: Math.round(y) };
    // return { x, y };
  }

  function isValid(pt) {
    return Number.isInteger(pt.x) && Number.isInteger(pt.y);
  }

  function ptScoreA(machine, inflection) {
    const a = inflection.x / machine.buttonA.dx;
    const b = (machine.prize.x - inflection.x) / machine.buttonB.dx;

    if (inflection.y / machine.buttonA.dy !== a) {
      return null;
    }
    if ((machine.prize.y - inflection.y) / machine.buttonB.dy !== b) {
      return null;
    }
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      return null;
    }
    return {
      a,
      b,
      spend: countTokens(a, b),
    };
  }
  function ptScoreB(machine, inflection) {
    const b = inflection.x / machine.buttonB.dx;
    const a = (machine.prize.x - inflection.x) / machine.buttonA.dx;

    if (inflection.y / machine.buttonB.dy !== b) {
      return null;
    }
    if ((machine.prize.y - inflection.y) / machine.buttonA.dy !== a) {
      return null;
    }

    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      return null;
    }
    return {
      a,
      b,
      spend: countTokens(a, b),
    };
  }

  function findAttemptsPt2(machine) {
    const attempts = [];

    const origin = { x: 0, y: 0 };
    const A0 = lineEquation(origin, buttonToPoint(machine.buttonA));
    const B0 = lineEquation(origin, buttonToPoint(machine.buttonB));

    const PA = lineEquation(fromPrize(machine.prize, machine.buttonA), machine.prize);
    const PB = lineEquation(fromPrize(machine.prize, machine.buttonB), machine.prize);

    // console.log(A0, B0, PA, PB);
    const A0PB = findIntersection(A0, PB);
    const B0PA = findIntersection(B0, PA);

    console.log("int", A0PB, B0PA);
    if (isValid(A0PB)) {
      attempts.push(ptScoreA(machine, A0PB));
    }
    if (isValid(B0PA)) {
      attempts.push(ptScoreB(machine, B0PA));
    }
    // console.log(attempts);

    return attempts.filter((a) => a);
  }

  const pt2 = pt2Machines.map((machine) => {
    const attempts = findAttemptsPt2(machine);
    // const at1 = findAttempts(machine);
    // console.log(">>", machine, attempts, at1);
    return Math.min(...attempts.map((a) => a.spend));
  });
  // console.log(">", pt2);
  console.log(pt2.filter((a) => Number.isFinite(a)).reduce((acc, c) => acc + c, 0));
})();

// 39639 too low!?
// 39748

// 62686055521338 too low
// 73001057362880 too low
// 74478585072604
