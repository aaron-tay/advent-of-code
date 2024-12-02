const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const workflowOrder = [];
  const workflows = {};
  const parts = [];
  let mode = "workflows";
  for (line of lines) {
    if (line === "") {
      mode = "parts";
      continue;
    }

    console.log(line);
    if (mode === "workflows") {
      // tp{m>2826:R,R}
      const regex = /(?<id>.*?){(?<steps>.*?)}/;
      const {id, steps:rawSteps} = regex.exec(line)?.groups;
      const steps = rawSteps.split(",").map(step => {
        if (step.includes(":")) {
          const [rawCondition, destination] = step.split(":");
          const status = destination === "R" ? "REJECTED" : destination === "A" ? "ACCEPTED" : null;
          const condRegex = /(?<cat>\w+)(?<cond>[<>])(?<val>\d+)/;
          const {cat, cond, val} = condRegex.exec(rawCondition)?.groups;
          return { 
            p2: () => {
              console.log("test", step);
              if (cond === "<" || cond === ">") {
                return {
                  cat: category,
                  condition: cond,
                  value: +val,
                  min: cond === "<" ? 0 : +val,
                  max: cond === "<" ? +val: 4000
                };
              }
              return null;
            },
            p1: (part) => {
            console.log("test", step);
            const value = +part[cat];
            if (cond === "<") {
              if (value < +val) {
                console.log(`${cat}(${value}) < ${val}`);
                return {destination, status};
              }
            } else if (cond === ">") {
              if (value > +val) {
                console.log(`${cat}(${value}) > ${val}`);
                return {destination, status};
              }
            }
            return null;
          }
        };
        } else {
          const destination = step;
          const status = destination === "R" ? "REJECTED" : destination === "A" ? "ACCEPTED" : null;
          return {p1: () => {
            console.log("test", step);
            return {destination, status}
          }};
        }
      });
      workflows[id] = steps;
      workflowOrder.push(id);
    } else {
      // {x=23,m=390,a=1715,s=2743}
      const l = line.replace("{", "").replace("}", "").split(",").map(p => {
        const [lhs, rhs] = p.split("=");
        return `"${lhs}":${rhs}`;
      }).join(",");
      const part = JSON.parse(`{${l}}`);
      parts.push(part);
    }
  }

  console.table(workflows);
  console.table(parts);

  const partResults = parts.map(part => {
    console.log(part);
    let currentId = "in";
    let current = workflows[currentId];
    let status = null;
    while (status !== "REJECTED" && status !== "ACCEPTED") {
      console.log(currentId);
      const step = current.find(wf => wf(part));
      if (!step) {
        console.log("No step found");
        break;
      }
      console.log(step);
      const {destination, status:nextStatus} = step(part);

      status = nextStatus;
      if (!nextStatus && nextStatus !== "REJECTED" && nextStatus !== "ACCEPTED") {
        currentId = destination;
        current = workflows[currentId]
      }
    }
    return { part, status };
  });
  console.table(partResults);
  const p1 = partResults.filter(({status}) => status === "ACCEPTED").map(({part}) => {
    return ["x", "m", "a", "s"].reduce((acc, cat) => {
      return acc + part[cat];
    }, 0);
  });
  console.log(p1.reduce((acc, val) => acc + val, 0));
})();

// 256,000,000,000,000 4000^4
// 167,409,079,868,000

// so really need to build a tree of all possible paths and x m a s decisions
// s>=1351 & s>2770 & s>3448 => A -> 4000^3 * 552 => 35,328,000,000,000
// etc..