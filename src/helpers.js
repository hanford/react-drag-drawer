export function isDirectionVertical (direction) {
  return direction === 'y'
}

export function isClientSide () {
  return typeof window !== 'undefined'
}
