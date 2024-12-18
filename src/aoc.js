const fs = require("fs");
const readline = require("readline");
const parseArgs = require("./parse-args");
const { filename } = parseArgs.getCliArguments();

async function processFile() {
  return new Promise((resolve, reject) => {
    const lines = [];

    const input = filename ? fs.createReadStream(filename) : process.stdin;

    const rl = readline.createInterface({
      input: input,
    });

    rl.on("line", (line) => {
      lines.push(line);
    });
    rl.on("close", () => {
      resolve(lines);
    });
    rl.on("error", (err) => {
      reject(err);
    });
  });
}

async function writeFile(outputFile, data) {
  return new Promise((resolve, reject) => {
    const dataToWrite = new Uint8Array(Buffer.from(data));
    fs.writeFile(outputFile, dataToWrite, (err) => {
      if (err) {
        return reject(err);
      }
      resolve("OK");
    });
  });
}

async function readFile(inputFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputFile, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

// returns array of arrays
function groupLines(lines) {
  const result = [];

  let data = [];
  for (line of lines) {
    if (line === "") {
      result.push(data);
      data = [];
    } else {
      data.push(line);
    }
  }
  result.push(data);

  return result;
}

const world = () => {
  const DIRECTIONS = [
    [1, 0, "e", 0, ">"],
    [0, 1, "s", 1, "v"],
    [-1, 0, "w", 2, "<"],
    [0, -1, "n", 3, "^"],
    // [1, 1, "ne"],
    // [-1, -1, "sw"],
    // [-1, 1, "nw"],
    // [1, -1, "se"],
  ];
  const BY_INDEX = DIRECTIONS.map(([, , d]) => d);

  const key = (x, y) => `${x}_${y}`;
  const unkey = (keyStr) => {
    const [x, y] = keyStr.split("_");
    return { x: +x, y: +y };
  };
  const moveByCoord = (x, y, direction) => {
    return { x: x + direction[0], y: y + direction[1] };
  };
  const moveByLoc = (loc, direction) => {
    const { x, y } = unkey(loc);
    const { x: nx, y: ny } = moveByCoord(x, y, direction);
    return key(nx, ny);
  };

  return {
    DIRECTIONS,
    key,
    unkey,
    moveByCoord,
    moveByLoc,
  };
};

module.exports = {
  processFile,
  groupLines,
  cache: {
    readFile,
    writeFile,
  },
  world,
};
