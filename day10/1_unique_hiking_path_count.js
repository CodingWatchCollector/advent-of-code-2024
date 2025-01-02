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

// const directionsWithoutTop = allDirections.filter((d) => d !== top);
// const directionsWithoutRight = allDirections.filter((d) => d !== right);
// const directionsWithoutBottom = allDirections.filter((d) => d !== bottom);
// const directionsWithoutLeft = allDirections.filter((d) => d !== left);
// const nextDirectionState = {
//   fromTop: directionsWithoutTop,
//   fromRight: directionsWithoutRight,
//   fromBottom: directionsWithoutBottom,
//   fromLeft: directionsWithoutLeft,
// };

const getReachablePath = ({ row, col, val, path }) => {
  const currentPoint = `${row},${col}`;
  if (val === 9) return currentPoint;
  // record the path, so we can add points to the reacheable points
  const nextPath = path.concat(currentPoint);
  const nextPoints = allDirections.map((direction) => {
    const newRow = row + direction[0];
    const newCol = col + direction[1];
    // get each possible path (increasing by 1 only)
    return data[newRow]?.[newCol] === val + 1
      ? getReachablePath({
          row: newRow,
          col: newCol,
          val: val + 1,
          path: nextPath,
        })
      : null;
  });
  return nextPoints.filter((p) => p !== null && p.length !== 0);
};

const { reachablePathsCount } = startingPointsArray.reduce(
  (globalAcc, currentStartingPoint) => {
    const { 0: row, 1: col } = currentStartingPoint
      .split(",")
      .map((str) => parseInt(str, 10));
    const vals = getReachablePath({ row, col, val: 0, path: [] });
    return {
      reachablePathsCount:
        vals.length !== 0
          ? globalAcc.reachablePathsCount + new Set(vals.flat(9)).size
          : globalAcc.reachablePathsCount,
    };
  },
  { reachablePathsCount: 0 }
);
console.log(reachablePathsCount);

// BONUS: possible optimizations
// OPT: never check the previous point
// OPT: create a map of end points and the points that lead to them (to avoid same checks)
