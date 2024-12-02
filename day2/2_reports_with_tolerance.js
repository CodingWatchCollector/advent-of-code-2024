const { readFileSync } = require("fs");

const { join } = require("path");

const getReportState = (report) =>
  report.reduce(
    (acc, numAsString) => {
      const { prev, isAscending, isDescending } = acc;
      let newAscending = isAscending;
      let newDescending = isDescending;
      const num = parseInt(numAsString, 10);

      // edge case: first num
      if (prev === undefined) {
        return { prev: num, isAscending: true, isDescending: true };
      }

      // 1. - is gradually increasing
      if (isAscending) {
        // 2. - difference between two adjacent numbers >= 1
        //    - AND difference between two adjacent numbers <= 3
        const ascDifference = num - prev;
        newAscending = ascDifference >= 1 && ascDifference <= 3;
      }

      //    - OR gradually decreasing
      if (isDescending) {
        // 2. - difference between two adjacent numbers >= 1
        //    - AND difference between two adjacent numbers <= 3
        const descDifference = prev - num;
        newDescending = descDifference >= 1 && descDifference <= 3;
      }

      return {
        prev: num,
        isAscending: newAscending,
        isDescending: newDescending,
      };
    },
    { prev: undefined, isAscending: true, isDescending: true }
  );

const isSafeWithTolerance1 = (array, indexToIgnore, lastIndex) => {
  // base case (end of array)
  if (indexToIgnore > lastIndex) {
    return false;
  }
  const state = getReportState(
    array.slice(0, indexToIgnore).concat(array.slice(indexToIgnore + 1))
  );

  return state.isAscending || state.isDescending
    ? true
    : isSafeWithTolerance1(array, indexToIgnore + 1, lastIndex);
};

// get data from file
// split into reports (lines)
const data = readFileSync(join(__dirname, "input.txt"), "utf8")
  .trimEnd()
  .split("\n");

// iterate over reports
const sum = data.reduce((sum, reportString) => {
  const report = reportString.split(/\s+/);

  // check each report base is safe:
  const state = getReportState(report);
  const isBaseSafe = state.isAscending || state.isDescending;

  // get the sum of safe reports
  // check if report is safe with tolerance 1, if it's base is not safe
  return isBaseSafe || isSafeWithTolerance1(report, 0, report.length - 1)
    ? sum + 1
    : sum;
}, 0);

console.log(sum);
