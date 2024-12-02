const aoc = require("../../aoc");

function updateDice(dice) {
  const result = dice.map(d => {
    let m = d + 3;
    while (m > 100) {
      m -= 100;
    }
    return m;
  });
  return result;
}

function p1(lines) {
  const player1 = +(lines[0].split(": ")[1]);
  const player2 = +(lines[1].split(": ")[1]);

  const players = {
    1: {
      score: 0,
      space: player1,
      dice: [],
    },
    2: {
      score: 0,
      space: player2,
      dice: [],
    },
  };
  console.log(players);
  let turns = 0;
  let turn = 1;
  let dice = [1,2,3];
  while (players[1].score < 1000 && players[2].score < 1000) {
    // console.log("player", turn, dice, players[turn]);
    const diceTotal = dice.reduce((acc, curr) => acc + curr, 0);
    let newSpace = players[turn].space + diceTotal;
    while (newSpace > 10) {
      newSpace -= 10;
    } 
    players[turn].space = newSpace
    players[turn].score += newSpace;
    // console.log("player", turn, dice, players[turn]);
    // players[turn].dice.push([...dice]);

    turns++;
    dice = updateDice([...dice]);

    if (turn === 1) {
      turn = 2;
    } else {
      turn = 1;
    }
  }
  console.table(players);
  console.log(turns * 3)
}

(async function main() {
  const lines = await aoc.processFile();
  p1(lines);

  const player1 = +(lines[0].split(": ")[1]);
  const player2 = +(lines[1].split(": ")[1]);

  const players = {
    1: {
      score: 0,
      space: player1,
    },
    2: {
      score: 0,
      space: player2,
    },
  };
  console.log(players);
})();

// 444356092776315+341960390180808
// 786 316 482 957 123
// 617,673,396,283,947 3^32
