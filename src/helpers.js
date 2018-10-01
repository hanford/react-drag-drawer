export function isDirectionTop (direction) {
  return direction === 'top'
}

export function isDirectionBottom (direction) {
  return direction === 'bottom'
}

export function isDirectionLeft (direction) {
  return direction === 'left'
}

export function isDirectionRight (direction) {
  return direction === 'right'
}

export function isClientSide () {
  return typeof window !== 'undefined'
}
