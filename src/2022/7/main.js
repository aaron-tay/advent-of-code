const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function fullPath(cwd, other = null) {
    return [...cwd, other].filter(c => c).join("/");
  }

  const fileStructure = {}; // path/../file.dat: size
  const cwd = [];
  const cdRegex = /\$ cd (?<path>.*)/;
  const lsRegex = /\$ ls/;
  const dirRegex = /dir (?<dir>.*)/;
  const fileRegex = /(?<size>.*) (?<filename>.*)/
  for (line of lines) {
    console.log(line);

    const cmd = line;
    if (cdRegex.test(cmd)) {
      const { groups: m } = cdRegex.exec(cmd);
      const { path } = m;
      if (path === "..") {
        cwd.pop();
      } else if (path === "/") {
        cwd.splice(0);
        cwd.push("|");
      } else {
        cwd.push(path);
      }
    
    } else if (lsRegex.test(cmd)) {
      // can ignore this cos any dir/file is in this context anyway

    } else if (dirRegex.test(cmd)) {
      const { groups: m } = dirRegex.exec(cmd);
      const { dir } = m;
      const path = fullPath(cwd, dir);
      fileStructure[path] = {
        size: 0,
        type: "dir",
      };

    } else if (fileRegex.test(cmd)) {
      const { groups: m } = fileRegex.exec(cmd);
      const { filename, size } = m;
      const path = fullPath(cwd, filename);
      const filesize = parseInt(size, 10)
      fileStructure[path] = {
        size: filesize,
        type: "file"
      };
      // const dir = fullPath(cwd);
      // if (!fileStructure[dir]) {
      //   fileStructure[dir] = 0;
      // }
      // fileStructure[dir] += filesize;

    } else {
      throw new Error(line);
    }
  }

  const keys = Object.keys(fileStructure).sort((a, b) => {
    const aLength = a.split("/").length;
    const bLength = b.split("/").length;
    return bLength - aLength;
  });
  console.log(keys);
  function addSize(path, size, structure) {
    if (!structure[path]) {
      structure[path] = 0;
    }
    structure[path] += size;
  }
  const directorySizes = {};
  keys.forEach(key => {
    const parts = key.split("/");
    console.log(">", key, parts);
    const size = fileStructure[key].size;
    if (parts.length === 0) {
      // root
      addSize("|", size, directorySizes);
    } else {
      parts.forEach((p, idx) => {
        const pp = parts.slice(0, idx).join("/");
        addSize(pp, size, directorySizes);
      })
    }
  });
  console.table(directorySizes);

  const dirKeys = Object.keys(fileStructure).filter(i => fileStructure[i].type === "dir");
  // console.log("DIR", dirKeys);
  const outcomes = [];
  dirKeys.forEach(dirKey => {
    // const dirParts = dirKey.split("/");
    // const dir = dirParts[dirParts.length - 1];
    const dir = dirKey;
    if (directorySizes[dir] <= 100000) {
      outcomes.push(directorySizes[dir]);
    }
  });
  // console.log(outcomes);
  const result = outcomes.reduce((acc, c) => acc+c, 0);
  console.log("p1", result);

  // P! above.

  // 70000000 
  const spaceUsed = 70000000 - directorySizes["|"];
  const spaceRequired = 30000000 - spaceUsed;
  console.log(spaceRequired);

  let min = Infinity;
  dirKeys.forEach(dirKey => {
    const size = directorySizes[dirKey];
    if (size > spaceRequired) {
      if (size < min) {
        min = size;
      }
    }
  });
  console.log("p2", min);
})();

// That's not the right answer; your answer is too low. 
// If you're stuck, make sure you're using the full input data; there are also some general tips on the about page, 
// or you can ask for hints on the subreddit. Please wait one minute before trying again. (You guessed 893384.) [Return to Day 7]