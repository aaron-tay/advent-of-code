const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const canPlay = (round, totalCubes) => {
    const cubes = round.split(", ");
    return cubes.every(cube => {
      let [num, color] = cube.split(" ");
      num = +num;

      return num <= totalCubes[color];
    });
  };

  const canPlayGame = (rounds, totalCubes) => {
    return rounds.every(round => canPlay(round, totalCubes));
  }

  const getCubesForRound = round => {
    const cubes = round.split(", ");
    return cubes.reduce((acc, cube) => {
      let [num, color] = cube.split(" ");
      return {
        ...acc,
        [color]: +num
      }
    }, {});
  }

  const minCubesRequired = (rounds) => {
    return rounds.reduce((acc, round) => {
      const cubes = getCubesForRound(round);
      console.log(">", round, cubes);

      const highest = ["red", "green", "blue"].map(color => {
        return Math.max(acc[color] ?? 0, cubes[color] ?? 0);
      });
      console.log(highest)
      return {
        ...acc,
        "red": highest[0],
        "green": highest[1],
        "blue": highest[2]
      }
    }, {});
  }
  
  const totalCubes = {
    "red": 12,
    "green": 13,
    "blue": 14
  };

  function part1() {
    const playableGames = [];
    for (line of lines) {
      console.log(line);
  
      const game = line.split(": ");
      const rounds = game[1].split("; ");
      const isGamePlayable = canPlayGame(rounds, totalCubes);
      if (isGamePlayable) {
        const gameId = game[0].split(" ")[1];
        playableGames.push(+gameId)
      }
    }
    console.log(playableGames.reduce((acc, cur) => acc + cur, 0));
  }

  const gameScores = [];
    for (line of lines) {
      console.log(line);
  
      const game = line.split(": ");
      const rounds = game[1].split("; ");

      const cubesRequired = minCubesRequired(rounds);
      console.log(cubesRequired);
      const score = cubesRequired["red"] * cubesRequired["green"] * cubesRequired["blue"];
      gameScores.push(score);
    }
    console.log(gameScores.reduce((acc, cur) => acc + cur, 0));
})();

// pt1
// 2505

// 70265
