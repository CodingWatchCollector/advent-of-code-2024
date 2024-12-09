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

const findWrongElem = (row, orderRules) => {
  // [base case] if row is less than 2 -> return null
  if (row.length < 2) return { wrongElem: null, elemToReplaceWith: null };
  // find if the first elem is wrong
  const elemToReplaceWith = row
    .slice(1)
    .find(
      (elem) => orderRules.has(elem) && orderRules.get(elem).includes(row[0])
    );
  // if present, return it with the elem to swap with
  if (elemToReplaceWith) return { wrongElem: row[0], elemToReplaceWith };
  // if not -> findWrongElemR(row.slice(1), orderRules)
  if (!elemToReplaceWith) return findWrongElem(row.slice(1), orderRules);
};

const getRowInCorrectOrder = (row, orderRules, initialRowIsCorrect) => {
  // find the wrong elem
  const { wrongElem, elemToReplaceWith } = findWrongElem(row, orderRules);
  // if !wrong elem => return row
  if (!wrongElem) return { correctRow: row, isCorrect: initialRowIsCorrect };
  // if wrong elem => swap places
  return getRowInCorrectOrder(
    row.map((elem) =>
      elem === wrongElem
        ? elemToReplaceWith
        : elem === elemToReplaceWith
        ? wrongElem
        : elem
    ),
    orderRules,
    false
  );
};

// get the sum of all middle numbers of wrong rows
const incorrectRowsSum = pageUpdates.reduce((sum, row) => {
  const { correctRow, isCorrect } = getRowInCorrectOrder(
    row,
    pageOrderingRules,
    true
  );
  return !isCorrect
    ? sum + parseInt(correctRow[Math.floor(correctRow.length / 2)], 10)
    : sum;
}, 0);
console.log(incorrectRowsSum);
