export const TIME_THRESHOLD = 2 * 60 * 60 * 1000
export const TOKEN_LENGTH = 32

export const secondsToTimerString = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`
}

export const toTimerString = (refDate: number, compareDate: number) => {
  const diff = Math.abs(compareDate / 1000 - refDate / 1000)

  const hrs = Math.floor((diff / (60 * 60)) % 24)
  const mins = Math.floor((diff / 60) % 60)

  return `${hrs.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}`
}

export const createToken = () => {
  const subLength = 8

  if (!Number.isInteger(TOKEN_LENGTH / subLength)) {
    throw new Error('TOKEN_LENGTH must be dividable by 8')
  }

  let id = ''
  for (let i = 0; i < TOKEN_LENGTH / subLength; i++) {
    id += Math.random()
      .toString(36)
      .substring(2, 2 + subLength)
  }
  return id
}

const Utility = { createToken, toTimerString, TIME_THRESHOLD }
export default Utility
