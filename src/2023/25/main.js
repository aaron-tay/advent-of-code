const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  function getAllComponentNames(components) {
    const allNames = new Set();
    for (const [name, component] of Object.entries(components)) {
      allNames.add(name);
      allNames.add(...component.connected);
    }
    return [...allNames];
  }

  function twoWay(components) {
    const connections = new Map(); // string:Set
    Object.entries(components).forEach(([name, component]) => {
      const componentConnections = Object.keys(component.connections);
      
      componentConnections.forEach(otherName => {
        const self = connections.get(name) ?? new Set();
        self.add(otherName);
        connections.set(name, self);

        const other = connections.get(otherName) ?? new Set();
        other.add(name);
        connections.set(otherName, other);
      });
    });
    console.table(connections);
  }

  function preProcess(components) {
    const referenceCounts = {};
    const allNames = new Set();

    for (const [name, component] of Object.entries(components)) {
      allNames.add(name);
      allNames.add(...component.connected);
    }

    allNames.forEach(name => {
      referenceCounts[name] = 0;
    });
    allNames.forEach(name => {
      console.log(name);
      const component = components[name];
      if (component) {
        component.connected.forEach(otherName => {
          referenceCounts[otherName]++;
        });
      }
    });

    return {
      roots: Object.entries(referenceCounts).filter(([name, count]) => count === 0).map(([name, count]) => name),
      referenceCounts,
      allNames,
    };
  }

  const rawComponents = {};
  for (line of lines) {
    const [name, others] = line.split(": ").map(n => n.trim());
    const linkedComponentNames = others.split(" ").map(n => n.trim());
    const connections = linkedComponentNames.reduce((acc, name) => {
      acc[name] = name;
      return acc;
    }, {});
    const component = rawComponents[name] ?? {
      raw: {
        name,
        connected: linkedComponentNames
      },
      name,
      connections
    };

    rawComponents[name] = component;
  }

  // setup two way connections. if A->B then B->A
  console.table(rawComponents);
  const { roots, allNames, referenceCounts } = preProcess(rawComponents);
  console.table(referenceCounts);
  console.log(allNames);
  console.log(roots);

  twoWay(rawComponents);
})();
