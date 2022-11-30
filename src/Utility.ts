import { LFLecture, TrafficStatus } from './types/lernfair/Course'
import { ClassRange } from './types/lernfair/SchoolClass'
import { DateTime } from 'luxon'

export const TIME_THRESHOLD = 2 * 60 * 60 * 1000
export const TOKEN_LENGTH = 32
// eslint-disable-next-line no-restricted-globals
export const REDIRECT_OPTIN = `/additional-data`
// eslint-disable-next-line no-restricted-globals
export const REDIRECT_LOGIN = `/`
// eslint-disable-next-line no-restricted-globals
export const REDIRECT_PASSWORD = `/login`

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

export const findMinMaxClassRange: (nums: number[]) => ClassRange = (
  nums: number[]
) => {
  let minClass = 13
  let maxClass = 0
  for (const n of nums) {
    const range = intToClassRange(n)
    if (range.min < minClass) minClass = range.min
    if (range.max > maxClass) maxClass = range.max
  }
  return { min: minClass, max: maxClass } as ClassRange
}

export const formatDate: (
  date: Date,
  format?: Intl.DateTimeFormatOptions,
  locale?: string
) => string = (date, format = DateTime.DATETIME_MED, locale = 'de') => {
  if (!date) return ''

  return DateTime.fromISO(date.toString()).toLocaleString(format, { locale })
}

export const handleDateString: (
  datetime: string,
  format: string,
  locale?: string,
  outputFormat?: Intl.DateTimeFormatOptions
) => string = (
  datetime,
  format,
  locale = 'de',
  outputFormat = DateTime.DATETIME_MED
) => {
  return DateTime.fromFormat(datetime, format).toLocaleString(outputFormat, {
    locale
  })
}

export const getFirstLectureFromSubcourse: (
  lectures: LFLecture[],
  pastLectures?: boolean
) => LFLecture = (lectures, pastLectures) => {
  let firstDate: DateTime = null!
  let firstLecture: LFLecture = null!

  const now = DateTime.now().toMillis()

  for (const lecture of lectures) {
    const date = DateTime.fromISO(lecture.start)

    if (!pastLectures && date.toMillis() < now) continue

    if (!firstLecture) {
      firstLecture = lecture
      firstDate = date
      continue
    }

    if (date.toMillis() < firstDate.toMillis()) {
      firstLecture = lecture
      firstDate = date
    }
  }

  return firstLecture
}

export const getTrafficStatus: (
  participants: number,
  maxParticipants: number
) => TrafficStatus = (participants = 0, maxParticipants = 0) => {
  return participants === maxParticipants
    ? 'full'
    : maxParticipants - participants <= 5
    ? 'last'
    : 'free'
}

const Utility = {
  createToken,
  toTimerString,
  TIME_THRESHOLD,
  intToClassRange,
  findMinMaxClassRange,
  formatDate,
  handleDateString,
  getFirstLectureFromSubcourse,
  getTrafficStatus
}
export default Utility
