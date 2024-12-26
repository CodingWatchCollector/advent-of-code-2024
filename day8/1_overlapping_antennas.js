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
  mapRowLength,
  mapColLength,
}) =>
  row >= 0 && row < mapRowLength && col >= 0 && col < mapColLength
    ? ((overlapList, row, col) => {
        const overlapMap = overlapList.get(row);
        return overlapMap
          ? overlapList.set(row, overlapMap.add(col))
          : overlapList.set(row, new Set([col]));
      })(overlapList, row, col)
    : overlapList;

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
          const rowDifference = currentRow - point[0];
          const colDifference = currentCol - point[1];
          const closerOverlapRow = currentRow + rowDifference;
          const closerOverlapCol = currentCol + colDifference;
          const fartherOverlapRow = currentRow - 2 * rowDifference;
          const fartherOverlapCol = currentCol - 2 * colDifference;
          // if overlap is not out of the map,
          // add closerOverlap and/or fartherOverlap to the array of overlaps
          return addPointToOverlapList({
            row: closerOverlapRow,
            col: closerOverlapCol,
            overlapList: addPointToOverlapList({
              row: fartherOverlapRow,
              col: fartherOverlapCol,
              overlapList: acc,
              mapRowLength,
              mapColLength,
            }),
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
