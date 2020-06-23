export default function cellDeterminer(index, maxDistance, cells) {
  let possibleIndexes = [];
  
  const leftmostElement = cells.find(el => cells.indexOf(el) % 8 === 0 && index - cells.indexOf(el) < 8);
  let leftmostIndex = cells.indexOf(leftmostElement);
  const rightmostElement = cells.find(el => (cells.indexOf(el)+1) % 8 === 0 && cells.indexOf(el) - index < 8 && cells.indexOf(el) - index >= 0);
  let rightmostIndex = cells.indexOf(rightmostElement);
  if (index > 55) {
    rightmostIndex = 63;
  }
  
  for (let i = maxDistance; i > 0; i --) {
    possibleIndexes.push(index-(8*i));
    possibleIndexes.push(index+(8*i));
  
    if (index - leftmostIndex < maxDistance) {
      j = index - leftmostIndex;
      if (j !== 0) {
        possibleIndexes.push(index-(9*j));
        possibleIndexes.push(index+(7*j));
        possibleIndexes.push(index-(1*j));
      }
      possibleIndexes.push(index-(7*i));
      possibleIndexes.push(index+(9*i));
      possibleIndexes.push(index+(1*i));
    } else if (rightmostIndex - index < maxDistance) {
      j = rightmostIndex - index;
      if (j !== 0) {
        possibleIndexes.push(index-(7*j));
        possibleIndexes.push(index+(9*j));
        possibleIndexes.push(index+(1*j));
      }
      possibleIndexes.push(index-(9*i));
      possibleIndexes.push(index+(7*i));
      possibleIndexes.push(index-(1*i));
    } else {
      possibleIndexes.push(index+(1*i));
      possibleIndexes.push(index-(1*i));
      possibleIndexes.push(index-(9*i));
      possibleIndexes.push(index-(7*i));
      possibleIndexes.push(index+(7*i));
      possibleIndexes.push(index+(9*i));
    }
      
    possibleIndexes = possibleIndexes.filter(el => el >= 0 && el <64);
    possibleIndexes = possibleIndexes.filter(el => possibleIndexes.indexOf(el) >= leftmostIndex || possibleIndexes.indexOf(el) <= index - 7);
    possibleIndexes = possibleIndexes.filter(el => possibleIndexes.indexOf(el) <= rightmostIndex || possibleIndexes.indexOf(el) >= index + 7);
  };
    return possibleIndexes;
}