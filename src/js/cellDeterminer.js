/* eslint-disable no-loop-func */
/* eslint-disable max-len */
export default function cellDeterminer(index, maxDistance, cells) {
  let possibleIndexes = [];

  const leftmostElement = cells.find((el) => cells.indexOf(el) % 8 === 0 && index - cells.indexOf(el) < 8);
  const leftmostIndex = cells.indexOf(leftmostElement);
  const rightmostElement = cells.find((el) => (cells.indexOf(el) + 1) % 8 === 0 && cells.indexOf(el) - index < 8 && cells.indexOf(el) - index >= 0);
  let rightmostIndex = cells.indexOf(rightmostElement);
  if (index > 55) {
    rightmostIndex = 63;
  }

  for (let i = maxDistance; i > 0; i -= 1) {
    possibleIndexes.push(index - (8 * i));
    possibleIndexes.push(index + (8 * i));
    possibleIndexes.push(index - (1 * i));
    possibleIndexes.push(index + (1 * i));
  }
  if (index - leftmostIndex < maxDistance) {
    const newDistance = index - leftmostIndex;
    for (let i = newDistance; i > 0; i -= 1) {
      possibleIndexes.push(index - (9 * i));
      possibleIndexes.push(index + (7 * i));
    }
    for (let i = maxDistance; i > 0; i -= 1) {
      possibleIndexes.push(index - (7 * i));
      possibleIndexes.push(index + (9 * i));
    }
  } else if (rightmostIndex - index < maxDistance) {
    const newDistance = rightmostIndex - index;
    for (let i = newDistance; i > 0; i -= 1) {
      possibleIndexes.push(index - (7 * i));
      possibleIndexes.push(index + (9 * i));
    }
    for (let i = maxDistance; i > 0; i -= 1) {
      possibleIndexes.push(index - (9 * i));
      possibleIndexes.push(index + (7 * i));
    }
  } else {
    for (let i = maxDistance; i > 0; i -= 1) {
      possibleIndexes.push(index - (9 * i));
      possibleIndexes.push(index - (7 * i));
      possibleIndexes.push(index + (7 * i));
      possibleIndexes.push(index + (9 * i));
    }
  }
  possibleIndexes = possibleIndexes.filter((el) => el >= 0 && el < 64);
  possibleIndexes = possibleIndexes.filter((el) => el >= leftmostIndex || el <= index - 7);
  possibleIndexes = possibleIndexes.filter((el) => el <= rightmostIndex || el >= index + 7);

  return possibleIndexes;
}
