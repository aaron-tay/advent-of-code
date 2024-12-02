const aoc = require("../../aoc");

const HEX_TO_BIN = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
}

function parseHex(char) {
  return HEX_TO_BIN[char];
}

let id = 0;
function nextId() {
   return ++id;
}
let longestLiteral = 0;
function parseType4(version, typeId, packet) {
  const original = packet.join("");
  const data = [];
  while (packet[0] === "1") {
    const groupBits = packet.splice(0, 5);
    const bits = groupBits.splice(1);
    data.push(bits.join(""));
  }
  const groupBits = packet.splice(0, 5);
  const bits = groupBits.splice(1);
  data.push(bits.join(""));
  const target = (data.length * 5);
  let remainder = 0;
  while (remainder <= target) {
    remainder += 4;
  }
  remainder = remainder % 4;
  if (remainder !== 0) {
    console.log("?", data.length, target, remainder);
    packet.splice(0, remainder);
  }

  const literal = parseInt(data.join(""), 2);
  longestLiteral = Math.max(data.join("").length, longestLiteral);

  return {
    id: nextId(),
    version,
    typeId,
    result: +literal,
    // original,
    trace: {
      operation: "literal",
      data: [+literal]
    }
  }
}

function operator(typeId, data) {
  // console.log("O", typeId, data);
  let result = null;
  let trace = {
    operation: "",
    data: [...data],
  };
  if (typeId === 0) {
    trace.operation = "ADD";
    result = data.reduce((acc, curr) => acc + curr, 0);
  }
  if (typeId === 1) {
    trace.operation = "PRODUCT";
    result = data.reduce((acc, curr) => acc * curr, 1);
  }
  if (typeId === 2) {
    trace.operation = "MIN";
    result = data.reduce((acc, curr) => Math.min(acc, curr), Infinity);
  }
  if (typeId === 3) {
    trace.operation = "MAX";
    result = data.reduce((acc, curr) => Math.max(acc, curr), -Infinity);
  }
  if (typeId === 5) {
    trace.operation = "GREATER";
    if (data.length > 2) { throw new Error("too long", data); }
    if (data[0] > data[1]) { result = 1; } else { result = 0; }
  }
  if (typeId === 6) {
    trace.operation = "LESS";
    if (data.length > 2) { throw new Error("too long", data); }
    if (data[0] < data[1]) { result = 1; } else { result = 0; }
  }
  if (typeId === 7) {
    trace.operation = "EQUAL";
    if (data.length > 2) { throw new Error("too long", data); }
    if (data[0] === data[1]) { result = 1; } else { result = 0; }
  }

  return {
    result,
    trace,
  };
}

function parse11Bit(version, typeId, lengthTypeId, length, packet) {
  const original = packet.join("");
  // console.log("11Bit", original);
  const data = [];
  for (i = 0; i < length; ++i) {
    const parsed = parse(packet);
    data.push(parsed);
  }

  const { result, trace } = operator(typeId, data.map(d => d.result));

  return {
    id: nextId(),
    version,
    typeId,
    lengthTypeId,
    length,
    children: data,
    // original,
    result,
    trace,
  }
}

function parse15Bit(version, typeId, lengthTypeId, length, packet) {
  const original = packet.join("");
  const data = [];
  const subPacket = packet.splice(0, length);
  while (subPacket.length > 0) {
    console.log(subPacket.join(""));
    const parsed = parse(subPacket);
    data.push(parsed);
  }

  const { result, trace } = operator(typeId, data.map(d => d.result));

  return {
    id: nextId(),
    version,
    typeId,
    lengthTypeId,
    length,
    children: data,
    // original,
    result,
    trace,
  }
}

let sum = 0;
function parse(packet) {
  console.log("packet", packet.join(""));
  const version = parseInt(packet.splice(0, 3).join(""), 2);
  const typeId = parseInt(packet.splice(0, 3).join(""), 2);
  console.log(version, typeId);
  sum += version;
  if (typeId === 4) {
    return parseType4(version, typeId, packet);
  }

  const lengthTypeId = parseInt(packet.splice(0, 1).join(""), 2);
  if (lengthTypeId === 1) {
    const length = parseInt(packet.splice(0, 11).join(""), 2);
    return parse11Bit(version, typeId, lengthTypeId, length, packet);
  }

  const length = parseInt(packet.splice(0, 15).join(""), 2);
  return parse15Bit(version, typeId, lengthTypeId, length, packet);
}

function renderTrace(packets, depth = 0) {
  const indent = "|".padStart((depth+1), " ").padEnd((depth+1)*2, "-");
  console.log(indent, packets.id, packets.trace, " => ", packets.result);
  if (packets.children) {
    packets.children.forEach(c => {
      renderTrace(c, depth + 1);
    });
  }
}

(async function main() {
  const lines = await aoc.processFile();

  const data = lines[0].split("");
  console.log(data.join(""));
  const binary = data.map(c => {
    return parseHex(c);
  }).join("").split("");
  console.log(binary.join(""));

  const packets = parse(binary);

  console.log(packets);
  // console.table(packets);
  renderTrace(packets);
  console.log("p1>", sum);
  console.log("p2>", packets.result);

  console.log(longestLiteral);
})();

// V -> T -> ABC
// V -> T -> I -> L -> ABC...
// 1510977810583 too low?

// 1510981129695 too high
