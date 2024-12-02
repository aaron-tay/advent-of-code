const aoc = require("../../aoc");

function isSmallCave(caveId) {
  return (/^[a-z]*$/).test(caveId);
}

let p1count = 0;
function p1search(source, destination, caves, isVisited, path) {
  // console.log(path);
  if (isSmallCave(source)) {
    isVisited.add(source);
  }

  if (source === destination) {
    p1count++;
    return [...path, destination];
  }

  const links = caves[source] || [];
  const result = links.map(cave => {
    if (isVisited.has(cave)) {
      return;
    }
    const newVisited = new Set([...isVisited]);
    const trace = p1search(cave, destination, caves, newVisited, [...path, source]);
    // console.log("trace", trace);
    return trace;
  });

  return result.filter(r => r && r.length > 0);
}


let count = 0;
function search(source, destination, caves, isVisited, specialVisit, path) {
  // console.log(path);
  if (isSmallCave(source)) {
    isVisited.add(source);
  }

  if (source === destination) {
    // console.log(path, destination);
    count++;
    return [...path, destination];
  }

  const links = caves[source] || [];
  const result = links.map(cave => {
    const newSpecial = new Set([...specialVisit]);
    if (isVisited.has(cave)) {
      if (specialVisit.size === 0 && (cave !== "start" && cave !== "end")) {
        newSpecial.add(cave);
      } else {
        return;
      }
    }
    const newVisited = new Set([...isVisited]);
    const trace = search(cave, destination, caves, newVisited, newSpecial, [...path, source]);
    // console.log("trace", trace);
    return trace;
  });

  return result.filter(r => r && r.length > 0);
}

(async function main() {
  const lines = await aoc.processFile();

  const caves = {}; //source:dest
  for (line of lines) {
    console.log(line);
    const [source, destination] = line.split("-");
    if (!caves[source]) { caves[source] = []; }
    caves[source].push(destination);
    if (!caves[destination]) { caves[destination] = []; }
    caves[destination].push(source);
  }
  console.table(caves);

  p1search("start", "end", caves, new Set(), []);
  console.log(">", p1count);

  const isVisited = new Set();
  const specialVisit = new Set();
  const result = search("start", "end", caves, isVisited, specialVisit, []);
  console.log(">", count);

})();
