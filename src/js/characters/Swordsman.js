import Character from './Character';

export default class Swordsman extends Character {
    constructor(...args) {
      super(...args);
      this.attack = 25;
      this.defence = 25;
      this.stepDistance = 4;
      this.attackDistance = 1;
    }
  }