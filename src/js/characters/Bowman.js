import Character from './Character';

export default class Bowman extends Character {
    constructor(...args) {
      super(...args);
      this.attack = 25;
      this.defence = 25;
      this.stepDistance = 2;
      this.attackDistance = 2;
    }
  }