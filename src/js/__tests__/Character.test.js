import Character from '../characters/Character';
import Daemon from '../characters/Daemon';
import Bowman from '../characters/Bowman';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

test('creates new character', () => {
    const bowman = new Bowman(1);
    expect(bowman).toEqual({
        level: 1, 
        attack: 25,
        defence: 25,
        health: 50,
        stepDistance: 2,
        attackDistance: 2,
        type: 'bowman'
      })
});

test('creates new character', () => {
    const daemon = new Daemon(1);
    expect(daemon).toEqual({
        level: 1, 
        attack: 10,
        defence: 40,
        health: 50,
        stepDistance: 1,
        attackDistance: 4,
        type: 'daemon'
      })
});

test('creates new character', () => {
    const magician = new Magician(1);
    expect(magician).toEqual({
        level: 1, 
        attack: 10,
        defence: 40,
        health: 50,
        stepDistance: 1,
        attackDistance: 4,
        type: 'magician'
      })
});

test('creates new character', () => {
    const swordsman = new Swordsman(1);
    expect(swordsman).toEqual({
        level: 1, 
        attack: 40,
        defence: 10,
        health: 50,
        stepDistance: 4,
        attackDistance: 1,
        type: 'swordsman'
      })
});

test('creates new character', () => {
    const undead = new Undead(1);
    expect(undead).toEqual({
        level: 1, 
        attack: 40,
        defence: 10,
        health: 50,
        stepDistance: 4,
        attackDistance: 1,
        type: 'undead'
      })
});

test('creates new character', () => {
    const vampire = new Vampire(1);
    expect(vampire).toEqual({
        level: 1, 
        attack: 25,
        defence: 25,
        health: 50,
        stepDistance: 2,
        attackDistance: 2,
        type: 'vampire'
      })
});

test('throws Error', () => {
    expect(() => {
        const character = new Character(1);
    }).toThrow('Character cannot be created')
})