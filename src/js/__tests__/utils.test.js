import {calcTileType} from '../utils';

test('returns top-left value', () => {
    const expected = 'top-left';
    const result = calcTileType(0, 8);

    expect(result).toBe(expected);
})

test('returns top-right value', () => {
    const expected = 'top-right';
    const result = calcTileType(7, 8);

    expect(result).toBe(expected);
})

test('returns top value', () => {
    const expected = 'top';
    const result = calcTileType(5, 8);

    expect(result).toBe(expected);
})

test('returns bottom-left value', () => {
    const expected = 'bottom-left';
    const result = calcTileType(56, 8);

    expect(result).toBe(expected);
})

test('returns bottom-right value', () => {
    const expected = 'bottom-right';
    const result = calcTileType(63, 8);

    expect(result).toBe(expected);
})

test('returns bottom value', () => {
    const expected = 'bottom';
    const result = calcTileType(59, 8);

    expect(result).toBe(expected);
})

test('returns left value', () => {
    const expected = 'left';
    const result = calcTileType(8, 8);

    expect(result).toBe(expected);
})

test('returns right value', () => {
    const expected = 'right';
    const result = calcTileType(23, 8);

    expect(result).toBe(expected);
})

test('returns center value', () => {
    const expected = 'center';
    const result = calcTileType(30, 8);

    expect(result).toBe(expected);
})