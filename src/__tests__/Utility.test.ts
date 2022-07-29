import { toTimerString, secondsToTimerString } from '../Utility'

describe('Utility - Timer', () => {
  test('should show 23:59', () => {
    const timerString = toTimerString(
      Date.now(),
      Date.now() + (24 * 60 * 60 * 1000 - 60000)
    )
    expect(timerString).toBe('23:59')
  })

  test('should show 00:59', () => {
    const timerString = toTimerString(
      Date.now(),
      Date.now() + (60 * 60 * 1000 - 60000)
    )
    expect(timerString).toBe('00:59')
  })

  test('should show 01:01', () => {
    const timerString = toTimerString(
      Date.now(),
      Date.now() + 60 * 60 * 1000 + 60000
    )
    expect(timerString).toBe('01:01')
  })

  test('should show 03:24', () => {
    const timerString = toTimerString(
      Date.now(),
      Date.now() + 3 * 60 * 60 * 1000 + 60000 * 24
    )
    expect(timerString).toBe('03:24')
  })

  test('should show 00:01', () => {
    const timerString = toTimerString(
      new Date(1618814737000).getTime(),
      new Date(1618814737000 + 60000).getTime()
    )
    expect(timerString).toBe('00:01')
  })

  test('seconds = 01:00', () => {
    const s = secondsToTimerString(60)
    expect(s).toBe('01:00')
  })
  test('seconds = 00:30', () => {
    const s = secondsToTimerString(30)
    expect(s).toBe('00:30')
  })
  test('seconds = 15:00', () => {
    const s = secondsToTimerString(60 * 15)
    expect(s).toBe('15:00')
  })
  test('seconds = 00:13', () => {
    const s = secondsToTimerString(13)
    expect(s).toBe('00:13')
  })
  test('seconds = 01:12', () => {
    const s = secondsToTimerString(72)
    expect(s).toBe('01:12')
  })
})
