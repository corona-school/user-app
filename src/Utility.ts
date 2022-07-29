export const TIME_THRESHOLD = 2 * 60 * 60 * 1000

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

const Utility = { toTimerString, TIME_THRESHOLD }
export default Utility
