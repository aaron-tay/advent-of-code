const aoc = require("../../aoc");

function renderNode(node, depth = 0) {
  const indent = "|".padEnd((depth+1)*2, "-");
  console.log(indent, node.id, node.value);
  if (node.lhs) {
    renderNode(node.lhs, depth + 1);
  }
  if (node.rhs) {
    renderNode(node.rhs, depth + 1);
  }
}

let nodeId = 0;
function makeNode(snailNumber, parent) {
  if (!Array.isArray(snailNumber)) {
    const id = ++nodeId;
    return {
      id,
      value: snailNumber,
      parent,
    };
  }

  const id = ++nodeId;
  return {
    id,
    lhs: makeNode(snailNumber[0], id),
    rhs: makeNode(snailNumber[1], id),
    parent: parent,
  }
}

function orderedNodes(root) {
  if (!root) { return []; }
  if (root.value) { return [root]; }

  const result = [];
  if (root.lhs) {
    const lhs = orderedNodes(root.lhs);
    result.push(...lhs);
  }
  result.push(root);
  if (root.rhs) {
    const rhs = orderedNodes(root.rhs);
    result.push(...rhs);
  }

  return result;
}

function nodeDepths(root, depth = 0, depthMap = {}) {
  if (!root) { return {}; }
  if (root.value) {
    if (!depthMap[depth]) {
      depthMap[depth] = [];
    }
    // console.log("DDD", root);
    depthMap[depth].push(root.parent);
    return;
  }

  if (root.lhs) {
    nodeDepths(root.lhs, depth + 1, depthMap);
  }
  if (root.rhs) {
    nodeDepths(root.rhs, depth + 1, depthMap);
  }

  return depthMap;
}

function explode(node, snailNumberRoot) {
  const ordered = orderedNodes(snailNumberRoot);
  // console.table(ordered);
  // console.log(">", node);
  const indexOf  = ordered.findIndex(n => n.id === node.id);

  let left = null;
  let right = null;
  if (indexOf-3 >= 0) {
    left = ordered[indexOf-3];
    // console.log("L:", node.id, indexOf, left);
    left.value += node.lhs.value;
  }
  if (indexOf+3 < ordered.length) {
    right = ordered[indexOf+3];
    // console.log("R:", node.id, indexOf, right);
    right.value += node.rhs.value;
  }
  node.value = 0;
  delete node.lhs;
  delete node.rhs;

  // find the pair in number
  // find number left of pair, left + lhs
  // find number right of pair, right + rhs
  // remove pair
  // put '0'
}

function split(node, snailNumberRoot) {
  const number = node.value;
  const lhs = Math.floor(number / 2);
  const rhs = Math.ceil(number / 2);
  // console.log(number, lhs, rhs);
  
  delete node.value;
  node.lhs = makeNode(lhs, node.id);
  node.rhs = makeNode(rhs, node.id);
}

function reduce(rootNode) {
  let didExplode = true;
  let didSplit = true;
  let cycle = 0;
  let mode = "EXPLODE";
  while ((didExplode || didSplit) || cycle < 2) {
    didExplode = false;
    didSplit = false;
    cycle++;

    const allNodes = orderedNodes(rootNode);
    const nodeMap = {};
    // console.table(allNodes);
    allNodes.forEach(n => {
      nodeMap[n.id] = n;
    });

    if (mode === "EXPLODE") {
      let depths = nodeDepths(rootNode);
      // console.table("depths");
      // console.table(depths);

      if (depths[5] && depths[5].length > 0) {
        cycle = 0;
        didExplode = true;
        const nodeId = depths[5][0];
        const node = nodeMap[nodeId];
        // console.log("explode", nodeId, depths[5], node);
        explode(node, rootNode);
      }

      if (!didExplode) {
        mode = "SPLIT";
      }

    } else {
      const node  = allNodes.find(n => n.value >= 10);
      if (node) {
        cycle = 0;
        didSplit = true;
        // console.log("split", node);
        split(node, rootNode);
        mode = "EXPLODE";
      }
    }
    // renderNode(rootNode);
  }
  return rootNode;
}

function add(lhs, rhs) {
  const node = makeNode(null, null);
  delete node.value;
  node.lhs = lhs;
  node.rhs = rhs;
  lhs.parent = node.id;
  rhs.parent = node.id;
  return node;
}

function magnitude(root) {
  if (!root) { return 0; }
  if (root.value) { return root.value; }

  let result = 0;
  if (root.lhs) {
    const lhs = magnitude(root.lhs);
    result += (lhs * 3);
  }
  if (root.rhs) {
    const rhs = magnitude(root.rhs);
    result += (rhs * 2);
  }

  return result;
}

function p1(lines) {
  const numbers = [];
  const nodes = [];
  for (line of lines) {
    const number = eval(line);
    numbers.push(number);

    const node = makeNode(number, null);
    nodes.push(node);
  }
  renderNode(nodes[0]);
  console.table(orderedNodes(nodes[0]));

  const p1Snail = nodes.reduce((acc, curr) => {
    if (acc === null) {
      return curr;
    }

    const added = add(acc, curr);
    return reduce(added);
  });
  renderNode(p1Snail);
  const p1Result = magnitude(p1Snail);
  console.log(">", p1Result);
}

(async function main() {
  const lines = await aoc.processFile();

  // p1(lines);

  const numbers = [];
  const nodes = [];
  for (line of lines) {
    const number = eval(line);
    numbers.push(number);

    const node = makeNode(number, null);
    nodes.push(node);
  }
  // renderNode(nodes[0]);
  // console.table(orderedNodes(nodes[0]));

  let highest = 0;
  let data = [];
  lines.forEach((a, idx) => {
    lines.forEach((b, idx2) => {
      if (idx === idx2) { return; }
      const numberA = eval(a);
      const nodeA = makeNode(numberA, null);
      const number = eval(b);
      const nodeB = makeNode(number, null);
      const added = add(nodeA, nodeB);
      const final = reduce(added);
      const mag = magnitude(final);
      if (mag > highest) {
        highest = mag;
        data = {
          final,
          a,
          b,
        }
      }
    });
  });
  renderNode(data.final);
  console.log(data.a, data.b);
  console.log("p2>", highest);

  // const p1Snail = nodes.reduce((acc, curr) => {
  //   if (acc === null) {
  //     return curr;
  //   }

  //   const added = add(acc, curr);
  //   return reduce(added);
  // });
  // renderNode(p1Snail);
  // const p1Result = magnitude(p1Snail);
  // console.log(">", p1Result);
})();

// 4770 too low
