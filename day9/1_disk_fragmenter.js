const { readFileSync } = require("fs");
const { join } = require("path");

// get data from file
const data = readFileSync(join(__dirname, "input.txt"), "utf8").trimEnd();
// transform disk map to an array of tuples
const transformDiskMapToTupleArray = (
  diskMapString,
  regex,
  tupleArray,
  currentId
) => {
  // get the matched char
  const match = regex.exec(diskMapString);
  // if no match, return the array of tuples
  if (match === null) return tupleArray;
  // if the index of the last match is odd, the char is an ID
  // if even, the char is a '.'
  const isId = !(match.index & 1);
  // add the tuple [char, number] to the array of tuples
  // if the char is an ID, increment the currentId by 1  for the next iteration
  return transformDiskMapToTupleArray(
    diskMapString,
    regex,
    tupleArray.concat([[isId ? currentId : ".", parseInt(match[0], 10)]]),
    isId ? currentId + 1 : currentId
  );
};
// not using recursive function because it exceeds maximum call stack size :(
// const tupleArray = transformDiskMapToTupleArray(data, /./g, [], 0);
const tupleArray = [];
let currentId = 0;
for (let i = 0; i < data.length; i++) {
  const isId = !(i & 1);
  const amount = parseInt(data[i], 10);
  amount !== 0 && tupleArray.push([isId ? currentId : ".", amount]);
  if (isId) currentId++;
}
const createCharReplace = (tupleArray) => {
  const state = { currentIndex: tupleArray.length - 1, currentSubIndex: 1 };
  const getNextIdTuple = (index) => {
    const tuple = tupleArray[index];
    // if the char is '.' or amount is 0, update the currentIndex and get the next char (currentIndex - 1)
    return tuple[0] === "." || tuple[1] === 0
      ? ((state.currentIndex = index - 1), getNextIdTuple(index - 1))
      : tuple;
  };
  return {
    getReplacementChar: (tupleIndex) => {
      const { currentIndex } = state;
      // if the tuple index is greater than the current index of the reversed array, return null
      if (tupleIndex >= currentIndex) return null;
      // find the current tuple to use
      const nextIdTuple = getNextIdTuple(currentIndex);
      // if subIndex > amount, reset the subIndex and get the next char (currentIndex - 1)
      const idTupleToUse =
        state.currentSubIndex <= nextIdTuple[1]
          ? nextIdTuple
          : (((state.currentIndex = currentIndex - 1),
            (state.currentSubIndex = 1)),
            getNextIdTuple(currentIndex - 1));
      // else, get the char from the tuple and increment the subIndex
      state.currentSubIndex++;
      return idTupleToUse[0];
    },
    getReplacementIndex: () => state.currentIndex,
    getReplacementSubIndex: () => state.currentSubIndex,
  };
};
const { getReplacementChar, getReplacementIndex, getReplacementSubIndex } =
  createCharReplace(tupleArray);
// Array<[char, number]> char is the ID (number) or '.' for empty space
const getSumOfIndexes = (start, end) =>
  start < end ? start + getSumOfIndexes(start + 1, end) : 0;
// iterate over the array of tuples
const sumOfMultiplication = tupleArray.reduce(
  (acc, tuple, tupleIndex) => {
    const { currentIndex, sum } = acc;
    const replacementIndex = getReplacementIndex();
    // if the tuple index is greater than the current index of the reversed array, end the iteration
    if (tupleIndex > replacementIndex) return acc;
    // if the char is not '.', multiply the index of the character (from the acc, start at 0) by the current char
    const char = tuple[0];
    const amount = tuple[1];
    if (char !== ".") {
      const nextIndex =
        currentIndex +
        (tupleIndex === replacementIndex
          ? amount - getReplacementSubIndex() + 1 // add 1 because the starting subIndex is 1
          : amount);
      const sumOfIndexes = getSumOfIndexes(currentIndex, nextIndex);
      return {
        currentIndex: nextIndex,
        sum: sum + sumOfIndexes * char,
      };
    }
    // if the char is '.', use the char from the end of the array
    const arrayOfSubs = Array.from({ length: amount }, () => {
      const charToUse = getReplacementChar(tupleIndex);
      return charToUse;
    });
    const sumOfSubs = arrayOfSubs.reduce(
      (acc, char, i) => acc + (currentIndex + i) * char,
      0
    );
    // if the current index of '.' is greater than the current index of the reversed array, end the iteration
    // get the sum of this multiplication
    return { currentIndex: currentIndex + amount, sum: sum + sumOfSubs };
  },
  { currentIndex: 0, sum: 0 }
);
console.log(sumOfMultiplication);
