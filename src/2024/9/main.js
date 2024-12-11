const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const getChecksum = (blocks) => {
    return blocks.reduce((acc, b, idx) => {
      if (b === ".") {
        return acc;
      }
      return acc + b * idx;
    }, 0);
  };

  const inputs = lines[0].split("").map(Number);
  const annotatedInputs = inputs.map((n, i) => {
    const isBlock = i % 2 === 0;
    const blockId = isBlock ? i / 2 : null;
    const data = new Array(n).fill(isBlock ? blockId : ".");
    return {
      isBlock,
      blockId,
      data,
      size: n,
      totalSpace: isBlock ? null : n,
      filledSpace: [],
      idx: i,
    };
  });

  function pt1(annotatedInputs) {
    const result = annotatedInputs.flatMap((input) => {
      return input.data;
    });
    let low = 0;
    let high = result.length - 1;
    while (low < high) {
      if (result[low] !== ".") {
        low++;
      } else if (result[high] === ".") {
        high--;
      }
      if (result[low] === "." && result[high] !== ".") {
        result[low] = result[high];
        result[high] = ".";
        low++;
        high--;
      }
    }
    console.log(result);
    console.log(getChecksum(result));
  }
  pt1(structuredClone(annotatedInputs));

  function pt2(annotatedInputs) {
    const stack = annotatedInputs.filter(({ isBlock }) => isBlock);
    stack.reverse();

    stack.forEach((chunk) => {
      if (chunk.moved) {
        return;
      }
      const emptySpace = annotatedInputs
        .filter((f) => !f.isBlock && !f.moved && f.idx < chunk.idx)
        .find((f) => {
          const freeSpace = f.totalSpace - f.filledSpace.length;
          return chunk.size <= freeSpace;
        });

      if (emptySpace) {
        emptySpace.filledSpace.push(...chunk.data);
        chunk.moved = true;
      }
    });

    const result = annotatedInputs.flatMap((entry) => {
      if (entry.moved) {
        return new Array(entry.size).fill(".");
      }
      if (entry.isBlock) {
        return entry.data;
      }
      if (!entry.isBlock) {
        const remainingSpace = entry.size - entry.filledSpace.length;
        return [...entry.filledSpace, ...new Array(remainingSpace).fill(".")];
      }
    });
    console.log(getChecksum(result));
  }
  pt2(structuredClone(annotatedInputs));
})();
