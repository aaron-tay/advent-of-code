const aoc = require("../../aoc");

const DIRECTIONS = {
  N: [0, 1],
  S: [0, -1],
  E: [1, 0],
  W: [-1, 0]
};

function neighbours2(source, outsideCaveBounds) {
  const result = [];
  Object.values(DIRECTIONS).forEach(([dx,dy]) => {
    const x = source.x + dx;
    const y = source.y + dy;
    if (outsideCaveBounds({x,y})) { return; }
    result.push({x, y});
  });
  return result;
}

function neighbours(source, caves) {
  const result = [];
  Object.values(DIRECTIONS).forEach(([dx,dy]) => {
    const x = source.x + dx;
    const y = source.y + dy;
    if (x < 0 || y < 0 || x >= caves.length || y >= caves.length) { return; }
    result.push({x, y});
  });
  return result;
}

function asString(coordinate) {
  return `${coordinate.x}_${coordinate.y}`;
}

function p1(start, goal, caves) {
  // from the goal, track backwards
  const memo = {};
  memo[asString(goal)] = 0;
  const openList = [goal];
  const visited = new Set();
  const openSet = new Set();

  while (openList.length > 0) {
    const candidate = openList.shift();
    const candidateKey = asString(candidate);
    openSet.delete(candidateKey);
    if (visited.has(candidateKey)) {
      continue;
    }
    visited.add(candidateKey);
  
    const nearby = neighbours(candidate, caves);
    nearby.forEach(node => {
      const nodeKey = asString(node);
      const prior = memo[nodeKey] || Infinity;
      const riskLevel = caves[node.y][node.x];
      memo[nodeKey] = Math.min(prior,  memo[candidateKey] + riskLevel);
      openList.push(node);
      openSet.add(nodeKey);
    });
  }
  const remap = caves.map(r => r.map(i => i));
  Object.keys(memo).forEach(key => {
    const [x,y] = key.split("_");
    remap[y][x] = memo[key];
  });
  // console.table(remap);
  return remap;
}


function p2(start, goal, caves) {
  const getCaveLoc = ({x, y}) => {
    const xTile = Math.floor(x / caves[0].length);
    const yTile = Math.floor(y / caves.length);
    const tx = x % caves[0].length;
    const ty = y % caves.length;

    const original = caves[ty][tx];

    let sum = (original + xTile + yTile);
    // console.log({x, y}, {xTile, yTile}, {tx, ty}, original, sum);
    while (sum > 9) {
      sum -= 9;
    }
    return sum;
  };
  const outsideCaveBoundx = ({x, y}) => {
    const gEndX = (caves[0].length*5);
    const gEndY = (caves.length*5);
    return (x < 0 || y < 0) || (
      x >= gEndX || y >= gEndY
    )
  };

  console.log(goal, getCaveLoc({x:0,y:0}));

  // from the goal, track backwards
  const memo = {};
  memo[asString(goal)] = {
    parent: null,
    score: getCaveLoc(goal),
  };
  const openList = [goal];
  const visited = new Set();
  const openSet = new Set();

  while (openList.length > 0) {
    const candidate = openList.shift();
    const candidateKey = asString(candidate);
    openSet.delete(candidateKey);
    if (visited.has(candidateKey)) {
      continue;
    }
    visited.add(candidateKey);

    const nearby = neighbours2(candidate, outsideCaveBoundx);
    nearby.forEach(node => {
      const nodeKey = asString(node);
      const prior = memo[nodeKey] || {parent: null, score: Infinity};
      const riskLevel = getCaveLoc(node);
      if (memo[candidateKey].score + riskLevel < prior.score) {
        const newScore = memo[candidateKey].score + riskLevel;
        if (!memo[nodeKey]) { memo[nodeKey] = {}; }
        memo[nodeKey].score = newScore;
        memo[nodeKey].parent = candidate;
      }
      openList.push(node);
      openSet.add(nodeKey);
    });
  }
  memo[asString(start)].score -= getCaveLoc(start);

  // console.table(memo);
  const remap = [];
  const gEndX = (caves[0].length*5);
  const gEndY = (caves.length*5);
  for (let r = 0; r < gEndY; ++r) {
    remap[r] = [];
    for (let c = 0; c < gEndX; ++c) {
      remap[r].push(null);
    }
  }
  Object.keys(memo).forEach(key => {
    const [x,y] = key.split("_");
    remap[y][x] = memo[key].score;
  });
  // console.table(remap);
  const t = trace2(memo, start, getCaveLoc);
  console.log(t);
  render(getCaveLoc, remap, t);
  renderScore(getCaveLoc, remap, t);
  return remap;
}

function render(getCaveLoc, remap, trace) {
  const traceMap = {};
  trace.forEach(t => {
    traceMap[asString(t.parent)] = t;
  });

  const table = [];
  for (let r = 0; r < remap.length; ++r) {
    table[r] = [];
    for (let c = 0; c < remap[r].length; ++c) {
      const loc = {x:c,y:r};
      const key = asString(loc);
      // const num = caves[r][c];
      // const num = memo[key].score;
      const num = getCaveLoc(loc);
      if (traceMap[key]) {
        table[r].push(num);
      } else {
        table[r].push(".");
      }
    }
  }
  console.table(table);
}

function renderScore(getCaveLoc, remap, trace) {
  const traceMap = {};
  trace.forEach(t => {
    traceMap[asString(t.parent)] = t;
  });

  const table = [];
  for (let r = 0; r < remap.length; ++r) {
    table[r] = [];
    for (let c = 0; c < remap[r].length; ++c) {
      const loc = {x:c,y:r};
      const key = asString(loc);
      const num = remap[r][c];
      if (traceMap[key]) {
        table[r].push(`.`);
      } else {
        table[r].push(num);
      }
    }
  }
  console.table(table);
}

function trace2(memo, end, getCaveLoc) {
  const result = [];
  let curr = memo[asString(end)];
  console.log(curr, end);
  let sum = getCaveLoc(end);
  while (curr.parent) {
    result.push(curr);
    curr = memo[asString(curr.parent)];
    if (curr.parent != null) {
      sum += getCaveLoc(curr.parent);
    }
  }
  console.log(sum);
  return result.reverse();
}

let shortestDistanceNode = (distances, visited) => {
  // create a default value for shortest
	let shortest = null;
	
  	// for each node in the distances object
	for (let node in distances) {
    	// if no node has been assigned to shortest yet
  		// or if the current node's distance is smaller than the current shortest
		let currentIsShortest =
			shortest === null || distances[node] < distances[shortest];
        	
	  	// and if the current node is in the unvisited set
		if (currentIsShortest && !visited.includes(node)) {
            // update shortest to be the current node
			shortest = node;
		}
	}
	return shortest;
};

let findShortestPath = (caves, startNode, endNode) => {
  const getCaveLoc = ({x, y}) => {
    const xTile = Math.floor(x / caves[0].length);
    const yTile = Math.floor(y / caves.length);
    const tx = x % caves[0].length;
    const ty = y % caves.length;

    const original = caves[ty][tx];

    let sum = (original + xTile + yTile);
    // console.log({x, y}, {xTile, yTile}, {tx, ty}, original, sum);
    while (sum > 9) {
      sum -= 9;
    }
    return sum;
  };
  const outsideCaveBoundx = ({x, y}) => {
    const gEndX = (caves[0].length*5);
    const gEndY = (caves.length*5);
    return (x < 0 || y < 0) || (
      x >= gEndX || y >= gEndY
    )
  };
 
  // track distances from the start node using a hash object
    let distances = {};
  distances[endNode] = "Infinity";
  distances = Object.assign(distances, graph[startNode]);
 // track paths using a hash object
  let parents = { endNode: null };
  for (let child in graph[startNode]) {
   parents[child] = startNode;
  }
   
  // collect visited nodes
    let visited = [];
 // find the nearest node
    let node = shortestDistanceNode(distances, visited);
  
  // for that node:
  while (node) {
  // find its distance from the start node & its child nodes
   let distance = distances[node];
   let children = graph[node]; 
       
  // for each of those child nodes:
       for (let child in children) {
   
   // make sure each child node is not the start node
         if (String(child) === String(startNode)) {
           continue;
        } else {
           // save the distance from the start node to the child node
           let newdistance = distance + children[child];
 // if there's no recorded distance from the start node to the child node in the distances object
 // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
           if (!distances[child] || distances[child] > newdistance) {
 // save the distance to the object
      distances[child] = newdistance;
 // record the path
      parents[child] = node;
     } 
          }
        }  
       // move the current node to the visited set
       visited.push(node);
 // move to the nearest neighbor node
       node = shortestDistanceNode(distances, visited);
     }
   
  // using the stored paths from start node to end node
  // record the shortest path
  let shortestPath = [endNode];
  let parent = parents[endNode];
  while (parent) {
   shortestPath.push(parent);
   parent = parents[parent];
  }
  shortestPath.reverse();
   
  //this is the shortest path
  let results = {
   distance: distances[endNode],
   path: shortestPath,
  };
  // return the shortest path & the end node's distance from the start node
    return results;
 };

(async function main() {
  const lines = await aoc.processFile();

  const caves = lines.map((line, y) => {
    return line.split("").map(i => +i);
  });
  
  const endX = lines[0].length-1;
  const endY = lines.length-1;
  const start = {x:0,y:0};
  const end = {x:endX, y:endY};

  const result = p1(end, start, caves);
  console.log(result[endY][endX]);

  const gEndX = (lines[0].length*5) - 1;
  const gEndY = (lines.length*5) - 1;
  const giantEnd = {x:gEndX, y:gEndY};
  console.log(giantEnd);
  const r2 = p2(start, giantEnd, caves);
  console.log(r2[0][0]);

  // const getCaveLoc = ({x, y}) => {
  //   const xTile = Math.floor(x / caves[0].length);
  //   const yTile = Math.floor(y / caves.length);
  //   const tx = x % caves[0].length;
  //   const ty = y % caves.length;

  //   const original = caves[ty][tx];

  //   let sum = (original + xTile + yTile);
  //   // console.log({x, y}, {xTile, yTile}, {tx, ty}, original, sum);
  //   while (sum > 9) {
  //     sum -= 9;
  //   }
  //   return sum;
  // };

  // const remap = [];
  // const gGEndX = (caves[0].length*5);
  // const gGEndY = (caves.length*5);
  // for (let r = 0; r < gGEndY; ++r) {
  //   remap[r] = [];
  //   for (let c = 0; c < gGEndX; ++c) {
  //     remap[r].push(getCaveLoc({x:r, y:c}));
  //   }
  // }
  // // console.table(remap);
  // const result2 = p1(giantEnd, start, remap);
  // console.log(result2[gEndY][gEndX]);

  const fsp = findShortestPath(graph, startNode, endNode);

})();

// don't know why small scale works but large doesn't for the actual input...

// 2992 too low
// 2993 too low
// 2994 nope
// 2995 nope
// 2996 nope
// 2997 nope
// 2998 yay
// 2999 nope
// 3000 nope
// 3001 too high
