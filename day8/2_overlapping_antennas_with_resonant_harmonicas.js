const { readFileSync } = require("fs");
const { join } = require("path");

// get data from file
const data = readFileSync(join(__dirname, "input.txt"), "utf8")
  .trimEnd()
  .split("\n");

const mapRowLength = data.length;
const mapColLength = data[0].length;

const addAllMatchesToMap = (regex, row, rowIndex, map) => {
  const match = regex.exec(row);
  const symbol = match ? match[0] : undefined;
  return symbol
    ? addAllMatchesToMap(
        regex,
        row,
        rowIndex,
        map.set(
          symbol,
          [[rowIndex, regex.lastIndex - 1]].concat(map.get(symbol) ?? [])
        )
      )
    : map;
};
// iterate over rows
const mapOfAntennas = data.reduce((map, row, rowIndex) => {
  const regex = /[^\.]/g;
  // for each symbol, that is not a dot,
  // check its position in the row and add to the map of points for each symbol Map<symbol, Array<[row, column]>>
  addAllMatchesToMap(regex, row, rowIndex, map);
  return map;
}, new Map());

const addPointToOverlapList = ({
  row,
  col,
  overlapList,
  rowDifference,
  colDifference,
  mapRowLength,
  mapColLength,
}) => {
  // get the closerOverlap
  // check if closerOverlap is not out of the map
  // if out of the map => return overlapList
  // if not => add closerOverlap to overlapList
  // call recursively with closerOverlapRow and closerOverlapCol instead of row and col
  const isWithinMap =
    row >= 0 && row < mapRowLength && col >= 0 && col < mapColLength;
  const newOverlapList = isWithinMap
    ? ((overlapList, row, col) => {
        const overlapMap = overlapList.get(row);
        return overlapMap
          ? overlapList.set(row, overlapMap.add(col))
          : overlapList.set(row, new Set([col]));
      })(overlapList, row, col)
    : overlapList;
  return isWithinMap
    ? addPointToOverlapList({
        row: row + rowDifference,
        col: col + colDifference,
        overlapList: newOverlapList,
        rowDifference,
        colDifference,
        mapRowLength,
        mapColLength,
      })
    : overlapList;
};

// recursively take the current (first) point and find all the antennas overlaps
// overlaps is a Map<row, Set<[column]>>
const getAllOverlaps = ({
  antennaArray,
  overlaps,
  mapRowLength,
  mapColLength,
}) => {
  // take the current (first) point and find all the antennas overlaps
  const { 0: currentRow, 1: currentCol } = antennaArray[0];
  const rest = antennaArray.slice(1);
  return rest.length === 0
    ? overlaps
    : getAllOverlaps({
        antennaArray: rest,
        overlaps: rest.reduce((acc, point) => {
          const nextPointRow = point[0];
          const nextPointCol = point[1];
          // if overlap is not out of the map,
          // add closerOverlap and/or fartherOverlap to the array of overlaps
          return addPointToOverlapList({
            row: currentRow,
            col: currentCol,
            overlapList: addPointToOverlapList({
              row: nextPointRow,
              col: nextPointCol,
              overlapList: acc,
              rowDifference: nextPointRow - currentRow,
              colDifference: nextPointCol - currentCol,
              mapRowLength,
              mapColLength,
            }),
            rowDifference: currentRow - nextPointRow,
            colDifference: currentCol - nextPointCol,
            mapRowLength,
            mapColLength,
          });
        }, overlaps),
        mapRowLength,
        mapColLength,
      });
};
const overlaps = [...mapOfAntennas.values()].reduce(
  (overlaps, antennaArray) =>
    getAllOverlaps({ antennaArray, overlaps, mapRowLength, mapColLength }),
  new Map()
);
console.log([...overlaps.values()].reduce((acc, map) => acc + map.size, 0));
