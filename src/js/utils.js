/* eslint-disable consistent-return */
export function calcTileType(index, boardSize) {
  // TODO: write logic here
  while (index < boardSize ** 2) {
    if (index === 0) {
      return 'top-left';
    }
    if (index === 7) {
      return 'top-right';
    }
    if (index > 0 && index < 7) {
      return 'top';
    }
    if (index === 56) {
      return 'bottom-left';
    }
    if (index === 63) {
      return 'bottom-right';
    } if (index > 56 && index < 63) {
      return 'bottom';
    }
    if (index % 8 === 0) {
      return 'left';
    }
    if ((index + 1) % 8 === 0) {
      return 'right';
    }
    return 'center';
  }
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
