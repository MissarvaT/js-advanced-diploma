/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-return-assign */
import GamePlay from './GamePlay'
import themes from './themes';
import GameState from './GameState';
import { generateTeam } from './generators';
import cursors from './cursors';
import Character from './characters/Character';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import { calcTileType } from './utils';
import cellDeterminer from './cellDeterminer';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.computerTeam = [];
    this.playerTeam = [];
    this.teams = [...this.computerTeam, ...this.playerTeam];
    this.playerScore = 0;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));

    this.gamePlay.drawUi('prairie');
    const computerTeam = generateTeam([Daemon, Undead, Vampire], 1, 2, this.gamePlay.cells);
    this.computerTeam = computerTeam;
    const playerTeam = generateTeam([Bowman, Swordsman], 1, 2, this.gamePlay.cells);
    this.playerTeam = playerTeam;
    this.teams = [...this.computerTeam, ...this.playerTeam];
    this.gamePlay.redrawPositions(this.teams);

    this.gameState.activePlayer = 'player';
    this.gameState.selectedCharacter = 0;
    this.gameState.level = 1;
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.gamePlay.cells[index].firstChild !== null
      && (this.gamePlay.cells[index].firstChild.classList.contains('bowman')
      || this.gamePlay.cells[index].firstChild.classList.contains('swordsman')
      || this.gamePlay.cells[index].firstChild.classList.contains('magician'))) {
      this.gamePlay.cells.forEach((cell) => cell.classList.remove(...Array.from(cell.classList)
        .filter((o) => o.startsWith('selected'))));
      this.gamePlay.selectCell(index);
      this.gameState.selectedCharacter = this.gamePlay.cells[index];
    }
    else if (this.gameState.selectedCharacter === 0
      && this.gamePlay.cells[index].firstChild !== null
      && (this.gamePlay.cells[index].firstChild.classList.contains('daemon')
      || this.gamePlay.cells[index].firstChild.classList.contains('undead')
      || this.gamePlay.cells[index].firstChild.classList.contains('vampire'))) {
      GamePlay.showError('Невозможно выбрать персонажа!');
    }
    else if (this.gameState.selectedCharacter !== 0 && this.gamePlay.cells[index].firstChild === null) {
      this.move(index);
    }
    else if (this.gameState.selectedCharacter !== 0
      && this.gamePlay.cells[index].firstChild !== null
      && (this.gamePlay.cells[index].firstChild.classList.contains('daemon')
      || this.gamePlay.cells[index].firstChild.classList.contains('undead')
      || this.gamePlay.cells[index].firstChild.classList.contains('vampire'))) {
      this.attack(index);
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const positionedCharacter = this.teams.find((el) => el.position === index);
    if (this.gamePlay.cells[index].firstChild !== null) {
      const { character } = positionedCharacter;
      this.gamePlay.showCellTooltip(`\u{1F396}${character.level}\u{2694}${character.attack}\u{1F6E1}${character.defence}\u{2764}${character.health}`, index);
    }
    if (this.gameState.selectedCharacter === 0 && this.gamePlay.cells[index].firstChild !== null
      && (this.gamePlay.cells[index].firstChild.classList.contains('bowman')
      || this.gamePlay.cells[index].firstChild.classList.contains('swordsman')
      || this.gamePlay.cells[index].firstChild.classList.contains('magician'))) {
      this.gamePlay.setCursor(cursors.pointer);
    }

    if (this.gameState.selectedCharacter !== 0) {
      const selectedCell = this.gamePlay.cells.find((el) => el.classList.contains('selected-yellow'));
      const i = this.gamePlay.cells.indexOf(selectedCell);
      const character = this.teams.find((el) => el.position === i);
      const cellsForAttack = cellDeterminer(character.position, character.character.attackDistance, this.gamePlay.cells);
      const cellsForMove = cellDeterminer(character.position, character.character.stepDistance, this.gamePlay.cells);
      if (cellsForMove.includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      }
      if (cellsForAttack.includes(index) && this.gamePlay.cells[index].firstChild !== null
      && ((this.gamePlay.cells[index].firstChild.classList.contains('daemon'))
      || (this.gamePlay.cells[index].firstChild.classList.contains('undead'))
      || (this.gamePlay.cells[index].firstChild.classList.contains('vampire')))) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      }
      if (!(cellsForMove.includes(index) || cellsForAttack.includes(index))) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
      if (this.gamePlay.cells[index].firstChild !== null
        && (this.gamePlay.cells[index].firstChild.classList.contains('bowman')
      || this.gamePlay.cells[index].firstChild.classList.contains('swordsman')
      || this.gamePlay.cells[index].firstChild.classList.contains('magician'))) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    if (this.gamePlay.cells[index].classList.contains('selected-green')) {
      this.gamePlay.cells[index].classList.remove('selected-green');
    }
    if (this.gamePlay.cells[index].classList.contains('selected-red')) {
      this.gamePlay.cells[index].classList.remove('selected-red');
    }
    if (this.gameState.selectedCharacter === 0 && this.gamePlay.cells[index].firstChild !== null
      && (this.gamePlay.cells[index].firstChild.classList.contains('bowman')
      || this.gamePlay.cells[index].firstChild.classList.contains('swordsman')
      || this.gamePlay.cells[index].firstChild.classList.contains('magician'))) {
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  move(index) {
    const selectedCell = this.gamePlay.cells.find((el) => el.classList.contains('selected-yellow'));
    const i = this.gamePlay.cells.indexOf(selectedCell);
    const character = this.teams.find((el) => el.position === i);
    const possibleSteps = cellDeterminer(character.position, character.character.stepDistance, this.gamePlay.cells);
    if (possibleSteps.includes(index) && this.gamePlay.cells[index].firstChild === null) {
      character.position = index;
      this.gamePlay.deselectCell(i);
      this.gamePlay.redrawPositions(this.teams);
      this.gameState.selectedCharacter = 0;
      this.gamePlay.deselectCell(index);
      this.gamePlay.setCursor(cursors.auto);
      if (this.gameState.activePlayer === 'computer') {
        this.gameState.activePlayer = 'player';
      } else if (this.gameState.activePlayer === 'player') {
        this.endCheck();
        this.gameState.activePlayer = 'computer';
        this.computerTurn();
      }
    }
  }

  attack(index) {
    const selectedCell = this.gamePlay.cells.find((el) => el.classList.contains('selected-yellow'));
    const i = this.gamePlay.cells.indexOf(selectedCell);
    const character = this.teams.find((el) => el.position === i);
    const possibleAttacks = cellDeterminer(character.position, character.character.attackDistance, this.gamePlay.cells);
    const target = this.teams.find((el) => el.position === index);
    if (possibleAttacks.includes(target.position)) {
      const damage = Math.max(character.character.attack - target.character.defence, character.character.attack * 0.1);
      this.gamePlay.showDamage(index, damage);
      target.character.health -= damage;
      if (target.character.health <= 0) {
        if (this.gameState.activePlayer === 'player') {
          this.computerTeam = this.computerTeam.filter((el) => el.position !== target.position);
        }
        if (this.gameState.activePlayer === 'computer') {
          this.playerTeam = this.playerTeam.filter((el) => el.position !== target.position);
        }
        this.teams = this.teams.filter((el) => el.position !== target.position);
      }
      this.gamePlay.cells.forEach((cell) => cell.classList.remove(...Array.from(cell.classList)
        .filter((o) => o.startsWith('selected'))));
      this.gamePlay.redrawPositions(this.teams);
      this.gameState.selectedCharacter = 0;
      if (this.gameState.activePlayer === 'computer') {
        this.gameState.activePlayer = 'player';
      } else if (this.gameState.activePlayer === 'player') {
        this.gamePlay.setCursor(cursors.auto);
        this.endCheck();
        if (this.computerTeam.length > 0) {
          this.gameState.activePlayer = 'computer';
          this.computerTurn();
        }
      }
    }
  }

  computerTurn() {
    function compareHealth(character1, character2) {
      if (character1.character.health > character2.character.health) return -1;
      if (character1.character.health === character2.character.health) return 0;
      if (character1.character.health < character2.character.health) return 1;
    }
    function getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    let activeCharacter;
    if (this.computerTeam.length > 0) {
      this.computerTeam.sort(compareHealth);
      [activeCharacter] = this.computerTeam;
    } else {
      this.endCheck();
      this.computerTeam.sort(compareHealth);
      [activeCharacter] = this.computerTeam;
    }
    const selectedCell = this.gamePlay.cells.find((cell) => this.gamePlay.cells.indexOf(cell) === activeCharacter.position);
    this.gamePlay.selectCell(this.gamePlay.cells.indexOf(selectedCell));
    const { attackDistance } = activeCharacter.character;
    let indexes = cellDeterminer(activeCharacter.position, attackDistance, this.gamePlay.cells);
    let cellsForAttack = [];
    indexes.forEach((index) => {
      cellsForAttack.push(this.gamePlay.cells[index]);
    });
    cellsForAttack = cellsForAttack.filter((cell) => cell.firstChild !== null);
    const charactersForAttack = [];
    cellsForAttack.forEach((cell) => {
      const character = this.teams.find((ch) => ch.position === this.gamePlay.cells.indexOf(cell));
      if (character.character instanceof Swordsman || character.character instanceof Bowman || character.character instanceof Magician) {
        charactersForAttack.push(character);
      }
    });
    if (charactersForAttack.length > 0) {
      charactersForAttack.sort(compareHealth);
      const characterForAttack = charactersForAttack[charactersForAttack.length - 1];
      const { position } = characterForAttack;
      this.attack(position);
    }
    if (charactersForAttack.length === 0) {
      const { stepDistance } = activeCharacter.character;
      indexes = cellDeterminer(activeCharacter.position, stepDistance, this.gamePlay.cells);
      let index = getRandom(0, indexes.length);
      while (this.gamePlay.cells[indexes[index]].firstChild !== null) {
        index = getRandom(0, indexes.length);
      }
      this.move(indexes[index]);
    }
    this.endCheck();
  }

  endCheck() {
    if (this.playerTeam.length === 0) {
      GamePlay.showMessage('Game over!');
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    } else if (this.computerTeam.length === 0 && this.gameState.level < 4) {
      GamePlay.showMessage('Congrats! You have won this level!');
      this.gameState.level += 1;
      this.gameLoop();
    } else if (this.computerTeam.length === 0 && this.gameState.level === 4) {
      this.gameState.activePlayer = 0;
      GamePlay.showMessage('Congrats! You have won the game!');
      if (this.playerScore > this.gameState.maxScore) {
        this.gameState.maxScore = this.playerScore;
      }
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    }
  }

  gameLoop() {
    this.playerTeam.forEach((character) => this.playerScore += character.character.health);
    this.playerTeam.forEach((character) => character.character.levelUp());
    const currentLevel = themes.find((theme) => theme.level === this.gameState.level);
    this.gamePlay.drawUi(currentLevel.name);

    if (this.gameState.level === 2) {
      const newPlayerCharacter = generateTeam([Bowman, Swordsman, Magician], 1, 1, this.gamePlay.cells);
      this.playerTeam = [...this.playerTeam, ...newPlayerCharacter];
      this.computerTeam = generateTeam([Daemon, Undead, Vampire], 2, this.playerTeam.length, this.gamePlay.cells);
    } else if (this.gameState.level === 3) {
      const newPlayerCharacters = generateTeam([Bowman, Swordsman, Magician], 2, 2, this.gamePlay.cells);
      this.playerTeam = [...this.playerTeam, ...newPlayerCharacters];
      this.computerTeam = generateTeam([Daemon, Undead, Vampire], 2, this.playerTeam.length, this.gamePlay.cells);
    } else if (this.gameState.level === 4) {
      const newPlayerCharacters = generateTeam([Bowman, Swordsman, Magician], 3, 2, this.gamePlay.cells);
      this.playerTeam = [...this.playerTeam, ...newPlayerCharacters];
      this.computerTeam = generateTeam([Daemon, Undead, Vampire], 4, this.playerTeam.length, this.gamePlay.cells);
    }

    const originalPlayersCells = [];
    for (let i = 0; i < this.gamePlay.cells.length; i += 1) {
      if (i % 8 === 0 || (i - 1) % 8 === 0) {
        originalPlayersCells.push(i);
      }
    }
    function getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    const newCharactersPositions = new Set();
    while (newCharactersPositions.size < this.playerTeam.length) {
      for (let i = 0; i < this.playerTeam.length; i += 1) {
        const index = getRandom(0, originalPlayersCells.length);
        newCharactersPositions.add(originalPlayersCells[index]);
      }
      for (let i = 0; i < this.playerTeam.length; i += 1) {
        const newPositions = Array.from(newCharactersPositions);
        this.playerTeam[i].position = newPositions[i];
      }
    }
    this.teams = [...this.computerTeam, ...this.playerTeam];
    this.gamePlay.redrawPositions(this.teams);
  }

  onNewGameClick() {
    console.log(this.gamePlay.cellClickListeners);
    console.log(this.gamePlay.cellClickListeners);
    console.log(this.gamePlay.cellClickListeners);

    if (this.gamePlay.cellClickListeners === [] && this.gamePlay.cellEnterListeners === [] && this.gamePlay.cellLeaveListeners === []) {
      console.log('it works')
      this.gamePlay.addCellEnterListener(this.onCellEnter(this));
      this.gamePlay.addCellClickListener(this.onCellClick(this));
      this.gamePlay.addCellLeaveListener(this.onCellLeave(this));
    }
    this.gamePlay.drawUi('prairie');
    const computerTeam = generateTeam([Daemon, Undead, Vampire], 1, 2, this.gamePlay.cells);
    this.computerTeam = computerTeam;
    const playerTeam = generateTeam([Bowman, Swordsman], 1, 2, this.gamePlay.cells);
    this.playerTeam = playerTeam;
    this.teams = [...this.computerTeam, ...this.playerTeam];
    this.gamePlay.redrawPositions(this.teams);

    this.gameState.activePlayer = 'player';
    this.gameState.selectedCharacter = 0;
    this.gameState.level = 1;
  }

  onSaveGameClick() {
    this.stateService.save(this.gameState);
  }

  onLoadGameClick() {
    this.gameState = GameState.from(this.stateService.load());
  }
}
