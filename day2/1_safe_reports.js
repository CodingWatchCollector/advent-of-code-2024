const { readFileSync } = require("fs");

const { join } = require("path");

// get data from file
// split into reports (lines)
const data = readFileSync(join(__dirname, "input.txt"), "utf8")
  .trimEnd()
  .split("\n");

// iterate over reports
const sum = data.reduce((sum, report) => {
  // check each report is safe
  const state = report.split(/\s+/).reduce(
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

  // get the sum of safe reports
  return state.isAscending || state.isDescending ? sum + 1 : sum;
}, 0);

console.log(sum);
