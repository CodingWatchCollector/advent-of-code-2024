const { readFileSync } = require("fs");
const { join } = require("path");

// get the data in the form of array of strings
const data = readFileSync(join(__dirname, "input.txt"), "utf8")
  .trimEnd()
  .split("\n")
  .map((line) => line.split(""));
// find the first guard position
const getRowForSymbol = (rowList, symbol) =>
  rowList.findIndex((row) => row.includes(symbol));
const getColForSymbol = (row, symbol) => row.findIndex((col) => col === symbol);
const getNextCellPosition = (direction, row, col) =>
  direction === "up"
    ? [row - 1, col]
    : direction === "down"
    ? [row + 1, col]
    : direction === "left"
    ? [row, col - 1]
    : [row, col + 1];
const getNextDirection = (direction) =>
  direction === "up"
    ? "right"
    : direction === "right"
    ? "down"
    : direction === "down"
    ? "left"
    : "up";
const GUARD_SYMBOL = "^";
const OBSTACLE_SYMBOL = "#";
const STARTING_DIRECTION = "up";
const startRow = getRowForSymbol(data, GUARD_SYMBOL);
const startCol = getColForSymbol(data[startRow], GUARD_SYMBOL);
const mapHeight = data.length;
const mapWidth = data[0].length;
const moveGuard = (data, row, col, direction) => {
  // update the current position as visited ("X")
  data[row][col] = "X";
  const { 0: nextRow, 1: nextCol } = getNextCellPosition(direction, row, col);
  // if next case is off the map, end the cycle
  if (nextRow < 0 || nextCol < 0 || nextRow >= mapHeight || nextCol >= mapWidth)
    return;
  // if next case is obstacle, turn right
  if (data[nextRow][nextCol] === OBSTACLE_SYMBOL) {
    return moveGuard(data, row, col, getNextDirection(direction));
  }
  // Else, move to the next case
  return moveGuard(data, nextRow, nextCol, direction);
};
moveGuard(data, startRow, startCol, STARTING_DIRECTION);
// count all visited positions
const visitedPositions = data.reduce(
  (acc, row) =>
    acc + row.reduce((acc, elem) => acc + (elem === "X" ? 1 : 0), 0),
  0
);
console.log(visitedPositions);
