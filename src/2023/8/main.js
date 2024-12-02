const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const [dLine, gap, ...otherLines] = lines;
  const directions = dLine.split("");

  const network = {};
  for (line of otherLines) {
    console.log(line);
    // DGK = (KVQ, XHR)
    const [source, others] = line.split(" = ");
    const [left, right] = others.replace(/[()]/g, "").split(", ");
    network[source] = { 'L': left, 'R': right };
  }

  function getNextDirection(numSteps) {
    return directions[numSteps % directions.length];
  }

  console.table(network);

  function part1(startNode, targetNode) {
    let numSteps = [];
    let currentNode = startNode;
    while (currentNode !== targetNode) {
      const nextDirection = getNextDirection(numSteps);
      const nextNode = network[currentNode][nextDirection];
      // console.log(currentNode, nextDirection, nextNode);
      currentNode = nextNode;
      numSteps++;
    }
    console.log(numSteps);
  }
  // part1('AAA', 'ZZZ');

  const allANodes = Object.keys(network).filter(k => k.endsWith('A'));
  const allZNodes = Object.keys(network).filter(k => k.endsWith('Z'));

  console.log(allANodes, allZNodes);

  function part1WithLoopChecking(startNode, targetNode) {
    const visited = new Set();
    let numSteps = [];
    let currentNode = startNode;
    let isLoop = false;
    while (currentNode !== targetNode && !isLoop) {
      const nextDirection = getNextDirection(numSteps);
      const code = `${currentNode}-${nextDirection}-${numSteps%directions.length}`;
      isLoop = visited.has(code);
      // console.log(currentNode, nextDirection, numSteps, code, isLoop);
      visited.add(code);
      const nextNode = network[currentNode][nextDirection];
      currentNode = nextNode;
      numSteps++;
    }
    return {
      isLoop,
      numSteps
    }
  }

  function part2(startNode, targetNodes) {
    let numSteps = [];
    let currentNode = startNode;
    const destinations = new Set(targetNodes);
    while (!destinations.has(currentNode)) {
      const nextDirection = getNextDirection(numSteps);
      const nextNode = network[currentNode][nextDirection];
      // console.log(currentNode, nextDirection, nextNode);
      currentNode = nextNode;
      numSteps++;
    }
    console.log(numSteps);
  }

  const results = {};
  for (const aNode of allANodes) {
    for (const zNode of allZNodes) {
      console.log(aNode, zNode);
      const { isLoop, numSteps } = part1WithLoopChecking(aNode, zNode);
      const code = `${aNode}-${zNode}`;
      results[code] = { isLoop, numSteps };
    }
    // part2(aNode, allZNodes);
  }
  const r = Object.entries(results).filter(([k, v]) => !v.isLoop).map(([k, v]) => v.numSteps);
  console.table(results);
  console.log(r);
  console.log(r.reduce((a, b) => a * b, 1));
})();

[ 'XSA', 'VVA', 'TTA', 'AAA', 'NBA', 'MHA' ] [ 'PSZ', 'ZZZ', 'TKZ', 'GJZ', 'HGZ', 'RFZ' ]
// 11283670395017
// LCM :)