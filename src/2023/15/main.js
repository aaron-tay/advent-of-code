const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const steps = lines[0].split(",");
  console.log(steps);

  const toAscii = letter => letter.charCodeAt(0);

  function theHASH(chars) {
    const letters = chars.split("");

    const result = letters.reduce((acc, letter) => {
      let curr = acc;
      const code = toAscii(letter);
      curr += code;
      curr *= 17;
      curr %= 256;
      return curr;
    }, 0);

    return result;
  }

  function p1() {
    const hashings = steps.map(chars => {
      return theHASH(chars);
    });
    console.log(hashings);
    console.log(hashings.reduce((acc, curr) => acc + curr, 0));
  }
  p1();

  function insert(list, label, value) {
    // if it exists replace
    const existing = list.find(i => i.label === label);
    if (existing) {
      existing.value = value;
    } else {
      list.push({
        label,
        value
      });
    }
  }
  function remove(list, label) {
    const index = list.findIndex(i => i.label === label);
    if (index > -1) { // only splice array when item is found
      list.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  const hashmap = new Map(); // label: []
  const hashings = steps.forEach(chars => {
    console.log(">", chars);
    const action = chars.includes("=") ? "assign" : "remove";
    if (action === "assign") {
      const [labelCode, value] = chars.split("=");
      const boxNumber = theHASH(labelCode);
      console.log(labelCode, value, boxNumber);
      if (!hashmap.has(boxNumber)) {
        hashmap.set(boxNumber, []);
      }
      const box = hashmap.get(boxNumber);
      insert(box, labelCode, +value);
    } else {
      const labelCode = chars.split("-")[0];
      const boxNumber = theHASH(labelCode);
      console.log(labelCode, boxNumber);

      const box = hashmap.get(boxNumber);
      if (box) {
        console.log("remove", box, labelCode);
        remove(box, labelCode);
      }
    }
  });
  console.log(hashmap);
  console.log("FOCUSING POWER");

  const focusingPower = []
  for ([key, value] of hashmap.entries()) {
    console.log(key, value);
    const boxScore = (+key) + 1;
    const r = value.map(({ label, value: fl }, index) => {
      const slotNumber = index+1;
      console.log(label, boxScore, fl, slotNumber);
      return fl * slotNumber * boxScore;
    });
    focusingPower.push(...r);
  }
  console.log(focusingPower);
  console.log(focusingPower.reduce((acc, curr) => acc + curr, 0));

})();
