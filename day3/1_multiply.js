const { readFileSync } = require("fs");
const { join } = require("path");

// get data string from file
const data = readFileSync(join(__dirname, "input.txt"), "utf8");

// regex to match multiplication format
const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;

// iterate over matches and get the sum
const getMatchSum = (data, regex, sum) => {
  const match = regex.exec(data);
  // do the multiplication
  return match
    ? getMatchSum(data, regex, (sum += parseInt(match[1]) * parseInt(match[2])))
    : sum;
};
// get the sum
console.log(getMatchSum(data, mulRegex, 0));
