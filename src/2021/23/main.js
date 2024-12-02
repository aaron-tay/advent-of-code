const aoc = require("../../aoc");

function makeKey({r,c}) {
  return `${r}_${c}`
}
function decodeKey(key) {
  return key.split("_").map(i => +i);
}

function neighbours(critter, slots, world) {
  
}

(async function main() {
  const lines = await aoc.processFile();

  const world = [];
  const critters = {};
  lines.forEach((line, r) => {
    const chars = line.split("");
    const row = [];
    chars.forEach((char, c) => {
      row.push(char);
      if (!critters[char]) { critters[char] = []; }
      critters[char].push(makeKey({r,c}));
    });
    world.push(row);
  });
  console.table(world);

  const slots = {
    '1_1': ".",
    '1_2': ".",
    '1_4': ".",
    '1_6': ".",
    '1_8': ".",
    '1_10': ".",
    '1_11': ".",
  };
  console.table(critters);

})();

// 15762 lol not it
