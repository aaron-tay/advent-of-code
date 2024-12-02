const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function fromLoc(loc) {
    return loc.split(",").map(Number);
  }
  function toLoc(x, y) {
    return `${x},${y}`;
  }

  function pt1() {
    const world = {};
    const emptyRows = [];
    const emptyColumns = [];
    for (y = 0; y < lines.length; y++) {
      let rowHasGalaxy = false;
      const row = lines[y].split("");
      for (x = 0; x < row.length; x++) {
        const char = row[x];
        const isGalaxy = char === "#";
        rowHasGalaxy = rowHasGalaxy || isGalaxy;
      }
      if (!rowHasGalaxy) {
        emptyRows.push(y);
      }
    }
  
    for (x = 0; x < lines[0].length; x++) {
      let columnHasGalaxy = false;
      for (y = 0; y < lines.length; y++) {
        const char = lines[y].split("")[x];
        const isGalaxy = char === "#";
        columnHasGalaxy = columnHasGalaxy || isGalaxy;
      }
      if (!columnHasGalaxy) {
        emptyColumns.push(x);
      }
    }
  
    console.log(emptyRows, emptyColumns);
  
    function insertEmptyRowAfter(y, lines) {
      const row = lines[y].split("");
      row.splice(emptyColumns[0], 0, ".");
      lines.splice(y + 1, 0, row.join(""));
    }
    function insertEmptyColumnAfter(x, lines) {
      lines.forEach((line, y) => {
        const row = line.split("");
        row.splice(x + 1, 0, ".");
        lines[y] = row.join("");
      });
    }
    function insertNumEmptyRowsAfter(y, lines, num) {
      for (let i = 0; i < num; i++) {
        insertEmptyRowAfter(y, lines);
      }
    }
    function insertNumEmptyColumnsAfter(x, lines, num) {
      for (let i = 0; i < num; i++) {
        insertEmptyColumnAfter(x, lines);
      }
    }
  
    const rer = emptyRows;
    rer.reverse();
    rer.forEach((y) => {
      insertNumEmptyRowsAfter(y, lines, 1);
    });
    const rec = emptyColumns;
    rec.reverse();
    rec.forEach((x) => {
      insertNumEmptyColumnsAfter(x, lines, 1);
    });
    
    const galaxies = [];
    lines.forEach((line, y) => {
      line.split("").forEach((char, x) => {
        const loc = toLoc(x, y);
        const isGalaxy = char === "#";
        world[loc] = {
          x,y,
          loc,
          isGalaxy
        };
  
        if (isGalaxy) {
          galaxies.push(loc);
        }
      });
    });
    console.table(world);
    console.log(galaxies);
  
    function manthattenDistance(loc1, loc2) {
      const [x1, y1] = fromLoc(loc1);
      const [x2, y2] = fromLoc(loc2);
      return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
  
    const galaxyPairs = new Map(); // loc1, loc2 -> distance
    for (let i = 0; i < galaxies.length; i++) {
      const loc1 = galaxies[i];
      for (let j = i + 1; j < galaxies.length; j++) {
        const loc2 = galaxies[j];
        const key = [loc1, loc2].toSorted().join("_");
        const distance = manthattenDistance(loc1, loc2);
        
        const existing = galaxyPairs.get(key) ?? Infinity;
        const best = Math.min(existing, distance);
        galaxyPairs.set(key, best);
      }
    }
    console.log(galaxyPairs);
  
    const distances = [...galaxyPairs.values()];
    console.log(distances.reduce((a, b) => a + b, 0));
  }

  // pt1();


  function pt2() {
    const world = {};
    const emptyRows = [];
    const emptyColumns = [];
    for (y = 0; y < lines.length; y++) {
      let rowHasGalaxy = false;
      const row = lines[y].split("");
      for (x = 0; x < row.length; x++) {
        const char = row[x];
        const isGalaxy = char === "#";
        rowHasGalaxy = rowHasGalaxy || isGalaxy;
      }
      if (!rowHasGalaxy) {
        emptyRows.push(y);
      }
    }
  
    for (x = 0; x < lines[0].length; x++) {
      let columnHasGalaxy = false;
      for (y = 0; y < lines.length; y++) {
        const char = lines[y].split("")[x];
        const isGalaxy = char === "#";
        columnHasGalaxy = columnHasGalaxy || isGalaxy;
      }
      if (!columnHasGalaxy) {
        emptyColumns.push(x);
      }
    }

    const originalGalaxies = [];
    lines.forEach((line, y) => {
      line.split("").forEach((char, x) => {
        const loc = toLoc(x, y);
        const isGalaxy = char === "#";
        world[loc] = {
          x,y,
          loc,
          isGalaxy
        };
  
        if (isGalaxy) {
          originalGalaxies.push(loc);
        }
      });
    });

    const multiplier = 1000000 - 1;
    const galaxies = originalGalaxies.map((loc) => {
      // shift the galaxy's X by the number of empty columns before it * multiplier 
      // shift the galaxy's Y by the number oe empty rows before it * multipler
      const [x, y] = fromLoc(loc);
      const newX = x + (emptyColumns.filter((col) => col < x).length * multiplier);
      const newY = y + (emptyRows.filter((row) => row < y).length * multiplier);
      return toLoc(newX, newY);
    });

    console.table(world);
    console.log(originalGalaxies);
    console.log(galaxies);
  
    function manthattenDistance(loc1, loc2) {
      const [x1, y1] = fromLoc(loc1);
      const [x2, y2] = fromLoc(loc2);
      return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
  
    const galaxyPairs = new Map(); // loc1, loc2 -> distance
    for (let i = 0; i < galaxies.length; i++) {
      const loc1 = galaxies[i];
      for (let j = i + 1; j < galaxies.length; j++) {
        const loc2 = galaxies[j];
        const key = [loc1, loc2].toSorted().join("_");
        const distance = manthattenDistance(loc1, loc2);
        
        const existing = galaxyPairs.get(key) ?? Infinity;
        const best = Math.min(existing, distance);
        galaxyPairs.set(key, best);
      }
    }
    console.log(galaxyPairs);
  
    const distances = [...galaxyPairs.values()];
    console.log(distances.reduce((a, b) => a + b, 0));
  }

  pt2();
})();

// 635832237682 p2