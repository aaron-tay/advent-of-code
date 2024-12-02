const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function getFuel(mass) {
    const div3 = mass / 3.0;
    const fuel = Math.floor(div3) - 2;
    return fuel;
  }

  const lookup = {};
  function recursive(mass) {
    if (lookup[mass]) {
      return lookup[mass];
    }

    const fuel = getFuel(mass);
    if (fuel <= 0) {
      return 0;
    }

    const total = fuel + recursive(fuel);
    lookup[mass] = total;
    return total;
  }

  const f = [];
  const r = [];
  for (line of lines) {
    console.log(line);
    const mass = +line;
    const fuel = getFuel(mass);
    const rFuel = recursive(mass);
    console.log(fuel, rFuel );
    f.push(fuel);
    r.push(rFuel);
  }
  console.log(f.reduce((a, b) => a + b, 0));
  console.log(r.reduce((a, b) => a + b, 0));

})();

// part 1 3239503
// part 2 4856390