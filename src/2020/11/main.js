const aoc = require("../../aoc");

let maxRow = 0;
let maxCol = 0;

function makeKey(row, col) {
  return `${row}_${col}`;
}

function prepareSeats(lines) {
  const seats = {};

  lines.forEach((line, row) => {
    line.split("").forEach((seat, col) => {
      // console.log(seat, row, col);
      const theKey = makeKey(row, col);
      seats[theKey] = seat;
    });
  });

  return seats;
}

function neighbourKeys(key) {
  const [row, col] = key.split("_");
  const result = [];

  const range = [-1,0,1];
  range.forEach(r => {
    range.forEach(c => {
      if (r === 0 && c === 0) { return; }
      result.push(makeKey((+row)+r, (+col)+c));
    });
  });

  return result;
}

function getSeats(keys, seats) {
  const result = [];

  keys.forEach(key => {
    const candidate = seats[key];
    if (!candidate) { return; }
    if (candidate === "L" || candidate === "#") {
      result.push(candidate);
    }
  });

  return result;
}

// from direction to vector
let memoVectors = null;
function visibleVector() {
  if (memoVectors) { return memoVectors; }
  const result = [];

  const range = [-1,0,1];
  range.forEach(r => {
    range.forEach(c => {
      if (r === 0 && c === 0) { return; }
      result.push({ r, c });
    });
  });

  memoVectors = result;
  return result;
}

function getNearestSeats(key, seats) {
  const result = [];

  const vectorKeys = visibleVector();

  const scaleKey = (vectorKey, scale) => {
    const [row, col] = key.split("_");
    const {r:x, c:y} = vectorKey;
    return makeKey((+row) + (x * scale), (+col) +(y * scale));
  }

  vectorKeys.forEach(vKey => {
    let scale = 1;
    while (true) {
      // console.log(vKey);
      let cKey = scaleKey(vKey, scale);
      // console.log(key, vKey, scale, cKey);
      const candidate = seats[cKey];
      if (!candidate) { break; }
      if (candidate === ".") {
        scale++;
        continue;
      }
      if (candidate === "L" || candidate === "#") {
        result.push(candidate);
        break;
      }
    }
  });
  
  return result;
}

function apply(seats, tolerance, seatGetter) {
  let hasChanges = false;
  const updatedSeats = {...seats};

  Object.keys(seats).forEach((key, idx) => {
    const neighbourSeats = seatGetter(key, seats);
    
    const current = seats[key];
    if (current === "L") {
      const hasNoOccupiedNeighbours = neighbourSeats.every(s => s !== "#");
      if (hasNoOccupiedNeighbours) {
        updatedSeats[key] = "#";
        hasChanges = true;
      }
    } else if (current === "#") {
      const hasFourOrMoreOccupiedNeighbours = neighbourSeats.filter(s => s === "#").length >= tolerance;
      if (hasFourOrMoreOccupiedNeighbours) {
        updatedSeats[key] = "L"
        hasChanges = true;
      }
    }
  })

  return { updatedSeats, hasChanges };
}

function p1(lines) {
  const seats = prepareSeats(lines);
  let lastSeatConfiguration = seats;
  let hasChanges = true;

  const seatGetter = (key, theSeats) => {
    const neighbours = neighbourKeys(key);
    // console.log(key, neighbours);
    const neighbourSeats = getSeats(neighbours, theSeats);
    // console.log(key, neighbourSeats);
    return neighbourSeats;
  }

  while (hasChanges) {
    const { updatedSeats, hasChanges: didChange } = apply(lastSeatConfiguration, 4, seatGetter);
    // console.log(updatedSeats);
    hasChanges = didChange;
    lastSeatConfiguration = updatedSeats;
  }
  // console.log(lastSeatConfiguration);
  const numOccupied = Object.values(lastSeatConfiguration).filter(s => s === "#").length;
  console.log("p1>", numOccupied);
}


function p2(lines) {
  const seats = prepareSeats(lines);
  let lastSeatConfiguration = seats;
  let hasChanges = true;

  const seatGetter = (key, theSeats) => {
    // console.log(key, neighbours);
    const neighbourSeats = getNearestSeats(key, theSeats);
    // console.log(key, neighbourSeats);
    return neighbourSeats;
  }

  while (hasChanges) {
    const { updatedSeats, hasChanges: didChange } = apply(lastSeatConfiguration, 5, seatGetter);
    // console.log(updatedSeats);
    hasChanges = didChange;
    lastSeatConfiguration = updatedSeats;
  }
  // console.log(lastSeatConfiguration);
  const numOccupied = Object.values(lastSeatConfiguration).filter(s => s === "#").length;
  console.log("p2>", numOccupied);
}

(async function main() {
  const lines = await aoc.processFile();
  maxRow = lines.length;
  maxCol = lines[0].length;

  p1(lines);
  p2(lines);
})();

// 6816 too high