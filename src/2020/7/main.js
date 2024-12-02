const aoc = require("../../aoc");

function getBags(lines) {
  const result = {};

  for (line of lines) {
    const [bagInput, othersInput] = line.split("contain");
    const [bag] = bagInput.split(" bags");
    const others = othersInput.split(",").map(o => {
      return o.replace(" bags", "").replace(" bag", "").trim();
    });

    if (others.includes("no other bags")) {
      result[bag] = [];
    } else {
      result[bag] = others;
    }
  }

  return result;
}

function bagsContaining(bags, needle) {
  const result = new Set();

  Object.keys(bags).forEach(key => {
    const details = bags[key];
    const doesContain = details.some(d => {
      return d.includes(needle);
    })
    if (doesContain) {
      result.add(key);
    }
  });

  return [...result];
}

function p1(bags) {
  console.log(bags);

  const visited = new Set();
  const searchList = ["shiny gold"];
  while (searchList.length > 0) {
    const item = searchList.pop();
    visited.add(item);
    const candidates = bagsContaining(bags, item);
    const unvisitedBags = candidates.filter(b => !visited.has(b));
    searchList.push(...unvisitedBags);
  }

  console.log(visited.size - 1);
}

function countBags(normalizedBags, bag, multiplier) {
  console.log(bag, multiplier, normalizedBags[bag]);
  if (!normalizedBags[bag] || normalizedBags[bag].length === 0) {
    return 1;
  }

  let result = 0;
  // const containedBags = normalizedBags[bag];
  normalizedBags[bag].forEach(({ quantity, bag: nested }) => {
    const l = countBags(normalizedBags, nested, 1) * quantity;
    console.log(nested, quantity, l);
    result += l;
  });

  return (result * multiplier) + 1;
}

function p2(bags) {
  // key: { otherBag: quantity }
  const normalizedBags = {};
  Object.keys(bags).forEach(key => {
    const normalized = bags[key].map(detail => {
      const [d, ...b] = detail.replace(".", "").split(" ");
      const quantity = (+d) || 0;
      const bag = b.join(" ");
      return {
        quantity,
        bag,
      };
    });
    normalizedBags[key] = normalized;
  });
  console.log(normalizedBags);

  let sum = 0;
  const visited = new Set();
  const searchList = [{name: "shiny gold", multiplier: 1}];
  sum = countBags(normalizedBags, "shiny gold", 1) - 1;
  // while (searchList.length > 0) {
  //   const item = searchList.pop();
  //   visited.add(item.name);

  //   const contained = normalizedBags[item.name];
  //   // need to get the number
  //   console.log(contained);

  //   const localSum = contained.reduce((acc, n) => (acc + n.quantity), 0);

  //   sum += (multiplier * localSum);

  //   // const candidates = bagsContaining(bags, item);
  //   // const unvisitedBags = candidates.filter(b => !visited.has(b));
  //   // searchList.push(...unvisitedBags);
  // }

  console.log(sum);
}

(async function main() {
  const lines = await aoc.processFile();

  const bags = getBags(lines);
  p1(bags);
  p2(bags);

})();

// 162 high
// 161 ;)