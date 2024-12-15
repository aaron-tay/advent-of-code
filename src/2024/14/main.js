const aoc = require("../../aoc");

const DIRECTIONS = [
  [1, 0, "e"],
  [0, -1, "s"],
  [-1, 0, "w"],
  [0, 1, "n"],
  // [1, 1, "ne"],
  // [-1, -1, "sw"],
  // [-1, 1, "nw"],
  // [1, -1, "se"],
];
const CODES = DIRECTIONS.map(([, , d]) => d);
const width = 101;
const height = 103;
(async function main() {
  const lines = await aoc.processFile();

  const world = {};
  const key = (x, y) => `${x}_${y}`;
  const unkey = (keyStr) => {
    const [x, y] = keyStr.split("_");
    return { x: +x, y: +y };
  };

  function move(robot) {
    const x = (width + (robot.x + robot.dx)) % width;
    const y = (height + (robot.y + robot.dy)) % height;
    return {
      ...robot,
      x,
      y,
    };
  }

  // p=31,100 v=-36,-71
  const robots = lines.map((line, idx) => {
    const [pLine, vLine] = line.split(" ");
    const [x, y] = pLine.split("=")[1].split(",").map(Number);
    const [dx, dy] = vLine.split("=")[1].split(",").map(Number);
    return {
      id: `r${idx}`,
      x,
      y,
      dx,
      dy,
    };
  });
  console.log(robots);

  function pt1(robots) {
    let update = robots;
    for (let i = 0; i < 100; ++i) {
      const newRobots = update.map((robot) => {
        return move(robot);
      });
      update = newRobots;
    }
    return update;
  }
  const r1 = pt1(robots);
  console.log(r1);
  function scorePt1(r1) {
    const midX = width / 2;
    const midY = height / 2;

    const byQuads = r1.reduce((acc, robot) => {
      if (robot.x < Math.floor(midX) && robot.y < Math.floor(midY)) {
        acc["1"] ??= [];
        acc["1"].push(robot);
      }
      if (robot.x > Math.floor(midX) && robot.y < Math.floor(midY)) {
        acc["2"] ??= [];
        acc["2"].push(robot);
      }
      if (robot.x < Math.floor(midX) && robot.y > Math.floor(midY)) {
        acc["3"] ??= [];
        acc["3"].push(robot);
      }
      if (robot.x > Math.floor(midX) && robot.y > Math.floor(midY)) {
        acc["4"] ??= [];
        acc["4"].push(robot);
      }
      return acc;
    }, {});
    console.log(byQuads);

    return Object.values(byQuads).reduce((acc, c) => acc * c.length, 1);
  }
  // const score1 = scorePt1(r1);
  // console.log(score1);

  function render(robots) {
    const robotSet = new Set(robots.map((r) => key(r.x, r.y)));

    for (let y = 0; y < height; ++y) {
      const line = [];
      for (let x = 0; x < width; ++x) {
        const loc = key(x, y);
        if (robotSet.has(loc)) {
          line.push("*");
        } else {
          line.push(".");
        }
      }
      console.log(line.join(""));
    }
  }

  function pt2(robots) {
    let update = robots;
    for (let i = 0; i < 1000000; ++i) {
      const newRobots = update.map((robot) => {
        return move(robot);
      });
      update = newRobots;
      if (i % 101 === 1) {
        console.error(i);
        console.log(`${i} ---\n\n`);
        render(newRobots);
      }
    }
    return update;
  }
  pt2(robots);
})();

// 101790000 too low
// 230461440 :)

// 6667 too low?!
// 6668
