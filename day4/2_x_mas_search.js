const { readFileSync } = require("fs");
const { join } = require("path");

// row is Y axis and col is X axis

// get the data from the file
// split it into lines
// split each line into chars
const data = readFileSync(join(__dirname, "input.txt"), "utf8")
  .trimEnd()
  .split("\n")
  .map((line) => line.split(""));
const dataLength = data.length - 1;
const dataWidth = data[0].length - 1;

const sum = data.reduce((sum, row, rowIndex) => {
  // abandon impossible cases
  // first or last row
  if (rowIndex === dataLength || rowIndex === 0) {
    return sum;
  }
  const lineMatches = row.reduce((rowSum, currChar, colIndex) => {
    // Find the "A" char
    if (currChar !== "A") {
      return rowSum;
    }
    // abandon impossible cases
    // first or last col
    if (colIndex === dataWidth || colIndex === 0) {
      return rowSum;
    }
    // get opposite corner pairs
    const pairs = [
      `${data[rowIndex - 1][colIndex - 1]}${data[rowIndex + 1][colIndex + 1]}`,
      `${data[rowIndex - 1][colIndex + 1]}${data[rowIndex + 1][colIndex - 1]}`,
    ];

    // check opposite corners have 1 "M" and 1 "S"
    // add 1 if true
    return pairs.every((pair) => pair === "MS" || pair === "SM")
      ? rowSum + 1
      : rowSum;
  }, 0);
  return sum + lineMatches;
}, 0);

// get the sum of all matches
console.log(sum);
