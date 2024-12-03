const { readFileSync } = require("fs");
const { join } = require("path");

// get data string from file
const data = readFileSync(join(__dirname, "input.txt"), "utf8");

// regex to match multiplication format, do() and don't()
const mulRegex =
  /(?:mul\((\d{1,3}),(\d{1,3})\))|(?<do>do\(\))|(?<dont>don't\(\))/g;

const getNewShouldCountOrNull = (matchGroups) =>
  matchGroups.do !== undefined
    ? true
    : matchGroups.dont !== undefined
    ? false
    : null;

const getNewSum = (shouldCount, sum, match) =>
  shouldCount ? sum + parseInt(match[1]) * parseInt(match[2]) : sum;

// iterate over matches and get the sum
const getMatchSumConditionally = (data, regex, sum, shouldCount) => {
  const match = regex.exec(data);
  const newShouldCountOrNull = match
    ? getNewShouldCountOrNull(match.groups)
    : null;

  return match
    ? newShouldCountOrNull !== null
      ? // if shouldCount has been updated, the sum has not been changed
        getMatchSumConditionally(data, regex, sum, newShouldCountOrNull)
      : getMatchSumConditionally(
          data,
          regex,
          getNewSum(shouldCount, sum, match),
          shouldCount
        )
    : sum;
};
// get the sum
console.log(getMatchSumConditionally(data, mulRegex, 0, true));
