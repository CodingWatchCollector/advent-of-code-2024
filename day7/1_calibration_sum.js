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

const getIsEquationPossible = (members, operands, result) =>
  eval(
    members.reduce(
      (equationString, member, index) =>
        `(${equationString}${member})${
          index === members.length - 1 ? "" : operands[index]
        }`,
      ""
    )
  ) === result;

const operands = ["+", "*"];

const getCombinationsTree = (operands, depth) => {
  if (depth === 1) return operands.map((op) => op);
  const deeperCombinations = getCombinationsTree(operands, depth - 1);
  return operands
    .map((op) => deeperCombinations.map((subOp) => [op, subOp]))
    .flat();
};

const getAllCombinations = (operands, operandsCount) => {
  if (operandsCount === 0) return [[]];
  const combinations = getCombinationsTree(operands, operandsCount);
  const flattenBy = operandsCount - 2;
  return combinations.map((combination) =>
    flattenBy > 0 ? combination.flat(flattenBy) : combination
  );
};

// get the sum and members of each equation
const equationsSum = data.reduce((sum, row) => {
  const { result, members } = getSumAndMembers(row);
  const resultNumber = parseInt(result, 10);
  // get the number of operands
  const operandsCount = members.length - 1;
  // get all the possible operands combinations
  const operandsCombinations = getAllCombinations(operands, operandsCount);
  // iterate over each combination to find the first one that gives the correct sum
  const isEquationPossible = operandsCombinations.some((combination) =>
    getIsEquationPossible(members, combination, resultNumber)
  );
  // get the sum of the correct equation
  return isEquationPossible ? sum + resultNumber : sum;
  // return sum;
}, 0);
console.log(equationsSum);
