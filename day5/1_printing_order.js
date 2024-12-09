const { readFileSync } = require("fs");
const { join } = require("path");

// get data from file
const data = readFileSync(join(__dirname, "input.txt"), "utf8");

// get page ordering rules: Map<firstNumber, secondNumber[]>
// get page updates: number[][]
const pageOrderingRules = new Map();

const orderingRulesRegex = /(\d+)\|(\d+)/g;
const pageUpdatesRegex = /((?:\d+,)+\d+)/g;

const fillOrderingRules = (data, regex, rulesMap) => {
  const lastIndex = regex.lastIndex;
  const match = regex.exec(data);
  if (!match) {
    return lastIndex;
  }
  const key = match[1];
  const existingValues = rulesMap.get(key);
  rulesMap.set(
    key,
    existingValues ? existingValues.concat(match[2]) : [match[2]]
  );
  return fillOrderingRules(data, regex, rulesMap);
};
const getPageUpdates = (data, regex, updates) => {
  const match = regex.exec(data);
  if (!match) {
    return updates;
  }
  return getPageUpdates(data, regex, updates.concat([match[1].split(",")]));
};
pageUpdatesRegex.lastIndex = fillOrderingRules(
  data,
  orderingRulesRegex,
  pageOrderingRules
);
const pageUpdates = getPageUpdates(data, pageUpdatesRegex, []);

// check every number in the row is in the correct order
const rowIsInCorrectOrder = (row, orderRules) =>
  row.every(
    (elem, index) =>
      !row
        .slice(index + 1)
        .some(
          (nextElem) =>
            orderRules.has(nextElem) && orderRules.get(nextElem).includes(elem)
        )
  );
// check every row
const middleElemSum = pageUpdates.reduce((sum, row) => {
  const isInCorrectOrder = rowIsInCorrectOrder(row, pageOrderingRules);
  // get the sum of all middle numbers of updates in the correct order
  return isInCorrectOrder
    ? sum + parseInt(row[Math.floor(row.length / 2)], 10)
    : sum;
}, 0);

console.log(middleElemSum);
