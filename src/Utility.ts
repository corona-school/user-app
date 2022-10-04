import { ClassRange } from './types/lernfair/SchoolClass'

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

export const intToClassRange: (num: number) => ClassRange = (num: number) => {
  let minClass = 0
  let maxClass = 0

  switch (num) {
    case 1:
      minClass = 1
      maxClass = 4
      break
    case 2:
      minClass = 5
      maxClass = 8
      break
    case 3:
      minClass = 9
      maxClass = 10
      break
    case 4:
      minClass = 11
      maxClass = 13
      break
  }

  return { min: minClass, max: maxClass } as ClassRange
}

const Utility = { createToken, toTimerString, TIME_THRESHOLD, intToClassRange }
export default Utility
