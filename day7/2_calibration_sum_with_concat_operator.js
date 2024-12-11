const { readFileSync } = require("fs");
const { join } = require("path");

// get data from file
const data = readFileSync(join(__dirname, "input.txt"), "utf8")
  .trimEnd()
  .split("\n");

const getSumAndMembers = (row) => {
  const sumAndMembersSplit = row.split(": ");
  return {
    result: sumAndMembersSplit[0],
    members: sumAndMembersSplit[1].split(" "),
  };
};

const getIsEquationPossible = (members, operators, result) => {
  const equationResult = members.reduce((prevResult, member, index) => {
    const operator = operators[index - 1];
    if (index === 0) return parseInt(member, 10);
    if (prevResult > result) return prevResult;
    return eval(`${prevResult}${operator === "|" ? "" : operator}${member}`);
  }, 0);
  return equationResult === result;
};

const operators = ["+", "*", "|"];

const getCombinationsTree = (operators, depth) => {
  if (depth === 1) return operators.map((op) => op);
  const deeperCombinations = getCombinationsTree(operators, depth - 1);
  return operators
    .map((op) => deeperCombinations.map((subOp) => [op, subOp]))
    .flat();
};

const getAllCombinations = (operators, operatorsCount) => {
  if (operatorsCount === 0) return [[]];
  const combinations = getCombinationsTree(operators, operatorsCount);
  const flattenBy = operatorsCount - 2;
  return combinations.map((combination) =>
    flattenBy > 0 ? combination.flat(flattenBy) : combination
  );
};

// get the sum and members of each equation
const equationsSum = data.reduce((sum, row) => {
  const { result, members } = getSumAndMembers(row);
  const resultNumber = parseInt(result, 10);
  // get the number of operators
  const operatorsCount = members.length - 1;
  // get all the possible operators combinations
  const operatorsCombinations = getAllCombinations(operators, operatorsCount);
  // iterate over each combination to find the first one that gives the correct sum
  const isEquationPossible = operatorsCombinations.some((combination) =>
    getIsEquationPossible(members, combination, resultNumber)
  );
  // get the sum of the correct equation
  return isEquationPossible ? sum + resultNumber : sum;
  // return sum;
}, 0);
console.log(equationsSum);
