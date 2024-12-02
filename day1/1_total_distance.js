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

// sort both
list1.sort();
list2.sort();

// find the distance between each element
// sum the distances
const sum = list1.reduce((acc, curr, i) => acc + Math.abs(curr - list2[i]), 0);
console.log(sum);
