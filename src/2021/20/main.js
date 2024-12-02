const aoc = require("../../aoc");

const REGIONS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
];

function makeKey({r, c}) {
  return `${r}_${c}`;
}

function unkey(keyString) {
  return keyString.split("_").map(i => +i);
}

function getCode({r,c}, image, override) {
  const result = [];
  REGIONS.forEach(([dc, dr]) => {
    const nr = (r + dr);
    const nc = (c + dc);
    const key = makeKey({r: nr, c: nc});
    const pixel = image[key] || override;
    result.push(pixel);
  });
  const asBinaryString = result.map(c => {
    if (c === "#") { return '1'; }
    else return '0';
  }).join("");
  return parseInt(asBinaryString, 2);
}

function enhance(image, algorithm, override = ".") {
  const result = {};

  Object.keys(image).forEach((key, idx) => {
    const [r, c] = unkey(key);
    const codeIdx = getCode({r,c}, image, override);
    const transform = algorithm[codeIdx];
    // console.log(key, codeIdx, transform);
    result[key] = transform;
  });

  return result;
}

function getBounds(image) {
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  Object.keys(image).forEach(key => {
    const [r, c] = unkey(key);
    if (r < minY) { minY = r; }
    if (r+1 > maxY) { maxY = r+1; }
    if (c < minX) { minX = c; }
    if (c+1 > maxX) { maxX = c+1; }
  });
  return {
    minX,
    maxX,
    minY,
    maxY
  }
}

const BUFFER_SIZE = 5;
function bufferImage(image, override = ".") {
  const {
    minX,
    maxX,
    minY,
    maxY
  } = getBounds(image);

  const result = {};
  for (let r = minY-BUFFER_SIZE; r < maxY+BUFFER_SIZE; ++r) {
    for (let c = minX-BUFFER_SIZE; c < maxX+BUFFER_SIZE; ++c) {
      const key = makeKey({r,c});
      result[key] = image[key] || override;
    }
  }

  return result;
}

function pruneImage(image) {
  const {
    minX,
    maxX,
    minY,
    maxY
  } = getBounds(image);

  const result = {};
  for (let r = minY+BUFFER_SIZE; r < maxY-BUFFER_SIZE; ++r) {
    for (let c = minX+BUFFER_SIZE; c < maxX-BUFFER_SIZE; ++c) {
      const key = makeKey({r,c});
      result[key] = image[key] || "?";
    }
  }

  return result;
}

function debug(image) {
  const {
    minX,
    maxX,
    minY,
    maxY
  } = getBounds(image);

  const result = [];
  for (let r = minY; r < maxY; ++r) {
    const row = [];
    for (let c = minX; c < maxX; ++c) {
      const key = makeKey({r,c});
      row.push(image[key] || "?");
    }
    result.push(row);
  }
  console.table(result);
}

(async function main() {
  const lines = await aoc.processFile();

  const algorithm = lines[0].split("");

  lines.shift();
  lines.shift();
  let initialImage = {};
  lines.forEach((row, r) => {
    row.split("").forEach((col, c) => {
      const key = makeKey({r, c});
      initialImage[key] = col;
    });
  });

  // console.log(algorithm);
  // console.log(initialImage);
  // debug(initialImage);
  console.log("initial", Object.values(initialImage).filter(i => i === "#").length);

  let buffer = initialImage;
  let override = ".";
  for (let i = 0; i < 2; ++i) {
    console.log(override);
    // debug(buffer);
    const buffered = bufferImage(buffer, override);
    debug(buffered);
    const newImage = enhance(buffered, algorithm, override);
    // debug(newImage);
    buffer = newImage;;
    // const count = Object.values(buffer).filter(i => i === "#").length;
    // console.log("D", count);
    const {
      minX,
      minY,
    } = getBounds(buffer);
    override = buffer[makeKey({r:minY, c:minX})];
  }
  debug(buffer);
  const count = Object.values(buffer).filter(i => i === "#").length;
  console.log(">", count);
})();

// 6789 not right...
// 7937 too high
// 5776 too high
// infinity (nope)
// 5682 nope
