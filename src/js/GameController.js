import themes from './themes';
import GamePlay from './GamePlay';
import GameState from './GameState';
import {generateTeam} from './generators';
import cursors from './cursors';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import { calcHealthLevel, calcTileType } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.computerTeam = [];
    this.playerTeam = [];
    this.teams = [];
    this.level = 1;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.addCellEnterListeners(this.onCellEnter.bind(this));
    this.gameplay.addCellClickListeners(this.onCellClick.bind(this));
    this.gameplay.addcellLeaveListeners(this.onCellLeave.bind(this));

    this.gamePlay.drawUi('prairie');
    const computerTeam = generateTeam([Daemon, Undead, Vampire], 1, 2, this.gamePlay.cells);
    this.computerTeam.push(computerTeam);
    const playerTeam = generateTeam([Bowman, Swordsman, Magician], 1, 2, this.gamePlay.cells);
    this.playerTeam.push(playerTeam);
    this.teams = computerTeam.concat(playerTeam);
    this.gamePlay.redrawPositions(teams);

    GameState.activePlayer = 'player';
    GameState.selectedCharacter = 0;
    GameState.GameController = this;

  }

  onCellClick(index) {
    // TODO: react to click
    if (GameState.activePlayer === 'player' && this.gamePlay.cells[index] instanceof Bowman || Swordsman || Magician) {
      this.gamePlay.cells.forEach(cell => cell.classList.remove(...Array.from(cell.classList)
      .filter(o => o.startsWith('selected'))); )
      this.gamePlay.selectCell(index);
      GameState.selectedCharacter = this.gamePlay.cells[index];
    }
    // если клик не по своему персонажу =>
    GameState.from(this.gamePlay);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    //проверка того, есть ли персонаж внутри
    if (this.activePlayer === 'player') {
      if (/*поле пустое и дистанция меньше или равна передвижению персонажа*/) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      };
      if (/*в поле есть персонаж врага и он на расстоянии атаки*/) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      } 
      if (/*если расстояние до персонажа больше, чем дальность атаки или клетка дальше области перехода*/) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
    if (this.gamePlay.cells[index].character instanceof Character) {
      const {character} = this.gamePlay.cells[index];
      this.gamePlay.showCellTooltip (`\u{1F396}${character.level}\u{2694}${character.attack}\u{1F6E1}${character.defence}\u{2764}${character.health}`, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  move(index) {
    if (!(this.gamePlay.cells[index] instanceof Character)) {
      const character = GameState.selected;
      const possibleSteps = cellDeterminer(character.position, character.character.stepDistance, this.gamePlay.cells);
      if (possibleSteps.includes(index)) {
        character.position = index;
      }
    }
    this.gamePlay.redrawPosition(this.teams);
    GameState.activePlayer = 'computer';
  }

  attack (index) {
    //при нажатии на не своего персонажа, CellDeterminer, если по расстоянию норм, то 
    const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
    this.gamePlay.showDamage(index, damage);
    //убедиться, что анимация идет до конца
    this.gamePlay.redrawPositions(positions);

    this.removeCharacter();
  }

    computerTurn() {
    //хз, пусть будет проходить по полю и находить всех персонажей противника, из них выбирать самого слабого, после этого атаковать и передавать ход
      function compareHealth (character1, character2) {
        if (character1.health > character2.health) return -1;
        if (character1.health == character2.health) return 0; 
        if (character1.health < character2.health) return 1; 
      };

      this.computerTeam.sort(compareHealth);
      const activeCharacter = this.computerTeam[0];
      let attackDistance = activeCharacter.attackDistance;
      const indexes = cellDeterminer(activeCharacter.position, attackDistance, this.gamePlay.cells);
      const cellsForAttack = [];
      indexes.forEach(index => {
        cellsForAttack.push(cells[index]);
      })
      cellsForAttack.filter(cell => cell instanceof Swordsman || cell instanceof Bowman || cell instanceof Bowman);
      if (cellsForAttack > 0) {
        cellsForAttack.sort(compareHealth);
      const characterForAttack = cellsForAttack[cellsForAttack.length];
      const position = characterForAttack.position;
      this.attack(position);
      };
      if (cellsForAttack.length < 1) {
        let stepDistance = activeCharacter.stepDistance;
        const indexes = cellDeterminer(27, stepDistance, /*this.gamePlay.*/cells);
        function getRandom(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min)) + min;
        };
        const length = indexes.length;
        const index = getRandom(0, length);
        activeCharacter.position = indexes[index];
      }

      this.removeCharacter();
      GameState.activePlayer = 'player';
  }


  //из пункта gameLoop 
  removeCharacter() {
    this.gamePlay.cells.forEach(cell => {
      if (cell instanceof Character && cell.character.health <= 0) {
        cell = document.createElement('div');
        cell.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
        cell.addEventListener('mouseenter', event => this.onCellEnter(event));
        cell.addEventListener('mouseleave', event => this.onCellLeave(event));
        cell.addEventListener('click', event => this.onCellClick(event));
      }
    })
  }

  //из пункта gameLoop
  endCheck() {
    if (this.playerTeam.length === 0) {
      alert 'Congrats! You win!';
    } else if (this.computerTeam.length === 0 && /*this.theme === 'mountain' или что именнно. доработать*/)) {
      alert 'Game over!'
    }
  }

  gameLoop() {


  //начислить очки в соответствии с правилами.
  //переход на новый уровень
  //генерация команд
  //this.playerCharacters.forEach(character => character.levelUp());
  }
}
