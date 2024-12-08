// parses the leaderboard.json file and outputs a table of the results for a given day
//  can get leaderboard data via API https://adventofcode.com/2023/leaderboard/private/view/1177891
// usage: node leaderboard.mjs --day 1
// console.log(argv);
if (argv.help) {
  console.log("usage: node leaderboard.mjs [--day=?]");
  console.log(
    `
Parses the leaderboard.json file and outputs a table of the results for a given day
Can get leaderboard data via API https://adventofcode.com/2023/leaderboard/private/view/1177891
  `
  );
  process.exit(1);
}

const day = argv.day;
const memberFilter = argv.member;
const c = await $`cat leaderboard.json | jq .members`;
// console.log(c.stdout);
const members = JSON.parse(c.stdout);

const results = Object.values(members)
  .filter((member) => {
    if (!memberFilter) {
      return true;
    }

    return member.name === memberFilter;
  })
  .map((member) => {
    console.log(">", member);
    const dayResults = member.completion_day_level[`${day}`];
    if (dayResults) {
      if (dayResults[1]) {
        dayResults[1].friendly = new Date(dayResults[1].get_star_ts * 1000);
        delete dayResults[1].get_star_ts;
        // delete dayResults[1].star_index;
      }
      if (dayResults[2]) {
        dayResults[2].friendly = new Date(dayResults[2].get_star_ts * 1000);
        delete dayResults[2].get_star_ts;
        // delete dayResults[2].star_index;
      }
    }
    return {
      name: member.name,
      ...dayResults,
      last: member.last_star_ts ? new Date(member.last_star_ts * 1000) : null,
    };
  });

console.table(results);
