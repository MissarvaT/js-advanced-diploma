import Character from './Character';

export default class Daemon extends Character {
  constructor(level, type = 'daemon') {
    super(level, type);
    this.attack = 25;
    this.defence = 25;
    this.stepDistance = 1;
    this.attackDistance = 4;
  }
}
