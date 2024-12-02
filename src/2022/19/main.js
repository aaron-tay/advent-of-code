const aoc = require("../../aoc");

const ELEMENTS = {
  ORE: "ore",
  CLAY: "clay",
  OBSIDIAN: "obsidian",
  GEODE: "geode"
};

(async function main() {
  const lines = await aoc.processFile();

  function makeRobot(produces, costs) {
    const robot = {
      id: produces.map(({quantity, unit}) => `${unit}-${quantity}`).join("_"),
      produces,
      costs,
    };

    robot.canBuild = (resources) => {
      return robot.costs.every(({ quantity, unit }) => resources[unit] >= quantity);
    };
    robot.maxPossible = (resources) => {
      let result = 0;

      const remainder = {
        ...resources,
      }
      while (robot.canBuild(remainder)) {
        if (robot.canBuild(remainder)) {
          robot.costs.forEach(c => remainder[c.unit] -= c.quantity);
          result++;
        }
      }

      return result;
    }

    return robot;
  }

  function parseBlueprint(line) {
    // Blueprint 1: Each ore robot costs 2 ore. Each clay robot costs 2 ore. Each obsidian robot costs 2 ore and 20 clay. Each geode robot costs 2 ore and 14 obsidian.
    const [bp, obp] = line.split(":");
    const blueprintId = parseInt(bp.split(" ")[1]);

    const [orep, clayp, obsidianp, geodep] = obp.split(".");
    const oreRobot = makeRobot([{
        quantity: 1,
        unit: ELEMENTS.ORE
      }],
      orep.split("costs ")[1].split(" and ").map(d => ({
        quantity: parseInt(d.split(" ")[0].trim(), 10),
        unit: d.split(" ")[1],
      }))
    );
    const clayRobot = makeRobot([{
        quantity: 1,
        unit: ELEMENTS.CLAY
      }],
      clayp.split("costs ")[1].split(" and ").map(d => ({
        quantity: parseInt(d.split(" ")[0].trim(), 10),
        unit: d.split(" ")[1],
      }))
    );
    const obsidianRobot = makeRobot([{
        quantity: 1,
        unit: ELEMENTS.OBSIDIAN
      }], 
      obsidianp.split("costs ")[1].split(" and ").map(d => ({
        quantity: parseInt(d.split(" ")[0].trim(), 10),
        unit: d.split(" ")[1],
      }))
    );
    const geodeRobot = makeRobot([{
        quantity: 1,
        unit: ELEMENTS.GEODE
      }],
      geodep.split("costs ")[1].split(" and ").map(d => ({
        quantity: parseInt(d.split(" ")[0].trim(), 10),
        unit: d.split(" ")[1],
      }))
    );

    return {
      blueprintId,
      oreRobot,
      clayRobot,
      obsidianRobot,
      geodeRobot,
      robots: [geodeRobot, obsidianRobot, clayRobot, oreRobot]
    };
  }

  function buildRobotsGreedy(blueprint, resource) {
    let stillBuilding = true;

    const remainder = {
      ...resource,
    }
    const robots = [];
    const costs = [];
    while (stillBuilding) {
      const robot = blueprint.robots.find(r => r.canBuild(remainder));

      if (robot) {
        costs.push(...robot.costs);
        robot.costs.forEach(c => remainder[c.unit] -= c.quantity);
        robots.push(robot);
      } else {
        stillBuilding = false;
      }
    }

    return {
      robots,
      costs,
      remainder
    }
  }

  // // best memoised
  // function buildableRobotCombinations(blueprint, resource) {
  //   const limits = blueprint.robots.map(r => r.maxPossible(resource));

  //   const 
  // }

  function resourceMap() {
    return {
      [ELEMENTS.ORE]: 0,
      [ELEMENTS.CLAY]: 0,
      [ELEMENTS.OBSIDIAN]: 0,
      [ELEMENTS.GEODE]: 0,
    };
  }

  function income(robots) {
    const result = resourceMap();
    robots.forEach(r => {
      r.produces.forEach(p => {
        result[p.unit] += p.quantity
      })
    });
    return result;
  }

  function greedyPlan(blueprint) {
    const resources = resourceMap();
    const robots = [blueprint.oreRobot];
    for (let i = 0; i < 24; ++i) {
      // start build
      // console.log(robots);
      const { robots: builtRobots, costs, remainder } = buildRobotsGreedy(blueprint, resources);
      Object.keys(remainder).forEach(k => resources[k] = remainder[k]);
      // console.log("built", builtRobots.map(r => r.id));
      // console.log("cost", costs);
      // console.log("remainder", remainder);

      // collect
      const addition = income(robots);
      Object.keys(addition).forEach(k => resources[k] += addition[k]);

      // built
      robots.push(...builtRobots);
    }

    // console.log(resources);
    let quantityLevel = resources[ELEMENTS.GEODE] * blueprint.blueprintId;
    return quantityLevel;
  }

  // highest number of geodes is better
  function best(outcomes) {
    // ideas
    // G = 2O + 7B
    // B = 3O + 14C
    // C = 2O
    // O = 1
    
    // G = 2 + 7(3 + 14(2))
    //   = 2 + 7(3 + 28)
    //   = 219 O
    
    return outcomes.reduce((acc, c) => {

    }, resourceMap());
  }

  function findMostGeodes(blueprint, robots, resources, timeStep) {
    if (timeStep > 24) {
      return resources;
    }

    // generate every combination of robots that can be built??
    // build robot(s), build nothing
    // test each choise
    // take max of result
  }

  const blueprints = [];
  for (line of lines) {
    // console.log(line);
    const blueprint = parseBlueprint(line);
    blueprints.push(blueprint);
    console.log(blueprint);
  }
  
  for (blueprint of blueprints) {
    const b = greedyPlan(blueprint);
    console.log(blueprint.blueprintId, b);
  }
})();
