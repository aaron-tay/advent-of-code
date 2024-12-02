const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  let x = 0;
  let y = 0;
  let aim = 0;
  for (line of lines) {
    const [action, num] = line.split(" ");
    const delta = +num;

    switch (action ) {
      case "forward":
        x += delta;
        y += (delta * aim);
        break;
      case "down":
        // y += delta;
        aim += delta;
        break;
      case "up":
        // y -= delta;
        aim -= delta;
        break;
    }
  }
  console.log(x * y);
})();
