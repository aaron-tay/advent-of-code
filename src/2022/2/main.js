const aoc = require("../../aoc");

const ROCK = "ROCK";
const SCISSORS = "SCISSORS";
const PAPER = "PAPER";

(async function main() {
  const lines = await aoc.processFile();

  const makeRule = (host, winsAgainst, losesTo, score) => {
    return {
      [host]: {
        winsAgainst: winsAgainst,
        losesTo: losesTo,
        draw: host,
        score,
      }
    }
  }

  const rules = {
    ...makeRule(ROCK, SCISSORS, PAPER, 1),
    ...makeRule(SCISSORS, PAPER, ROCK, 3),
    ...makeRule(PAPER, ROCK, SCISSORS, 2)
  }

  // rock [A, X]
  // paper [B Y]
  // scissors [C Z]
  const codes = [{
    codes: ["A", "X"],
    actual: ROCK,
  },
  {
    codes: ["B", "Y"],
    actual: PAPER,
  },
  {
    codes: ["C", "Z"],
    actual: SCISSORS,
  }]

  // 0 3 6
  const getOutcomeForRight = (left, right) => {
    const rule = rules[right];
    if (rule.winsAgainst === left) {
      return 6;
    } else if (rule.losesTo === left) {
      return 0;
    } else {
      return 3;
    }
  }

  const getScoreForChoice = (choice) => {
    return rules[choice].score;
  }

  const canonicalFromCode = (code) => {
    return codes.find(c => c.codes.includes(code)).actual;
  }

  function p1() {
    const outcomes = [];
    for (line of lines) {
      // console.log(line);
      const [left, right] = line.split(" ").map(canonicalFromCode);
      const outcomeScore = getOutcomeForRight(left, right);
      const choiceScore = getScoreForChoice(right);
      const roundScore = outcomeScore + choiceScore;
      // console.log(left, right, outcomeScore, choiceScore, roundScore);
      outcomes.push(roundScore);
    }
    const gameScore = outcomes.reduce((acc, s) => (acc + s), 0);
    console.log("p1> ", gameScore);
  }

  p1();

  const getActualRight = (left, right) => {
    if (right === "X") {
      return rules[left].winsAgainst;
    }
    if (right === "Y") {
      return rules[left].draw;
    }
    if (right === "Z") {
      return rules[left].losesTo;
    }
  }

  const outcomes = [];
  for (line of lines) {
    const [rleft, rright] = line.split(" ");
    const left = canonicalFromCode(rleft);
    const right = getActualRight(left, rright);
    console.log(left, rright, right);

    const outcomeScore = getOutcomeForRight(left, right);
    const choiceScore = getScoreForChoice(right);
    const roundScore = outcomeScore + choiceScore;
    // console.log(left, right, outcomeScore, choiceScore, roundScore);
    outcomes.push(roundScore);
  }
  const gameScore = outcomes.reduce((acc, s) => (acc + s), 0);
  console.log("p2> ", gameScore);
})();
