const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  // console.log(/[\d]/.test('1'));
  // console.log(/[\d]/.test('.'));
  // console.log(/[\d]/.test('#'));

  // return;

  const isAdjacentToSymbol = (x, y, grid) => {
    const adjacent = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
      [x - 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y - 1],
      [x + 1, y + 1],
    ];
    for (const [x, y] of adjacent) {
      if (grid?.[x]?.[y] && /[^\d|\.]/.test(grid?.[x]?.[y])) {
        return true;
      }
    }
    return false;
  }

  const isAdjacentToNumber = (x, y, grid) => {
    const adjacent = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
      [x - 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y - 1],
      [x + 1, y + 1],
    ];
    for (const [x, y] of adjacent) {
      if (grid?.[x]?.[y] && /[\d]/.test(grid[x][y])) {
        return true;
      }
    }
    return false;
  };

  const getAdjacentNumbers = (x, y, grid) => {
    const adjacent = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
      [x - 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y - 1],
      [x + 1, y + 1],
    ];
    return adjacent.map(([x, y]) => {
      if (grid?.[x]?.[y]?.char && /[\d]/.test(grid[x][y].char)) {
        return grid[x][y].id;
      }
      return undefined;
    }).filter(c => c !== undefined);
  }

  const debugGrid = (grid) => {
    const debugRow = (row) => {
      const v = row.map(i => {
        if (!i) { return "."; }
        if (i.isNumber) { return i.id; }
        if (i.isSymbol) { return "X"; }
      });
      return rowString = v.join("");
    }

    const debugged = grid.map(debugRow);
    debugged.forEach(c => console.log(c));
  }


  let globalId = 0;
  const idToNumber = {};
  const grid = []; // ID or isSymbol
  let rowIdx = 0;
  const symbolLocations = [];
  for (line of lines) {
    grid.push(line.split("").map(c => null));

    console.log(line);
    let buffer = [];
    line.split("").forEach((char, colIdx) => {
      if (/[^\d|\.]/.test(char)) {
        if (buffer.length > 0) {
          const number = +buffer.join("");
          if (number) {
            const id = globalId;
            console.log("fullnumber", id, number);
            idToNumber[id] = number;
            globalId++;
          }
          buffer = [];
        }
        console.log("symbol", char);
        grid[rowIdx][colIdx] = {
          isSymbol: true,
          char,
        };
        symbolLocations.push([rowIdx, colIdx]);
      } else if (/\d/.test(char)) {
        const id = globalId;
        grid[rowIdx][colIdx] = {
          id,
          isNumber: true,
          char
        };
        buffer.push(char);
        console.log("number", char, id);
      } else if (buffer.length > 0) {
        const number = +buffer.join("");
        if (number) {
          const id = globalId;
          console.log("fullnumber", id, number);
          idToNumber[id] = number;
          globalId++;
        }
        buffer = [];
      }
    });
    if (buffer.length > 0) {
      const number = +buffer.join("");
      if (number) {
        const id = globalId;
        console.log("fullnumber", id, number);
        idToNumber[id] = number;
        globalId++;
      }
      buffer = [];
    }
    buffer = [];
    ++rowIdx;
  }
  console.log(grid);
  console.table(idToNumber);

  // debugGrid(grid);
  // return;'
  function part1() {
    const numberIds = symbolLocations.flatMap(([x, y]) => {
      const adjacent = getAdjacentNumbers(x, y, grid)
      console.log("adjacent", [x,y], adjacent);
      return adjacent;
    }).filter(c => c !== undefined);
    const unique = new Set(numberIds);
    console.log(unique);
  
    const uniqueNumbers = Array.from(unique).map(id => idToNumber[id]);
    console.log(uniqueNumbers.reduce((a, b) => a + b, 0));
  }

  const gearRatio = symbolLocations.flatMap(([x, y]) => {
    const adjacent = getAdjacentNumbers(x, y, grid)
    console.log("adjacent", [x,y], adjacent);

    const unique = [...new Set(adjacent)];
    if (unique.length === 2) {
      return idToNumber[unique[0]] * idToNumber[unique[1]];
    }
    return undefined;
  }).filter(c => c !== undefined);
  console.log(gearRatio.reduce((a, b) => a + b, 0));
})();

// 2795403 wrong :/ 
// case missed was numbers ending on line end
// 2797241 wrong :/
// case which was missed was 111#111#111 (i.e symbol between numbers)
// 540131

// 86879020
