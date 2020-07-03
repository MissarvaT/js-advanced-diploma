export default class GameState {
  constructor() {
    this.maxScore = 0;
  }

  static from(object) {
    // TODO: create object
    if (typeof (object) === 'object') {
      return object;
    }
    return null;
  }
}
