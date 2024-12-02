const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function purity(data, columnIdx) {
    const columnData = data.map(r => r[columnIdx]);
    // console.log(columnData);

    const types = columnData.reduce((acc, d) => {
      if (!acc[d.type]) { acc[d.type] = 0; }
      acc[d.type] += 1;
      return acc;
    }, {});

    const score = Object.keys(types).reduce((acc, t) => {
      return Math.max(types[t] / (columnData.length * 1.0), acc);
    }, 0);

    return score;
  }

  function purityScore(data) {
    const numColumns = data[0].length;
    let score = 0;
    for (let i = 0; i < numColumns; ++i) {
      const p = purity(data, i);
      score += p;
    }
    return score / (numColumns * 1.0);
  }

  function getType(cellData) {
    if (cellData && Number.isFinite(+cellData)) {
      return "NUMBER"
    }
    if (!!cellData) {
      return "STRING"
    }
    return "BLANK"
  }

  // return 0..1
  function getDTD(data, totalRows) {
    // SD of each column
    const numColumns = data[0].length;
    const numRows = data.length;
    const working = [];
    for (let i = 0; i < numColumns; ++i) {
      const p = purity(data, i);
      const sumSq = p ** 2;
      const mean = p / (numRows * 1.0);
      const variance = (sumSq / (numRows * 1.0)) - (mean ** 2);
      const stdev = Math.sqrt(variance);
      working.push({
        p,
        mean,
        stdev,
      });
    }

    // get WSD for each column
    const wsdWeights = numRows / (totalRows * 1.0);
    const weightedStdevs = working.map(({ stdev }, i) => stdev * wsdWeights);
    // console.log(weightedStdevs);
    // average WSD
    const avgWsd = weightedStdevs.reduce((sum, wsd) => sum + wsd, 0) / (numColumns * 1.0);

    const maxWsd = 1.0; // replace with actual max WSD value in your dataset
    const dtd = avgWsd / maxWsd;
    return dtd;
  }

  const data = [];
  for (line of lines) {
    console.log(line);
    data.push(line.split(",").map(p => ({
      type: getType(p),
      value: p,
    })));
  }

  const numRows = data.length;
  let highest = 0;
  let highestIdx = 0;
  for (let i = 0; i < data.length; ++i) {
    const dtd = getDTD(data.slice(i), numRows);
    console.log(i, "=", dtd);
    if (dtd > highest) {
      highest = dtd;
      highestIdx = i;
    }
  }
  console.log(highest, lines[highestIdx]);
})();
