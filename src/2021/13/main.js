const aoc = require("../../aoc");

function doFold(paper, {axis, position}) {
  console.log(position);
  const result = {};

  if (axis === "x") {
    const leftSide = Object.keys(paper).filter((key) => {
      const [x,y] = key.split("_");
      return x < position;
    });
    const rightSide = Object.keys(paper).filter((key) => {
      const [x,y] = key.split("_");
      return x > position;
    });
    console.log(leftSide, rightSide);

    const rightToLeft = {};
    rightSide.forEach((key) => {
      const [oldX,oldY] = key.split("_");
      const newX = position - ((+oldX) - position);
      rightToLeft[`${newX}_${oldY}`] = paper[key];
    });

    leftSide.forEach(key => {
      result[key] = paper[key];
    });
    Object.keys(rightToLeft).forEach(key => {
      result[key] = rightToLeft[key];
    });

  } else if (axis === "y") {

    const leftSide = Object.keys(paper).filter((key) => {
      const [x,y] = key.split("_");
      return y < position;
    });
    const rightSide = Object.keys(paper).filter((key) => {
      const [x,y] = key.split("_");
      return y > position;
    });
    console.log(leftSide, rightSide);

    const rightToLeft = {};
    rightSide.forEach((key) => {
      const [oldX,oldY] = key.split("_");
      const newY = position - ((+oldY) - position);
      console.log(key,"?", oldX, oldY, position, "->", newY);
      console.log("?", `${oldX}_${newY}`, paper[key])
      rightToLeft[`${oldX}_${newY}`] = paper[key];
    });

    leftSide.forEach(key => {
      result[key] = paper[key];
    });
    Object.keys(rightToLeft).forEach(key => {
      result[key] = rightToLeft[key];
    });
  }

  return result;
}

(async function main() {
  const lines = await aoc.processFile();

  let isPaper = true;
  const paper = {};
  const folds = [];
  for (line of lines) {
    if (line === "") {
      isPaper = false;
      continue;
    }
    if (isPaper) {
      const [x,y] = line.split(",");
      paper[`${x}_${y}`] = "#";
      continue;
    }
    const [fold, along, info] = line.split(" ");
    const [axis, position] = info.split("=");
    folds.push({
      axis,
      position: +position,
    });
  }
  console.log(paper);
  console.log(folds);

  let maxX = 0;
  let maxY = 0;
  Object.keys(paper).forEach((key) => {
    const [x,y] = key.split("_");
    maxX = Math.max(maxX, +x);
    maxY = Math.max(maxY, +y);
  });
  console.log(maxX, maxY);

  let newPaper = paper;
  folds.forEach(fold => {
    const result = doFold(newPaper, fold);
    newPaper = result;
    console.log(result);
    console.log(Object.values(result).length);
  })

  maxX = 0;
  maxY = 0;
  Object.keys(newPaper).forEach((key) => {
    const [x,y] = key.split("_");
    maxX = Math.max(maxX, +x);
    maxY = Math.max(maxY, +y);
  });
  console.log(maxX, maxY);

  for (let y = 0; y <= maxY; ++y) {
    let str = "";
    for (let x = 0; x <= maxX; ++x) {
      const key = `${x}_${y}`;
      const char = newPaper[key] || "."
      str += char;
    }
    console.log(str);
  }
})();
