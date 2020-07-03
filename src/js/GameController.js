/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-return-assign */
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
    this.gamePlay.addCellEnterListeners(this.onCellEnter.bind(this));
    this.gameplay.addCellClickListeners(this.onCellClick.bind(this));
    this.gameplay.addcellLeaveListeners(this.onCellLeave.bind(this));
    this.gameplay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gameplay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gameplay.addLoadGameListener(this.onLoadGameClick.bind(this));

    this.gamePlay.drawUi('prairie');
    const computerTeam = generateTeam([Daemon, Undead, Vampire], 1, 2, this.gamePlay.cells);
    this.computerTeam = computerTeam;
    const playerTeam = generateTeam([Bowman, Swordsman], 1, 2, this.gamePlay.cells);
    this.playerTeam = playerTeam;
    this.gamePlay.redrawPositions(this.teams);

    this.gameState.activePlayer = 'player';
    this.gameState.selectedCharacter = 0;
    this.gameState.level = 1;
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.gamePlay.cells[index].character instanceof Bowman
      || this.gamePlay.cells[index].character instanceof Swordsman
      || this.gamePlay.cells[index].character instanceof Magician) {
      this.gamePlay.cells.forEach((cell) => cell.classList.remove(...Array.from(cell.classList)
        .filter((o) => o.startsWith('selected'))));
      this.gamePlay.selectCell(index);
      this.gameState.selectedCharacter = this.gamePlay.cells[index];
    }
    if (this.gameState.selectedCharacter === 0 && (this.gamePlay.cells[index].character instanceof Daemon
      || this.gamePlay.cells[index].character instanceof Undead
      || this.gamePlay.cells[index].character instanceof Vampire)) {
      this.gamePlay.showError('Невозможно выбрать персонажа!');
    }
    if (this.gameState.selectedCharacter !== 0 && !(this.gamePlay.cells[index].character instanceof Character)) {
      this.move(index);
    }
    if (this.gameState.selectedCharacter !== 0 && (this.gamePlay.cells[index].character instanceof Daemon
      || this.gamePlay.cells[index].character instanceof Undead
      || this.gamePlay.cells[index].character instanceof Vampire)) {
      this.attack(index);
    }

    this.endCheck();
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gamePlay.cells[index].character instanceof Character) {
      const { character } = this.gamePlay.cells[index].character;
      this.gamePlay.showCellTooltip(`\u{1F396}${character.level}\u{2694}${character.attack}\u{1F6E1}${character.defence}\u{2764}${character.health}`, index);
    }

    if (this.gameState.selectedCharacter !== 0 && this.gameState.activePlayer === 'player') {
      const cellsForAttack = cellDeterminer(this.gameState.selectedCharacter.position, this.gameState.selectedCharacter.character.attackDistance, this.gamePlay.cells);
      const cellsForMove = cellDeterminer(this.gameState.selectedCharacter.position, this.gameState.selectedCharacter.character.stepDistance, this.gamePlay.cells);
      if (cellsForMove.includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      }
      const { character } = this.gamePlay.cells[index];
      if (cellsForAttack.includes(index) && ((character instanceof Daemon) || (character instanceof Undead) || (character instanceof Vampire))) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      }
      if (!(cellsForMove.includes(index) && cellsForAttack.includes(index))) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  move(index) {
    const character = this.gameState.selectedCharacter;
    const possibleSteps = cellDeterminer(character.position, character.character.stepDistance, this.gamePlay.cells);
    if (possibleSteps.includes(index)) {
      character.position = index;
      this.gamePlay.cells.forEach((cell) => cell.classList.remove(...Array.from(cell.classList)
        .filter((o) => o.startsWith('selected'))));
      this.gamePlay.redrawPosition(this.teams);
      if (this.gameState.activePlayer === 'computer') {
        this.gameState.activePlayer = 'player';
      } else if (this.gameState.activePlayer === 'player') {
        this.gameState.activePlayer = 'computer';
      }
      this.gameState.selectedCharacter = 0;
    }
  }

  attack(index) {
    const character = this.gameState.selectedCharacter;
    const possibleAttacks = cellDeterminer(character.position, character.character.attackDistance, this.gamePlay.cells);
    const target = this.gamePlay.cells[index];
    if (possibleAttacks.includes(target.position)) {
      const damage = Math.max(character.character.attack - target.character.defence, character.character.attack * 0.1);
      this.gamePlay.showDamage(index, damage);
      target.character.health -= damage;
      // ?убедиться, что анимация идет до конца
      this.checkDeath(target);
      this.gamePlay.redrawPositions(this.teams);
      if (this.gameState.activePlayer === 'computer') {
        this.gameState.activePlayer = 'player';
      } else if (this.gameState.activePlayer === 'player') {
        this.gameState.activePlayer = 'computer';
      }
      this.gameState.selectedCharacter = 0;
    }
  }

  computerTurn() {
    // сделать логику лучше, если успею
    function compareHealth(character1, character2) {
      if (character1.health > character2.health) return -1;
      if (character1.health === character2.health) return 0;
      if (character1.health < character2.health) return 1;
    }
    function getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    this.computerTeam.sort(compareHealth);
    const activeCharacter = this.computerTeam[0];
    this.gameState.selectedCharacter = activeCharacter;
    const { attackDistance } = activeCharacter.character;
    let indexes = cellDeterminer(activeCharacter.position, attackDistance, this.gamePlay.cells);
    const cellsForAttack = [];
    indexes.forEach((index) => {
      cellsForAttack.push(this.gamePlay.cells[index]);
    });
    cellsForAttack.filter((cell) => cell.character instanceof Swordsman || cell.character instanceof Bowman || cell.character instanceof Bowman);
    if (cellsForAttack > 0) {
      cellsForAttack.sort(compareHealth);
      const characterForAttack = cellsForAttack[cellsForAttack.length];
      const { position } = characterForAttack;
      this.attack(position);
    }
    if (cellsForAttack.length === 0) {
      const { stepDistance } = activeCharacter;
      indexes = cellDeterminer(activeCharacter.position, stepDistance, this.gamePlay.cells);
      const index = getRandom(0, indexes.length);
      this.move(index);
    }
  }

  checkDeath(character) {
    if (character.character.health <= 0) {
      let cell = this.gamePlay.cells[character.position];
      cell = document.createElement('div');
      cell.classList.add('cell', 'map-tile', `map-tile-${calcTileType(character.position, this.boardSize)}`);
      cell.addEventListener('mouseenter', (event) => this.onCellEnter(event));
      cell.addEventListener('mouseleave', (event) => this.onCellLeave(event));
      cell.addEventListener('click', (event) => this.onCellClick(event));
    }
  }

  endCheck() {
    if (this.playerTeam.length === 0) {
      alert('Game over!');
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    } else if (this.computerTeam.length === 0 && this.gameState.level < 4) {
      alert('Congrats! You have won this level!');
      this.gameState.level += 1;
      this.gameLoop();
    } else if (this.computerTeam.length === 0 && this.gameState.level === 4) {
      alert('Congrats! You have won the game!');
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
    this.gamePlay.redrawPositions(this.teams);
  }

  onNewGameClick() {
    this.init();
  }

  onSaveGameClick() {
    this.stateService.save(this.gameState);
  }

  onLoadGameClick() {
    this.gameState = GameState.from(this.stateService.load());
  }
}
