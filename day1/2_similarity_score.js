const { readFileSync } = require("fs");
const path = require("path");

// read file
const data = readFileSync(path.join(__dirname, "input.txt"), "utf-8").trim();

// get 2 lists
const { 0: list1, 1: list2 } = data.split("\n").reduce(
  (acc, line) => {
    const { 0: first, 1: second } = line.split(/\s+/);
    if (first === undefined || second === undefined) {
      console.log(line);
    }
    acc = [acc[0].concat(first), acc[1].concat(second)];
    return acc;
  },
  [[], []]
);

// get the similarity for each element
const similarities = list1.reduce((acc, curr, i) => {
  const occurences = list2.reduce(
    (acc, list2Curr) => (curr === list2Curr ? acc + 1 : acc),
    0
  );

  // sum the similarities
  return acc + parseInt(curr, 10) * occurences;
}, 0);
console.log(similarities);
