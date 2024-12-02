const aoc = require("../../aoc");

function parseCard(data) {
  console.log("__");
  const result = [];
  data.forEach((row, r) => {
    const col = row.split(/\s+/).filter(x => x.trim()).map(i => +i);
    result.push(col);
  });
  return result;
}

function findCoordinate(board, number) {
  for (let r = 0; r < board.length; r += 1) {
    for (let c = 0; c < board[r].length; c += 1) {
      if (board[r][c] === number) {
        return { r, c };
      }
    }
  }
  return null;
}

function p1(lines) {
  const numbers = [];
  const boards = [];
  let data = [];

  lines.forEach((line, index) => {
    if (index === 0) {
      numbers.push(...lines[0].split(",").map(i => +i));
      return;
    }

    if (line === "" && data.length) {
      const card = parseCard(data, numbers);
      boards.push(card);
      data = [];
    } else if (line !== "") {
      data.push(line);
    }
  });
  const card = parseCard(data, numbers);
  boards.push(card);
  console.log(boards);

  const numRows = boards[0].length;
  const numCols = boards[0][0].length;

  // play bingo
  let winner = null;
  let lastNumber = 0;
  numbers.forEach((number, index) => {
    if (winner) { return; }
    boards.forEach(board => {
      if (winner) { return; }

      const coord = findCoordinate(board, number);
      if (coord === null) { return; }
      const {r, c} = coord;
      board[r][c] = -99;

      const rows = [];
      const cols = [];
      for (let i = 0; i < numCols; ++i) {
        rows.push(board[r][i]);
      }
      for (let i = 0; i < numRows; ++i) {
        cols.push(board[i][c]);
      }
      const hasVerticalWin = rows.every(i => i === -99);
      const hasHorizontalWin = cols.every(i => i === -99);
      const hasWin = hasVerticalWin || hasVerticalWin;
      if (hasWin) {
        winner = board;
        lastNumber = number;
        console.log(number);
      }
    });
  });

  const remainder = winner.flat().filter(i => i !== -99);
  const sum = remainder.reduce((acc, cur) => acc + cur, 0)
  console.log(sum * lastNumber);
}

(async function main() {
  const lines = await aoc.processFile();

  p1(lines);

  const numbers = [];
  const boards = [];
  let data = [];

  lines.forEach((line, index) => {
    if (index === 0) {
      numbers.push(...lines[0].split(",").map(i => +i));
      return;
    }

    if (line === "" && data.length) {
      const card = parseCard(data, numbers);
      boards.push(card);
      data = [];
    } else if (line !== "") {
      data.push(line);
    }
  });
  const card = parseCard(data, numbers);
  boards.push(card);
  // console.log(boards);

  const numRows = boards[0].length;
  const numCols = boards[0][0].length;

  // play bingo
  let winner = null;
  let lastNumber = -1;
  let playing = boards;
  numbers.forEach((number, index) => {
    console.log(number);
    if (playing.length === 0 && lastNumber === -1) {
      return;
    }
    if (playing.length === 1) {
      winner = playing[0];
    }
    const remainingBoards = playing.filter(board => {
      const coord = findCoordinate(board, number);
      if (coord === null) { return true; }
      const {r, c} = coord;
      board[r][c] = -99;

      const rows = [];
      const cols = [];
      for (let i = 0; i < numCols; ++i) {
        rows.push(board[r][i]);
      }
      for (let i = 0; i < numRows; ++i) {
        cols.push(board[i][c]);
      }
      const hasVerticalWin = rows.every(i => i === -99);
      const hasHorizontalWin = cols.every(i => i === -99);
      const hasWin = hasHorizontalWin || hasVerticalWin;
      if (hasWin) {
        return false;
      }
      return true;
    });
    playing = remainingBoards;
    if (playing.length === 0 && lastNumber === -1) {
      console.log("l", number);
      lastNumber = number;
      return;
    }
    console.log(playing.length);
  });

  console.log(winner, lastNumber);
  const remainder = winner.flat().filter(i => i !== -99);
  const sum = remainder.reduce((acc, cur) => acc + cur, 0)
  console.log(sum * lastNumber);

  // const winners = boards.filter(c => c.hasWin);
  // console.log(winners);
  // let winner = winners[0];
  // winners.forEach(c => {
  //   if (c.trace.length <= winner.trace.length) {
  //     winner = c;
  //   }
  // });
  // console.log("___");
  // console.log(winner);
  
})();
