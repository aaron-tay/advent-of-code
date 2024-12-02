const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function loc({x,y}) {
    return `${x}_${y}`;
  }

  function manhattenDistance(from, to) {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
  }

  function extremes(sensors, beacons) {
    let farLeft = Infinity;
    let farRight = -Infinity;
    Object.values(sensors).forEach(s => {
      farLeft = Math.min(s.x - s.blackout, farLeft);
      farRight = Math.max(s.x + s.blackout, farRight);
    });
    Object.values(beacons).forEach(b => {
      farLeft = Math.min(b.x, farLeft);
      farRight = Math.max(b.x, farRight);
    });
    farLeft -= 5;
    farRight += 5;
    return { farLeft, farRight };
  }
  function tuningFrequency({x,y}) {
    return (4000000*x) + y;
  }

  function intersection({m: a1, c: c1}, {m: a2, c: c2}) {
    // y = mx + c => 
    // mx - y + c = 0
    // ax + by + c = 0
    const b1 = -1;
    const b2 = -1;
    const x = ((b1*c2) - (b2*c1)) / ((b2*a1) - (b1*a2));
    const y = ((a2*c1) - (a1*c2)) / ((b2*a1) - (b1*a2));
    return {x, y};
  }

  // y = mx + c
  function distanceBetweenLines({m: m1, c: c1}, {m: m2, c: c2}) {
    return Math.abs(c2 - c1) / Math.sqrt(1 + (m1 * m2));
  }

  function lineEquation(p1, p2) {
    const m = (p2.y - p1.y) / (p2.x - p1.x);
    // y - mx = c
    const c = p1.y - (m * p1.x);
    return {
      m,
      c
    }
  }

  function getEdges(sensor) {
    // y = mx + c
    // m = 
    const n = { x: sensor.x, y: sensor.y - sensor.blackout };
    const e = { x: sensor.x + sensor.blackout, y: sensor.y };
    const s = { x: sensor.x, y: sensor.y + sensor.blackout };
    const w = { x: sensor.x - sensor.blackout, y: sensor.y };

    const ne = lineEquation(n,e);
    const nw = lineEquation(n,w);
    const se = lineEquation(s,e);
    const sw = lineEquation(s,w);

    return {
      ne,
      nw,
      se,
      sw,
    }
  }

  const sensors = {};
  const beacons = {};
  const scale = 1;
  let idx = 0;
  for (line of lines) {
    // console.log(line);
    // Sensor at x=2, y=18: closest beacon is at x=-2, y=15
    const lineRegex = /Sensor at x=(?<sx>.*), y=(?<sy>.*): closest beacon is at x=(?<bx>.*), y=(?<by>.*)/;
    const { groups: m } = lineRegex.exec(line);
    const all = [m.sx, m.sy, m.bx, m.by].map(c => parseInt(c, 10));
    function segmentedNumber(number, numDigits, blockSize, block) {
      const regex = new RegExp(`.{1,${blockSize}}`,"g");
      const r = (''+Math.abs(number)).padStart(numDigits, "0").match(regex);
      const n = parseInt(r[block], 10) * (Math.sign(number));
      return n;
    }
    const digits = 10;
    const blockSize = 10;
    const blockNumber = 0;
    const sensor = {
      // x: all[0],
      // y: all[1],
      x: segmentedNumber(all[0] / scale, digits, blockSize, blockNumber),
      y: segmentedNumber(all[1] / scale, digits, blockSize, blockNumber),
    };
    const beacon = {
      // x: all[2],
      // y: all[3]
      x: segmentedNumber(all[2] / scale, digits, blockSize, blockNumber),
      y: segmentedNumber(all[3] / scale, digits, blockSize, blockNumber),
    };
    sensors[loc(sensor)] = sensor;
    beacons[loc(beacon)] = beacon;
    const distance = manhattenDistance(sensor, beacon);
    sensor.blackout = distance;
    sensor.beacon = beacon;
    const edges = getEdges(sensor);
    sensor.edges = edges;
    sensor.key = loc(sensor);
    beacon.key = loc(beacon);
    sensor.id = String.fromCharCode("A".charCodeAt(0)+idx);
    idx++;
    // console.log(sensor, beacon, distance);
  }
  console.log(Math.max(...Object.values(sensors).map(s => s.blackout)));
  console.log(Object.values(sensors)[0])

  function p1(sensors, beacons, targetRow) {
    let { farLeft, farRight } = extremes(sensors, beacons);
    // farLeft = Math.max(farLeft, 0);
    // farRight = Math.min(farRight, 4000000);
    // console.log(farLeft, farRight);
    // find all sensors which could intersect the row
    const row = [];
    const idx = [];
    const idx10s = [];
    for (let x = farLeft; x < farRight; ++x) {
      idx.push((''+Math.abs(x)).padStart(2, "0")[1]);
      idx10s.push((''+Math.abs(x)).padStart(2, "0")[0]);
      const code = Object.values(sensors).map(s => {
        if (s.x === x && s.y === targetRow) {
          return "S";
        }
        if (s.beacon.x === x && s.beacon.y === targetRow) {
          return "B";
        }

        const blackoutDistance = s.blackout;
        const distanceToPoint = manhattenDistance(s, {x, y: targetRow});
        // console.log(s, {x, y: targetRow}, distanceToPoint, blackoutDistance);
        if (distanceToPoint <= blackoutDistance) {
          return "#";
        }

        return ".";
      }).reduce((acc, c) => {
        if (c === "S" || acc === "S") {
          return "S";
        }
        if (c === "B" || acc === "B") {
          return "B";
        }
        if (c === "#" || acc === "#") {
          return "#";
        }
        return c;
      },".");
      row.push(code);
    }
    // console.log(idx10s.join(""));
    // console.log(idx.join(""));
    console.log(row.join(""));
    // const result = row.map(c => c === "#" ? 1 : 0).reduce((acc, c) => acc+c, 0);
    // console.log(result);
  }
  // p1(sensors, beacons, 10);
  // for (let y = 0; y < 25; ++y) {
  //   p1(sensors, beacons, y);
  // }

  const asList = Object.values(sensors);
  const xpairs = [];
  const ypairs = [];
  asList.forEach(s1 => {
    asList.filter(s2 => s2.key !== s1.key).forEach(s2 => {
      const xd = distanceBetweenLines(s1.edges.se, s2.edges.nw);
      const yd = distanceBetweenLines(s1.edges.ne, s2.edges.sw);
      // console.log(s1.key, s2.key, xd, yd);
      if (xd > 1 && xd < 2) {
        console.log(xd, yd);
        xpairs.push([s1.edges.se, s2.edges.nw]);
      }
      if (yd > 1 && yd < 2) {
        console.log(xd, yd);
        ypairs.push([s1.edges.ne, s2.edges.sw]);
      }
    });
  });
  console.log(xpairs, ypairs);
  
  // perfect for P2. more general solution would be to iterate through the pairs
  // then check that point's distance against sensors
  const np = intersection(xpairs[0][0], ypairs[0][0]);
  const ep = intersection(xpairs[0][0], ypairs[0][1]);
  const sp = intersection(xpairs[0][1], ypairs[0][0]);
  const wp = intersection(xpairs[0][1], ypairs[0][1]);
  console.log(np, ep, sp, wp);
  // { x: 2595656, y: 2753392 }
  // { x: 2595657, y: 2753391 }
  // { x: 2595657, y: 2753393 }
  // { x: 2595658, y: 2753392 }

  // 678
  // 1 x
  // 2x x
  // 3 x

  // 2595657, 2753392
  // p1(sensors, beacons, 2753392);
  const tf = tuningFrequency({x: 2595657, y: 2753392});
  console.log(tf);
  // 10382630753392

})();


// That's not the right answer. 
// If you're stuck, make sure you're using the full input data; 
// there are also some general tips on the about page, or you can ask for hints on the subreddit. 
// Please wait one minute before trying again. (You guessed 4716237.) [Return to Day 15]
// -> wrong bounds
// 7730280

// 16,000,000,000,000 locations.. that will take a while
// 184,000,000
// 4000000
// 1938058

// segment lines

// regions where a circle is intersected multiple times
