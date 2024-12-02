const aoc = require("../../aoc");

const required = {
"byr": (i) => {
  if (i.length !== 4) { return false; }
  return (1920 <= (+i) && (+i) <= 2002);
},
"iyr": (i) => {
  if (i.length !== 4) { return false; }
  return (2010 <= (+i) && (+i) <= 2020);
},
"eyr": (i) => {
  if (i.length !== 4) { return false; }
  return (2020 <= (+i) && (+i) <= 2030);
},
"hgt": (i) => {
  if (/^\d+in$/.test(i)) {
    const [measure] = i.split("in");
    return (59 <= measure && measure <= 76);
  } else if (/^\d+cm$/.test(i)) {
    const [measure] = i.split("cm");
    return (150 <= measure && measure <= 193);
  }
  return false;
},
"hcl": (i) => {
  if (i.length !== 7) { return false; }
  return /^#[0123456789abcdef]{6}$/.test(i);
},
"ecl": (i) => {
  return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(i)
},
"pid": (i) => {
  if (i.length !== 9) { return false; }
  return /^\d{9}$/.test(i);
},
};
const optional = ["cid"];

function processPassport(data) {
  const normalised = data.join(" ");

  const fields = normalised.split(" ");
  const result = Object.keys(required).every(k => {
    return fields.some(field => {
      const [key, value] = field.split(":");
      if (k === key) {
        const a = required[k](value);
        console.log(k, value, a);
        return a;
      }
      return false;
    })
  });
  console.log(normalised, result)
  return result;
}

(async function main() {
  const lines = await aoc.processFile();

  let data = [];
  let count = 0;
  for (line of lines) {
    // console.log(line);
    if (line === "") {
      const isValid = processPassport(data);
      if (isValid) {
        count++;
      }
      data = [];
    } else {
      data.push(line);
    }
  }
  const isValid = processPassport(data);
  if (isValid) {
    count++;
  }
  console.log(count);
})();
