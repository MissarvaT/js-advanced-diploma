export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    if (new.target.name === 'Character') {
      throw new Error('Character cannot be created');
    }
  }

  levelUp() {
    this.level += 1;
    this.health = Math.min(this.health + 80, 100);
    this.attack = Math.max(this.attack, this.attack * (1.8 - this.health / 100));
    this.defence = Math.max(this.defence, this.defence * (1.8 - this.health / 100));
  }
}
