const aoc = require("../../aoc");

const DIRECTIONS = [
  [1, 0, "e"],
  [0, -1, "s"],
  [-1, 0, "w"],
  [0, 1, "n"],
  [1, 1, "ne"],
  [-1, -1, "sw"],
  [-1, 1, "nw"],
  [1, -1, "se"],
];
const CODES = DIRECTIONS.map(([, , d]) => d);

(async function main() {
  const lines = await aoc.processFile();

  const world = {};
  const key = (x, y) => `${x}_${y}`;
  const unkey = (keyStr) => {
    const [x, y] = keyStr.split("_");
    return { x: +x, y: +y };
  };
  const antennas = new Map();
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      world[key(x, y)] = char;
      if (char !== ".") {
        const list = antennas.get(char) ?? [];
        list.push(key(x, y));
        antennas.set(char, list);
      }
    });
  });
  const sizeX = lines[0].length;
  const sizeY = lines.length;

  console.log(world);
  console.log(antennas);

  function distance(pt1Key, pt2Key) {
    const pt1 = unkey(pt1Key);
    const pt2 = unkey(pt2Key);
    const dx = pt2.x - pt1.x;
    const dy = pt2.y - pt1.y;
    return {
      dx,
      dy,
    };
  }
  function negativeDistance(d) {
    return { dx: -d.dx, dy: -d.dy };
  }
  function ptPlusDistance(ptKey, d) {
    const { x, y } = unkey(ptKey);
    return key(x + d.dx, y + d.dy);
  }

  // get candidate antenna points
  function pt1() {
    const antinodes = new Set();
    [...antennas.entries()].forEach(([char, ptKeys]) => {
      ptKeys.forEach((ptKey) => {
        // exclude myself
        const others = antennas.get(char);
        const distances = others
          .filter((c) => c !== ptKey)
          .map((optKey) => ({
            distance: distance(ptKey, optKey),
            target: optKey,
          }));
        distances.filter((dob) => {
          const { distance: d, target } = dob;
          const nextPt = ptPlusDistance(target, d);
          // if (world[nextPt] === ".") {
          if (!!world[nextPt]) {
            // console.log(ptKey, d, nextPt);
            //ok
            antinodes.add(nextPt);
          }
          const otherPt = ptPlusDistance(ptKey, negativeDistance(d));
          // if (world[otherPt] === ".") {
          if (!!world[otherPt]) {
            // console.log(ptKey, d, otherPt);
            //ok
            antinodes.add(otherPt);
          }
        });
      });
    });
    console.log(antinodes);
    console.log(antinodes.size);
  }

  // pt2. same but distance loops till edge of world

  const antinodes = new Set();
  [...antennas.entries()].forEach(([char, ptKeys]) => {
    ptKeys.forEach((ptKey) => {
      // exclude myself
      const others = antennas.get(char);
      const distances = others
        .filter((c) => c !== ptKey)
        .map((optKey) => ({
          distance: distance(ptKey, optKey),
          target: optKey,
        }));
      distances.forEach((dob) => {
        const { distance: d, target } = dob;

        let t = ptPlusDistance(ptKey, d);
        antinodes.add(t);

        let nextPt = ptPlusDistance(target, d);
        while (!!world[nextPt]) {
          antinodes.add(nextPt);
          nextPt = ptPlusDistance(nextPt, d);
        }

        let t1 = ptPlusDistance(target, negativeDistance(d));
        antinodes.add(t1);
        let otherPt = ptPlusDistance(ptKey, negativeDistance(d));
        while (!!world[otherPt]) {
          antinodes.add(otherPt);
          otherPt = ptPlusDistance(otherPt, negativeDistance(d));
        }
      });
    });
  });
  console.log(antinodes);
  console.log(antinodes.size);
})();
