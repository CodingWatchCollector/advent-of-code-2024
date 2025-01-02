const { readFileSync } = require("fs");
const { join } = require("path");

// get the data
// transform into columns and rows (array of arrays of numbers)
// & get the starting points
const { data, startingPointsArray } = readFileSync(
  join(__dirname, "input.txt"),
  "utf8"
)
  .trimEnd()
  .split("\n")
  .reduce(
    (acc, line, lineIndex) => {
      const { lineSplited, lineStartingPoints } = line.split("").reduce(
        (lineAcc, point, pointIndex) => {
          const pointValue = parseInt(point, 10);
          return {
            lineSplited: lineAcc.lineSplited.concat(pointValue),
            lineStartingPoints:
              pointValue === 0
                ? lineAcc.lineStartingPoints.concat(pointIndex)
                : lineAcc.lineStartingPoints,
          };
        },
        { lineSplited: [], lineStartingPoints: [] }
      );
      return {
        data: acc.data.concat([lineSplited]),
        startingPointsArray: acc.startingPointsArray.concat(
          lineStartingPoints.map((pIndex) => `${lineIndex},${pIndex}`)
        ),
      };
    },
    { data: [], startingPointsArray: [] }
  );

const top = [-1, 0];
const right = [0, 1];
const bottom = [1, 0];
const left = [0, -1];
const allDirections = [top, right, bottom, left];

const getReachablePath = ({ row, col, val }) => {
  if (val === 9) return `${row},${col}`;
  const nextPoints = allDirections.map((direction) => {
    const newRow = row + direction[0];
    const newCol = col + direction[1];
    // get each possible path (increasing by 1 only)
    return data[newRow]?.[newCol] === val + 1
      ? getReachablePath({
          row: newRow,
          col: newCol,
          val: val + 1,
        })
      : null;
  });
  return nextPoints.filter((p) => p !== null).flat();
};

const { reachablePathsCount } = startingPointsArray.reduce(
  (globalAcc, currentStartingPoint) => {
    const { 0: row, 1: col } = currentStartingPoint
      .split(",")
      .map((str) => parseInt(str, 10));
    const vals = getReachablePath({ row, col, val: 0 });
    return {
      reachablePathsCount:
        vals.length !== 0
          ? globalAcc.reachablePathsCount + vals.length
          : globalAcc.reachablePathsCount,
    };
  },
  { reachablePathsCount: 0 }
);
console.log(reachablePathsCount);
