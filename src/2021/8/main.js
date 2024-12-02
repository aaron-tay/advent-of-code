const aoc = require("../../aoc");

const numbers = {
  1: ['c','f'],
  4: ['b','c','d','f'],
  7: ['a', 'c','f'],
  8: ['a', 'b','c','d', 'e','f','g'],
}

const allNumbers = {
  0: ['a', 'b','c','e','f','g'],
  1: ['c','f'],
  2: ['a', 'c','d','e','g'],
  3: ['a', 'c','d','f','g'],
  4: ['b','c','d','f'],
  5: ['a', 'b','d','f','g'],
  6: ['a', 'b','d','e','f','g'],
  7: ['a', 'c','f'],
  8: ['a', 'b','c','d', 'e','f','g'],
  9: ['a', 'b','c','d','f','g'],
};

function p1(lines) {
  let sum = 0;
  for (line of lines) {
    console.log(line);
    const [patterns, output] = line.split(" | ");
    const values = output.split(" ");

    const sortedValues = values.map(v => {
      // console.log(v);
      const c = [...v.split("")];
      c.sort()
      return c.join('');
    });
    const count = sortedValues.filter(v => {
      return Object.values(numbers).some(n => n.length === v.length)
    });
    console.log(count);
    sum += count.length;
  }
  console.log(sum);
}

function setDifference(arr1, arr2) {
  const arrSet = new Set([...arr2]);
  return [...new Set([...arr1].filter(x => !arrSet.has(x)))];
}

function rearrange(numberMap, letterMappings) {
  const result = {};
  Object.keys(numberMap).forEach((key) => {
    result[key] = numberMap[key].map((v, index) => letterMappings[v]);
  });

  return result;
}

function findSix(digits, patterns) {
  // 6 is 8-1 and then we can figure out c/f
  const abdeg = setDifference(digits[8], digits[1]);
  // find a digit with all these
  const six = patterns.filter(p => {
    const v = new Set(p.split(""));
    return p.length === 6 && abdeg.every(c => v.has(c));
  });
  console.log("6", six);
  return six[0];
}

function findNine(digits, patterns, wires) {
  const [aWire, bWire, cWire, dWire, unknownE, fWire, unknownG] = wires;
  // 6 is 8-1 and then we can figure out c/f
  // const eg = setDifference(digits[8], [aWire, bWire, cWire, dWire, fWire]);
  const abcdf = [aWire, bWire, cWire, dWire, fWire];
  // find a digit with all these
  const nine = patterns.filter(p => {
    const v = new Set(p.split(""));
    return p.length === 6 && abcdf.every(c => v.has(c));
  });
  console.log("9", nine);
  return nine[0];
}

(async function main() {
  const lines = await aoc.processFile();

  // p1(lines);

  let sum = 0;
  for (line of lines) {
    console.log(line);
    const [patterns, output] = line.split(" | ");
    const values = patterns.split(" ");

    const sorted = values.map(v => {
      const c = [...v.split("")];
      c.sort()
      return c.join('');
    });

    // let's get 1,4,7,8
    const digits = {};
    const mappedDigits = sorted.map(v => {
      let key = null;
      Object.keys(numbers).forEach((k, idx) => {
        if (key) { return; }
        
        const n = numbers[k];
        if (n.length === v.length) {
          key = k;
        };
      });
      if (key) {
        digits[key] = v;
      }
    });
    const six = findSix(digits, sorted);
    digits[6] = six;
    const cWire = setDifference(digits[8], digits[6])[0];
    const fWire = setDifference(digits[1], [cWire])[0];
    console.log("C", cWire, fWire);
    const aWire = setDifference(digits[7], digits[1])[0];
    console.log("A", cWire, fWire, aWire);
    const two = sorted.filter(v => {
      return !v.includes(fWire);
    })[0];
    const bWire = setDifference(setDifference(digits[8], two), [fWire])[0];
    console.log("B", cWire, fWire, aWire, bWire);
    const dWire = setDifference(digits[4], [bWire, cWire, fWire])[0];
    console.log("D", cWire, fWire, aWire, bWire, dWire);

    const nine = findNine(digits, sorted, [aWire, bWire, cWire, dWire, null, fWire, null]);
    digits[9] = nine;
    const eWire = setDifference(digits[8], digits[9])[0];

    console.log("E", cWire, fWire, aWire, bWire, dWire, eWire);
    const gWire = setDifference(setDifference(digits[8], digits[4]), [aWire, eWire])[0];
    console.log("G", cWire, fWire, aWire, bWire, dWire, eWire, gWire);
    const panel = {
      a: aWire,
      b: bWire,
      c: cWire,
      d: dWire,
      e: eWire,
      f: fWire,
      g: gWire,
    };

    const mappings = {};
    Object.keys(allNumbers).forEach((key) => {
      mappings[key] = allNumbers[key];
    });
    console.log(mappings);
    const rearranged = rearrange(mappings, panel);
    console.log(rearranged);

    const inverse = {};
    Object.keys(rearranged).forEach(key => {
      const num = key;
      const newKey = rearranged[key].sort().join("");
      inverse[newKey] = num;
    });
    console.log("I", inverse);

    console.log(sorted);
    console.log(sorted.map(s => inverse[s]));

    const outputValues = output.split(" ");
    const sortedValues = outputValues.map(v => {
      const c = [...v.split("")];
      c.sort()
      return c.join('');
    });
    console.log(sortedValues);
    console.log(sortedValues.map(s => inverse[s]));
    const outputNumber = sortedValues.map(s => inverse[s]).join("");
    sum += (+outputNumber);
  }

  console.log(sum);

})();
