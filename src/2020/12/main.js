const aoc = require("../../aoc");

const DIRECTIONS = {
  N: [0, 1],
  S: [0, -1],
  E: [1, 0],
  W: [-1, 0]
};

const SIGN = {
  N: 1,
  S: -1,
  E: 1,
  W: -1,
}

const ROTATION = [90, 180, 270];

function rotateLeft(x, y) {
  return { x: -y, y: x };
}

function rotateRight(x, y) {
  return { x: y, y: -x };
}

const LEFT_SIGN = {
  N: [-1, -1, 1],
  S: [-1, -1, 1],
  E: [1, -1, -1],
  W: [1, -1, -1],
}

const RIGHT_SIGN = {
  N: [1, -1, -1],
  S: [1, -1, -1],
  E: [-1, -1, 1],
  W: [-1, -1, 1],
}

const LEFT = {
  N: ["W", "S", "E"],
  S: ["E", "N", "W"],
  E: ["N", "W", "S"],
  W: ["S", "E", "N"],
}

const RIGHT = {
  N: ["E", "S", "W"],
  S: ["W", "N", "E"],
  E: ["S", "W", "N"],
  W: ["N", "E", "S"],
}

function parse(line) {
  const regexpSize = /([NSEWLRF]{1})(\d+)/;
  const match = line.match(regexpSize);

  let action = match[1];
  let value = +match[2];

  return {action, value};
}

function p1(lines) {
  const ship = { x: 0, y: 0, dir: "E"}
  for (line of lines) {
    const { action, value } = parse(line);
    // console.log(line, action, value);

    switch (action) {
      case "F":{
        const [vx, vy] = DIRECTIONS[ship.dir];
        ship.x += (vx * value);
        ship.y += (vy * value);
        break;
      }case "N":
      case "S":
      case "E":
      case "W":{
        const [vx, vy] = DIRECTIONS[action];
        ship.x += (vx * value);
        ship.y += (vy * value);
        break;
      }case "L":{
        const index = ROTATION.indexOf(value);
        ship.dir = LEFT[ship.dir][index];
        break;
      }case "R":{
        const index = ROTATION.indexOf(value);
        ship.dir = RIGHT[ship.dir][index];
        break;
      }default: return;
    }
    // console.log(line, ship);
  }
  console.log(Math.abs(ship.x) + Math.abs(ship.y));
}

(async function main() {
  const lines = await aoc.processFile();

  p1(lines);


  const ship = { x: 0, y: 0, dir: "E"}
  const waypoint = { dx: 10, dy: 1, xDir: "E", yDir: "N", dir: "N" }
  for (line of lines) {
    const { action, value } = parse(line);
    console.log(line, action, value);

    switch (action) {
      case "F":{
        // need to figure out proper rotation of waypoint and signs
        // const [xx, xy] = DIRECTIONS[waypoint.xDir];
        // const { dx, dy } = { dx: xx * waypoint.dx, dy: xy * waypoint.dx };

        // const [yx, yy] = DIRECTIONS[waypoint.yDir];
        // const { dxx, dyy } = { dxx: yx * waypoint.dy, dyy: yy * waypoint.dy };
        // const { x, y } = { x: dx+dxx, y: dy+dyy };
        // console.log(x,y, "|", dx,dy, "|", dxx,dyy, "|", (x * value), (y * value));

        // ship.x += (x * (value * SIGN[waypoint.xDir]));
        // ship.y += (y * (value * SIGN[waypoint.yDir]));
        ship.x += (value * waypoint.dx);
        ship.y += (value * waypoint.dy);
        break;
      }case "N":
      case "S":
      case "E":
      case "W":{
        const [vx, vy] = DIRECTIONS[action];
        waypoint.dx += (vx * value);
        waypoint.dy += (vy * value);
        break;
      }case "L":{
        const index = ROTATION.indexOf(value);
        let nx = waypoint.dx;
        let ny = waypoint.dy;
        for (let i = 0; i <= index; ++i) {
          const { x, y } = rotateLeft(nx, ny);
          nx = x;
          ny = y;
        }
        waypoint.dx = nx;
        waypoint.dy = ny;

        // waypoint.dx = Math.abs(waypoint.dx) * LEFT_SIGN["N"][index];
        // waypoint.dy = Math.abs(waypoint.dy) * LEFT_SIGN["N"][index];
        // const ndx = waypoint.dy * LEFT_SIGN[waypoint.xDir][index];
        // const ndy = waypoint.dx * LEFT_SIGN[waypoint.yDir][index];
        // waypoint.dx = ndx;
        // waypoint.dy = ndy;
        // waypoint.xDir = LEFT[waypoint.xDir][index];
        // waypoint.yDir = LEFT[waypoint.yDir][index];
        break;
      }case "R":{
        const index = ROTATION.indexOf(value);
        let nx = waypoint.dx;
        let ny = waypoint.dy;
        for (let i = 0; i <= index; ++i) {
          // console.log(nx, ny);
          const { x, y } = rotateRight(nx, ny);
          // console.log(x, y);
          nx = x;
          ny = y;
        }
        waypoint.dx = nx;
        waypoint.dy = ny;
        // waypoint.dx = Math.abs(waypoint.dx) * RIGHT_SIGN["N"][index];
        // waypoint.dy = Math.abs(waypoint.dy) * RIGHT_SIGN["N"][index];
        // waypoint.xDir = RIGHT[waypoint.xDir][index];
        // waypoint.yDir = RIGHT[waypoint.yDir][index];
        // const ndx = waypoint.dy * RIGHT_SIGN[waypoint.xDir][index];
        // const ndy = waypoint.dx * RIGHT_SIGN[waypoint.yDir][index];
        // waypoint.dx = ndx;
        // waypoint.dy = ndy;
        break;
      }default: return;
    }
    console.log(line, ship, waypoint);
  }
  console.log(Math.abs(ship.x) + Math.abs(ship.y));
})();

// 5958 low
// 13743 low
// 180733 high
// 71475 no