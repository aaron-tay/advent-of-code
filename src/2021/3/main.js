const aoc = require("../../aoc");

function p1(lines) {
  const map = {};
  const score = [];
  lines.forEach((line, index) => {
    map[index] = line.split("");
    map[index].forEach((c, idx) => {
      if (!score[idx]) score[idx] = { zero: 0, one: 0};
      if (c === "0") {
        score[idx].zero++;
      }
      if (c === "1") {
        score[idx].one++;
      }
    });
  });
  console.log(score[0]);

  const result = [];
  const negative = [];
  score.forEach(s => {
    if (s.zero > s.one) {
      result.push(0)
      negative.push(1);
    } else {
      result.push(1);
      negative.push(0);
    }
  });

  const gamma = parseInt(result.join(""), 2);
  const epsilon = parseInt(negative.join(""), 2);
  console.log(gamma, epsilon, gamma * epsilon);

  return { most: result, least: negative, score };
}

function filter(items, index, expected) {
  return items.filter(i => {
    return i[index] == expected;
  });
}

(async function main() {
  const lines = await aoc.processFile();
  const { most, least, score } = p1(lines);

  console.log(most);
  const bitArray = lines.map(line => line.split(""));
  let ogr = [...bitArray];
  let csr = [...bitArray];
  const length = lines[0].length;
  for (let i = 0; i < length; ++i) {
    if (ogr.length > 1) {
      const { most: om, least: ol, score: os } = p1(ogr.map(l => l.join("")));
      let target = om[i];
      const newOgr = filter(ogr, i, target);
      ogr = newOgr;
    }
    if (csr.length > 1) {
      const { most: cm, least: cl, score: cs } = p1(csr.map(l => l.join("")));
      let target = cl[i];
      const newCsr = filter(csr, i, target);
      csr = newCsr;
    }
    console.log(ogr);
  }
  
  console.log(ogr, csr)
  
  const gamma = parseInt(ogr[0].join(""), 2);
  const epsilon = parseInt(csr.join(""), 2);
  console.log(gamma, epsilon, gamma * epsilon);

})();
