const aoc = require("../../aoc");

(async function main() {
  console.time("timing");
  const lines = await aoc.processFile();

  const seeds = [];
  const seedPairs = [];
  let mode = null;
  const maps = {};
  const modeOrder = [];
  for (line of lines) {
    // console.log(line);
    if (!line?.trim().length) {
      continue;
    }

    if (line.startsWith("seeds: ")) {
      const inputSeeds = line.split("seeds: ")[1].split(" ").map(Number);
      // console.log(inputSeeds);
      seeds.push(...(inputSeeds.map(s => ({ value: s, valueRange: 1  }))));
      for (let i = 0; i < inputSeeds.length; i += 2) {
        seedPairs.push({
          value: inputSeeds[i],
          valueRange: inputSeeds[i + 1],
        });
      }
      continue;
    } else if (line.includes(":")) {
      mode = line.split(":")[0];
      modeOrder.push(mode);
      continue;
    }
    const [destination, source, range] = line.split(" ").map(Number);
    // console.log(mode, destination, source, range);
    maps[mode] ??= [];
    maps[mode].push({
      destination,
      source,
      range,
    });
  }
  
  Object.entries(maps).map(([mode, map]) => {
    // console.log(mode);
    // console.table(map);
  });

  function inRange({ value, valueRange }, { source, range }) {
    return source <= value && value <= (source + range);
  }

  function mapSourceToDestination({ value, valueRange }, { source, destination, range }) {
    if (!inRange({ value, valueRange }, { source, destination, range })) {
      return { value, valueRange };
    }
    const diff = value - source;

    if (diff < 0) { throw new Error("FAIL"); }

    return { value: destination + diff, valueRange };
  }

  function getMappedValue(seed, mapping) {
    const fn = mapping.find(({ source, range }) => {
      return inRange(seed, { source, range });
    });
    if (fn) {
      return mapSourceToDestination(seed, fn);
    }
    return { value: seed.value, valueRange: seed.valueRange };
  }
  // console.log(seeds);

  // mapSourceToDestination(79, maps["seed-to-soil map"][0]);
  // const v = mapSourceToDestination(55, maps["seed-to-soil map"][1]);
  function part1() {
    const v = seeds
      .map(s => getMappedValue(s, maps["seed-to-soil map"]))
      .map(s => getMappedValue(s, maps["soil-to-fertilizer map"]))
      .map(s => getMappedValue(s, maps["fertilizer-to-water map"]))
      .map(s => getMappedValue(s, maps["water-to-light map"]))
      .map(s => getMappedValue(s, maps["light-to-temperature map"]))
      .map(s => getMappedValue(s, maps["temperature-to-humidity map"]))
      .map(s => getMappedValue(s, maps["humidity-to-location map"]))
    // console.log(v);
  
    const closest = Math.min(...v.map(v => v.value));
    // console.log(closest);
    console.timeLog("timing");
  }
  // part1();

  // console.log("part 2");
  // console.log(seedPairs);
  // need to split seedpairs into groups based on mapping ranges
  // function inRange({ value, valueRange }, { source, range }) {
  //   return source <= value && value <= (source + range);
  // }
  
  // given a seedpair, partition it into segments depending on how it fits into the supplied mapping
  // if the seedPair is completely contained within mapping, return [seedPair]
  // if the seedPair is partially contained within mapping, partition it into 2 segments; the segment that is contained within the mapping, and the segment that is not
  // if the seedPair is not contained within mapping, return the [seedPair]
  // if the seedPair completely contains mapping, partition it into 3 segments; the segments that are less than the mapping, the segment within the mapping and the segment greater than the mapping
  function segmentSeedPair(seedPair, mappings) {
    const { value, valueRange } = seedPair;

    const newMappings = mappings.toSorted((a, b) => a.source - b.source);
    const checkpoints = [];
    newMappings.forEach(({ source, range }) => {
      checkpoints.push(source);
      checkpoints.push(source + range);
    });
    checkpoints.push(value);
    checkpoints.push(value + valueRange);
    checkpoints.sort((a, b) => a - b);
    // console.log(checkpoints);

    const segments = checkpoints.flatMap((checkpoint, index) => {
      const from = (checkpoints[index - 1] ?? checkpoints[0]);
      const to = checkpoint;
      const distance = to - from;
      const r = inRange({ value: from, valueRange: distance }, { source: value, range: valueRange - 1 });
      // console.log(from, to, r);
      if (r) {
        return {
          value: from,
          valueRange: distance,
        };
      }
      return null;
    }).filter(f => f).filter(f => f.valueRange > 0);

    // console.log("s", seedPair, segments);
    return segments
  }

  // sortpairs, sortmaps(by source)
  // generate new seedpairs based which maps they are in range of
  function generateSeedPairs(iSeedPairs, mappings) {
    const segments = iSeedPairs.flatMap(seedPair => (segmentSeedPair(seedPair, mappings))).filter(f => f);
    // console.log(">", segments);
    return segments;
  }

  function rangedMappedValues(seedPairs, mapping) {
    return generateSeedPairs(seedPairs, mapping).map(s => getMappedValue(s, mapping));
  }

  // generateSeedPairs(seedPairs, maps["seed-to-soil map"]);
  const v2 = [seedPairs]
  .map(s => rangedMappedValues(s, maps["seed-to-soil map"]))
  .map(s => rangedMappedValues(s, maps["soil-to-fertilizer map"]))
  .map(s => rangedMappedValues(s, maps["fertilizer-to-water map"]))
  .map(s => rangedMappedValues(s, maps["water-to-light map"]))
  .map(s => rangedMappedValues(s, maps["light-to-temperature map"]))
  .map(s => rangedMappedValues(s, maps["temperature-to-humidity map"]))
  .map(s => rangedMappedValues(s, maps["humidity-to-location map"]))
  // console.log("v2", v2);
  
  const v2Values = v2[0].map(f => f.value);
  console.log(Math.min(...v2Values));
  console.timeEnd("timing");
})();


// 346433842