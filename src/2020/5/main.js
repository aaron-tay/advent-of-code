const aoc = require("../../aoc");

// binary
// FB = 01
// LR = 01
(async function main() {
  const lines = await aoc.processFile();

  let highest = 0;
  const seatIds = [];
  for (line of lines) {
    const row = line.substr(0, 7);
    const col = line.substr(7, 11);
    const rowBinary = row.replace(/B/g, "1").replace(/F/g, "0");
    const colBinary = col.replace(/R/g, "1").replace(/L/g, "0");
    
    const rowNum = parseInt(rowBinary, 2);
    const colNum = parseInt(colBinary, 2);

    console.log(line, row, col, rowBinary, colBinary, rowNum, colNum);
    const seatId = ((rowNum * 8) + colNum);
    seatIds.push(seatId);
    if (seatId > highest) {
      highest = seatId;
      console.log(highest);
    }
  }
  console.log("> ", highest);

  seatIds.sort((a,b) => a - b);
  console.table(seatIds);
  seatIds.forEach((id, idx) => {
    if (id-8 !== idx) {
      console.log(id);
    }
  })
})();

// 686
