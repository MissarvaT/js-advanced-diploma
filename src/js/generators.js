/* eslint-disable no-param-reassign */
/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

export function* characterGenerator(allowedTypes, maxLevel) {
  function getRandomIndex(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const index = getRandomIndex(0, allowedTypes.length);
  const character = new allowedTypes[index]();

  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const level = getRandomIntInclusive(1, maxLevel);
  character.level = level;
  yield character;
}

export function generateTeam(allowedTypes, maxLevel, characterCount, field) {
  const characters = [];
  while (characters.length < characterCount) {
    const generator = characterGenerator(allowedTypes, maxLevel);
    const character = generator.next();
    characters.push(character.value);
  }

  function getRandomCells() {
    const playersCellsIndexes = [];

    if (allowedTypes.includes(Bowman)
    || allowedTypes.includes(Swordsman)
    || allowedTypes.includes(Magician)) {
      for (let i = 0; i < field.length; i += 1) {
        if (i % 8 === 0 || (i - 1) % 8 === 0) {
          playersCellsIndexes.push(i);
        }
      }
    }
    if (allowedTypes.includes(Daemon)
    || allowedTypes.includes(Undead)
    || allowedTypes.includes(Vampire)) {
      for (let i = 0; i < field.length; i += 1) {
        if ((i + 1) % 8 === 0 || (i + 2) % 8 === 0) {
          playersCellsIndexes.push(i);
        }
      }
    }
    function getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    const fieldIndexes = new Set();
    while (fieldIndexes.size < characterCount) {
      const randomIndex = getRandom(0, playersCellsIndexes.length);
      const fieldIndex = playersCellsIndexes[randomIndex];
      fieldIndexes.add(fieldIndex);
    }

    return Array.from(fieldIndexes);
  }

  const positionedCharacters = [];
  const indexes = getRandomCells();
  for (let i = 0; i < characters.length; i += 1) {
    const positionedCharacter = new PositionedCharacter(characters[i], indexes[i]);
    positionedCharacters.push(positionedCharacter);
  }
  return positionedCharacters;
}
