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

module.exports = {
  processFile,
  groupLines,
  cache: {
    readFile,
    writeFile,
  },
};
