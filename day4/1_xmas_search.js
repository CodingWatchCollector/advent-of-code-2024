const { readFileSync } = require("fs");
const { join } = require("path");

// row is Y axis and col is X axis
// search to the left [-1, 0]
// search to the right [1, 0]
// search to the top [0, -1]
// search to the bottom [0, 1]
// search to the left top [-1, -1]
// search to the right top [1, -1]
// search to the left bottom [-1, 1]
// search to the right bottom [1, 1]
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];
const searchWordArray = ["X", "M", "A", "S"];

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
  const lineMatches = row.reduce((rowSum, currChar, colIndex) => {
    // find the "X" char
    if (currChar !== "X") {
      return rowSum;
    }
    //search for each next char for every direction
    const matches = directions.reduce(
      (directionsSum, { 0: colOffset, 1: rowOffset }) => {
        // abandon impossible directions
        if (
          (rowOffset === -1 && rowIndex < 3) ||
          (rowOffset === 1 && rowIndex > dataLength - 3) ||
          (colOffset === -1 && colIndex < 3) ||
          (colOffset === 1 && colIndex > dataWidth - 3)
        ) {
          return directionsSum;
        }

        // check if each char from search array is in the right position
        const isMatch = searchWordArray.every(
          (searchChar, index) =>
            searchChar ===
            data[rowIndex + rowOffset * index][colIndex + colOffset * index]
        );
        // add 1 for each match
        return isMatch ? directionsSum + 1 : directionsSum;
      },
      0
    );
    return rowSum + matches;
  }, 0);
  return sum + lineMatches;
}, 0);

// get the sum of all matches
console.log(sum);
