const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function fromLoc(loc) {
    return loc.split(",").map(Number);
  }
  function toLoc(x, y) {
    return `${x},${y}`;
  }

  let buffer = [];
  let reverseBuffer = [];
  const patternNotes = [];
  for (line of lines) {
    if (line === "") {
      patternNotes.push({
        pattern: structuredClone(buffer),
        inverse: structuredClone(reverseBuffer)
      });
      buffer = [];
      reverseBuffer = [];
      continue;
    }
    console.log(line);
    buffer.push(line.split(""));
    reverseBuffer.push(line.split("").reverse());
  }

  patternNotes.push({
    pattern: structuredClone(buffer),
    inverse: structuredClone(reverseBuffer)
  });
  buffer = [];
  reverseBuffer = [];

  console.log(patternNotes);
  // mirror goes top to bottom
  function findVerticalReflectionPoints(patternNotes) {
    const buffer = patternNotes.pattern;
    const inverse = patternNotes.inverse;

    const results = [];
    for (let i = 0; i < buffer.length; ++i) {
      const r = buffer.every((line, index) => {
        const original = line.join("").substr(i, line.length - i);
        const candidate = inverse[index].join("").substr(0, inverse[index].length - i);
        console.log(original, "|", candidate)
        return (original === candidate);
      });
      if (r) {
        const mirrorLength = buffer[0].join("").substr(i, line.length - i);
        if (mirrorLength.length > 0) {
          const mid = Math.ceil(mirrorLength.length / 2);
          console.log(mid + i);
          // return mid + i;
          results.push(mid + i);
        }
      }
    }
    return results;
  }

  // mirror goes left to right
  function findHorizontalReflectionPoint(patternNotes) {
    function transpose(matrix) {
      return matrix[0].map((col, i) => matrix.map(row => row[i]));
    }

    console.log("TP");
    console.table(patternNotes.pattern);
    const buffer = transpose(patternNotes.pattern);
    console.table(buffer);

    console.table(buffer.map(b => b.reverse()));
    const inverse = buffer.map(b => b.reverse());
    console.table(inverse);

    const results = [];
    for (let i = 0; i < buffer.length; ++i) {
      const r = buffer.every((line, index) => {
        const original = line.join("").substr(i, line.length - i);
        const candidate = inverse[index].join("").substr(0, inverse[index].length - i);
        console.log(original, "|", candidate)
        return (original === candidate);
      });
      if (r) {
        const mirrorLength = buffer[0].join("").substr(i, line.length - i);
        if (mirrorLength.length > 0) {
          const mid = Math.ceil(mirrorLength.length / 2);
          console.log(mid + i);
          results.push(mid + i);
          // return mid + i;
        }
      }
    }
    return results;
  }

  function findReflections(patternNote) {
    const vr = findVerticalReflectionPoints(patternNote);
    const vrScore = vr.reduce((acc, v) => acc + v, 0);

    if (vr?.length) {
      console.log("Vertical Reflection Point Found", vr);
      return {
        score: vrScore,
        type: "vertical",
      };
    }

    const hr = findHorizontalReflectionPoint(patternNote);
    const hrScore = hr.reduce((acc, v) => acc + (v*100), 0);
    if (hr?.length) {
      console.log("Horizontal Reflection Point Found", hr);
      return {
        score: hrScore,
        type: "horizontal",
      };
    }
    console.log("VR", vr);
    console.log("HR", hr);

    console.log(vrScore, hrScore);
    return {
      score: vrScore + hrScore,
      type: "both",
    }
  }

  // console.log(patternNotes[0].pattern[0]);
  // console.log(patternNotes[0].pattern[0].reverse().join(""));
  const scores = patternNotes.map(patternNote => {
    const s = findReflections(patternNote);
    return s;
  });
  console.log(scores);
  console.log(scores.reduce((acc, s) => acc + s.score, 0));
})();

// 30986 too high
// 20526 too low
// 24926 too low
// 24961 :(
// 29780 :(
  