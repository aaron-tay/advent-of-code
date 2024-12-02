const aoc = require("../../aoc");

const DIRECTIONS = Object.freeze([
  Object.freeze([1, 0, "e", 0]),
  Object.freeze([0, 1, "s", 1]),
  Object.freeze([-1, 0, "w", 2]),
  Object.freeze([0, -1, "n", 3]),
]);

const EMPTY = " ";
const WALL = "#";
const OPEN = ".";

(async function main() {
  const lines = await aoc.processFile();

  function finalPassword(x, y, direction) {
    return (1000 * y) + (4 * x) + direction[3];
  }

  function debugGrid(grid, width, height) {
    const output = [];
    for (let y = 0; y < height; ++y) {
      const row = [];
      for (let x = 0; x < width; ++x) {
        const c = loc(x,y);
        row.push(grid[c] ?? EMPTY);
      }
      output.push(row.join(""));
    }
    console.log(output.join("\n"));
  }

  function loc(x, y) {
    return `${x}_${y}`;
  }
  function soc(from, to) {
    return `${from}_${to}`;
  }

  function makeConnections(dimensions) {
    const connections = {};
    if (dimensions === 4) {
      connections["C_e"] = "L";
      connections["C_s"] = "G";
      connections["C_w"] = "F";
      connections["C_n"] = "E";
      connections["E_e"] = "F";
      connections["E_s"] = "K";
      connections["E_w"] = "L";
      connections["E_n"] = "C";
      connections["F_e"] = "G";
      connections["F_s"] = "K";
      connections["F_w"] = "E";
      connections["F_n"] = "C";
      connections["G_e"] = "L";
      connections["G_s"] = "K";
      connections["G_w"] = "F";
      connections["G_n"] = "C";
      connections["K_e"] = "L";
      connections["K_s"] = "E";
      connections["K_w"] = "F";
      connections["K_n"] = "G";
      connections["L_e"] = "C";
      connections["L_s"] = "E";
      connections["L_w"] = "K";
      connections["L_n"] = "G";
    } else {
      // B + RIGHT => C
      connections["B_e"] = "C";
      connections["B_s"] = "F";
      connections["B_w"] = "I";
      connections["B_n"] = "M";
      connections["C_e"] = "J";
      connections["C_s"] = "F";
      connections["C_w"] = "B";
      connections["C_n"] = "M";
      connections["F_e"] = "C";
      connections["F_s"] = "J";
      connections["F_w"] = "I";
      connections["F_n"] = "B";
      connections["I_e"] = "J";
      connections["I_s"] = "M";
      connections["I_w"] = "B";
      connections["I_n"] = "F";
      connections["J_e"] = "C";
      connections["J_s"] = "M";
      connections["J_w"] = "I";
      connections["J_n"] = "F";
      connections["M_e"] = "J";
      connections["M_s"] = "C";
      connections["M_w"] = "B";
      connections["M_n"] = "I";
    }
    return connections
  }
  
  function makeTransitions(dimensions) {
    const transitions = {};
    const end = dimensions - 1;
    if (dimensions === 4) {
      transitions[soc("C", "G")] = ({x,y,direction}) => ({x,y:0,direction});
      transitions[soc("G", "C")] = ({x,y,direction}) => ({x,y:end,direction});
      transitions[soc("C", "L")] = ({x,y,direction}) => ({x,y: end - y,direction: DIRECTIONS[2]});
      transitions[soc("L", "C")] = ({x,y,direction}) => ({x,y: end - y,direction: DIRECTIONS[2]});
      transitions[soc("C", "G")] = ({x,y,direction}) => ({x,y:0,direction});
      transitions[soc("G", "C")] = ({x,y,direction}) => ({x,y:end,direction});
      transitions[soc("C", "F")] = ({x,y,direction}) => ({x:y,y:x,direction: DIRECTIONS[1]});
      transitions[soc("F", "C")] = ({x,y,direction}) => ({x:y,y:x,direction: DIRECTIONS[0]});

      transitions[soc("G", "K")] = ({x,y,direction}) => ({x,y:0,direction});
      transitions[soc("K", "C")] = ({x,y,direction}) => ({x,y:end,direction});
      transitions[soc("G", "F")] = ({x,y,direction}) => ({x:end,y,direction});
      transitions[soc("F", "G")] = ({x,y,direction}) => ({x:0,y,direction});
      transitions[soc("G", "L")] = ({x,y,direction}) => ({x:end-y,y:end-x,direction: DIRECTIONS[1]});
      transitions[soc("L", "G")] = ({x,y,direction}) => ({x:end-y,y:end-x,direction: DIRECTIONS[2]});
      
      transitions[soc("F", "E")] = ({x,y,direction}) => ({x:end,y,direction});
      transitions[soc("E", "F")] = ({x,y,direction}) => ({x:0,y,direction});
      transitions[soc("F", "K")] = ({x,y,direction}) => ({x:y,y:x,direction: DIRECTIONS[0]});
      transitions[soc("K", "F")] = ({x,y,direction}) => ({x:y,y:x,direction: DIRECTIONS[3]});
      
      transitions[soc("K", "L")] = ({x,y,direction}) => ({x:0,y,direction});
      transitions[soc("L", "K")] = ({x,y,direction}) => ({x:end,y,direction});
      transitions[soc("K", "E")] = ({x,y,direction}) => ({x:end-x,y,direction:DIRECTIONS[3]});
      transitions[soc("E", "K")] = ({x,y,direction}) => ({x:end-x,y,direction:DIRECTIONS[3]});
      
      transitions[soc("L", "E")] = ({x,y,direction}) => ({x:y,y:x,direction:DIRECTIONS[2]});
      transitions[soc("E", "L")] = ({x,y,direction}) => ({x:y,y:x,direction:DIRECTIONS[3]});
    } else {
      // just need to ensure the transitions are correct and we should be able to run!
      // 140379 incorrect!
      // 144012 :D
      transitions[soc("B", "C")] = ({x,y,direction}) => ({x:0,y,direction});
      transitions[soc("C", "B")] = ({x,y,direction}) => ({x:end,y,direction});
      transitions[soc("B", "M")] = ({x,y,direction}) => ({x:0,y:x,direction: DIRECTIONS[0]});
      transitions[soc("M", "B")] = ({x,y,direction}) => ({x:y,y:0,direction: DIRECTIONS[1]});
      transitions[soc("B", "I")] = ({x,y,direction}) => ({x:0,y:end-y,direction: DIRECTIONS[0]});
      transitions[soc("I", "B")] = ({x,y,direction}) => ({x:0,y:end-y,direction: DIRECTIONS[0]});
      transitions[soc("B", "F")] = ({x,y,direction}) => ({x:x,y:0,direction});
      transitions[soc("F", "B")] = ({x,y,direction}) => ({x:x,y:end,direction});

      transitions[soc("C", "M")] = ({x,y,direction}) => ({x:x,y:end,direction});
      transitions[soc("M", "C")] = ({x,y,direction}) => ({x:x,y:0,direction});
      transitions[soc("C", "J")] = ({x,y,direction}) => ({x:end,y:end-y,direction:DIRECTIONS[2]});
      transitions[soc("J", "C")] = ({x,y,direction}) => ({x:end,y:end-y,direction:DIRECTIONS[2]});
      transitions[soc("C", "F")] = ({x,y,direction}) => ({x:end,y:x,direction:DIRECTIONS[2]});
      transitions[soc("F", "C")] = ({x,y,direction}) => ({x:y,y:end,direction:DIRECTIONS[3]});
      
      transitions[soc("F", "I")] = ({x,y,direction}) => ({x:y,y:0,direction:DIRECTIONS[1]});
      transitions[soc("I", "F")] = ({x,y,direction}) => ({x:0,y:x,direction:DIRECTIONS[0]});
      transitions[soc("F", "J")] = ({x,y,direction}) => ({x:x,y:0,direction});
      transitions[soc("J", "F")] = ({x,y,direction}) => ({x:x,y:end,direction});

      transitions[soc("J", "I")] = ({x,y,direction}) => ({x:end,y:y,direction});
      transitions[soc("I", "J")] = ({x,y,direction}) => ({x:0,y:y,direction});
      transitions[soc("J", "M")] = ({x,y,direction}) => ({x:end,y:x,direction:DIRECTIONS[2]});
      transitions[soc("M", "J")] = ({x,y,direction}) => ({x:y,y:end,direction:DIRECTIONS[3]});

      transitions[soc("M", "I")] = ({x,y,direction}) => ({x:x,y:end,direction});
      transitions[soc("I", "M")] = ({x,y,direction}) => ({x:x,y:0,direction});
    }
    return transitions;
  }

  function globalToLocal(gx, gy, dimensions) {
    return {
      x: gx % dimensions,
      y: gy % dimensions,
    }
  }

  function localToGlobal(lx, ly, side, dimensions) {
    // 0123
    // 4567
    // 8901
    // 2345
    const idx = sideLabels.indexOf(side);
    const dx = Math.floor(idx % 4) * dimensions;
    const dy = Math.floor(idx / 4) * dimensions;
    return {
      x: lx + dx,
      y: ly + dy,
    }
  }

  function wrap(value, limit) {
    if (value < 0) {
      return value + limit;
    }
    if (value >= limit) {
      return value - limit;
    }

    return value;
  }

  // P1. just need to update this function to handle 'wrapping' around the cube
  function getNextForwardTile(location, map) {
    const { width, height, world, method, sides, connections, transitions } = map;

    let { x, y, side } = location;
    const [dx, dy, heading] = location.direction;
    
    if (method === "cube") {
      const from = side;
      const tKey = `${from}_${heading}`;
      let nx = x + dx;
      let ny = y + dy;
      let {x: gx, y: gy } = localToGlobal(nx, ny, from, map.dimensions);
      const maybeOutside = nx < 0 || ny < 0 || nx >= dimensions || ny >= dimensions;
      if (maybeOutside) {
        const to = connections[tKey];
        console.log(">", from, tKey, "->", to, nx, ny);
        const transform = transitions[`${from}_${to}`];
        const next = transform(location);
        let {x: gx, y: gy } = localToGlobal(next.x, next.y, to, map.dimensions);
        console.log(">>", next);
        return {
          ...next,
          side: to,
          data: rooms[to][loc(next.x, next.y)],
          gx, gy
        };
      }

      return {
        x: nx,
        y: ny,
        side: from,
        direction: location.direction,
        data: rooms[from][loc(nx, ny)],
        gx, gy
      }
      // we're falling off our room
      // if (nx > dimensions || nx < 0 || ny > dimensions || ny < 0) {

      // }
    } else {
      x = wrap((x + dx), width);
      y = wrap((y + dy), height);
      let c = loc(x,y);
      while (world[c] === EMPTY) {
        x = wrap((x + dx), width);
        y = wrap((y + dy), height);
        c = loc(x,y);
      }

      return {x, y, data: world[c]};
    }
  }

  function moveForwards(location, distance, map) {
    let newLocation = {
      ...location,
    };

    // get straight line from us through map
    let c = loc(location.x, location.y);
    let tile = map.world[c];
    let remainingDistance = distance;
    while (remainingDistance > 0 && tile !== WALL) {
      const t = getNextForwardTile(newLocation, map);
      console.log("   ", JSON.stringify(newLocation), " => ", JSON.stringify(t), c);
      c = loc(t.gx, t.gy);
      tile = map.world[c];
      remainingDistance--;
      if (tile !== WALL) {
        newLocation.x = t.x;
        newLocation.y = t.y;
        newLocation.side = t.side;
        newLocation.direction = t.direction;
        newLocation.gx = t.gx;
        newLocation.gy = t.gy;
      } else {
        break;
      }
    }
    // // trying this but probably remove
    // const local = globalToLocal(newLocation.x, newLocation.y, map.dimensions);
    // newLocation.lx = local.x;
    // newLocation.ly = local.y

    return newLocation;
  }

  function rotate(location, command) {
    let idx = DIRECTIONS.findIndex(d => d[2] === location.direction[2]);
    let newDirection = location.direction;

    if (command === "L") {
      idx = idx - 1;
      if (idx < 0) { idx = DIRECTIONS.length - 1; }
      newDirection = DIRECTIONS[idx];
    } else {
      newDirection = DIRECTIONS[(idx+1) % DIRECTIONS.length];
    }

    return {
      ...location,
      direction: newDirection
    };
  }

  // [ /d | L | R ]
  function parseCommands(cmdLine) {
    const commands = [];
    const buffer = [];
    let prev = null;
    for (c of cmdLine.split("")) {
      if (c === "R" || c === "L") {
        const d = parseInt(buffer.join(""));
        commands.push(d);
        commands.push(c);
        buffer.splice(0);
      } else {
        buffer.push(c);
      }
    }
    if (buffer) {
      const d = parseInt(buffer.join(""));
      commands.push(d);
    }
    return commands;
  }

  const mapLines = [];
  let cmdMode = false;
  let commands = [];
  for (line of lines) {
    console.log(line);
    if (cmdMode) {
      commands = parseCommands(line);
    } else {
      mapLines.push(line);
    }

    if (line === "") {
      cmdMode = true;
    }
  }
  // NB for 'test' I pad the first line to the correct width in the data itself!
  const width = mapLines[0].length;
  const height = mapLines.length;
  const world = {};
  let yy = 0;
  let startX = null;
  let startY = null;

  const dimensions = width >= 50 ? 50 : 4; // quick hack to figure size of cube
  const sideWidth = Math.floor(width / dimensions);
  const sideHeight = Math.floor(height / dimensions);
  console.log(sideWidth, sideHeight);
  const sides = {}; //loc: [ABCDEFGHIJKL]
  const sideLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q"];
  const rooms = {};
  sideLabels.forEach(s => rooms[s] = {});
  for (row of mapLines) {
    let xx = 0;
    row.split("").forEach((t, idx) => {
      if (t === OPEN && startX === null && startY === null) {
        startX = xx;
        startY = yy;
      }
      const c = loc(xx, yy);

      sideIdx = Math.floor(xx / dimensions) + (Math.floor(yy / dimensions) * 4);
      sides[c] = sideLabels[sideIdx];

      const rc = loc(xx % dimensions, yy % dimensions);
      rooms[sides[c]][rc] = t;
      world[c] = t;
      xx++;
    });
    for (; xx < width; ++xx) {
      const c = loc(xx, yy);
      world[c] = ' ';
    }
    yy++;
  }
  // console.table(world);
  debugGrid(sides, width, height);
  const connections = makeConnections(dimensions);
  const transitions = makeTransitions(dimensions);
  // console.table(transitions["B_C"]({x:1,y:2,d:DIRECTIONS[0]}));

  const map = {
    width,
    height,
    world,
    sides,
    connections,
    transitions,
    rooms,
    method: "cube",
    dimensions
  }
  const startLocal = globalToLocal(startX, startY, dimensions);
  const history = [{
    gx: startX,
    gy: startY,
    direction: DIRECTIONS[0],
    side: sides[loc(startX, startY)],
    x: startLocal.x,
    y: startLocal.y
  }];
  commands.forEach((c, idx) => {
    let lastMove = history[history.length-1];
    // console.log(idx, "| ", JSON.stringify(lastMove), c);

    let move = null;
    if (c === "L" || c === "R") {
      move = rotate(lastMove, c);
    } else {
      move = moveForwards(lastMove, c, map);
    }
    history.push({...move, c});
  });
  console.table(history.map(c => ({...c, direction: c.direction[2]})));

  const finalPosition = history[history.length-1];
  const p1Result = finalPassword(finalPosition.x + 1, finalPosition.y + 1, finalPosition.direction);

  const final = localToGlobal(finalPosition.x, finalPosition.y, finalPosition.side, dimensions);
  const p2Result = finalPassword(final.x + 1, final.y + 1, finalPosition.direction);
  console.log(p1Result);
  console.log(p2Result);

  //50x50


})();


// That's not the right answer; your answer is too low. 
// Please wait one minute before trying again. (You guessed 140379.) [Return to Day 22]
