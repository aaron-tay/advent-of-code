const aoc = require("../../aoc");

function process(data) {
  const questions = {};
  data.map(person => {
    const qs = person.split("");
    qs.forEach(q => {
      if (!questions[q]) {
        questions[q] = 0;
      }
      questions[q] += 1;
      // questions.add(q);
    });
  });

  const final = [];
  const numPeople = data.length;
  Object.keys(questions).forEach(q => {
    if (questions[q] === numPeople) {
      final.push(q);
    }
  });
  return final.length;
}

// summing sets
(async function main() {
  const lines = await aoc.processFile();

  let data = [];
  let count = 0;
  for (line of lines) {
    if (line === "") {
      const score = process(data);
      count += score;
      data = [];
    } else {
      data.push(line);
    }
  }

  const score = process(data);
  count += score;
  console.log(count);

})();
