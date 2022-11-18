import { gql, useQuery } from '@apollo/client'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'

const userNotificationQuery = gql`
  query {
    me {
      userID
      concreteNotifications {
        id
        headline
        body
        notification {
          messageType
        }
        createdAt
      }
    }
  }
`

const useAllNotifications = (skip?: number, take?: number) => {
  const { data, loading, error, refetch } = useQuery(userNotificationQuery)
  return { data, loading, error, refetch }
}

const getTimeDifference = (timestamp: string) => {
  const now = DateTime.now()
  const createdAt = DateTime.fromISO(timestamp)
  const timeDiff = now.diff(createdAt, 'minutes')
  const minutesDiff = now.diff(createdAt, 'minutes').minutes
  const hoursDiff = now.diff(createdAt, 'hours').hours
  const daysDiff = now.diff(createdAt, 'days').days
  const weeksDiff = now.diff(createdAt, 'weeks').weeks
  const timeDiffString = timeDiff.toFormat('m')

  return { minutesDiff, hoursDiff, daysDiff, weeksDiff, timeDiffString }
}

const useTimeDifference = (timestamp: string, isToast?: boolean) => {
  const { t } = useTranslation()
  const diff = getTimeDifference(timestamp)
  const minutes = diff.minutesDiff
  const days = diff.daysDiff
  const weeks = diff.weeksDiff
  const createdAtAsTime = DateTime.fromISO(timestamp).toFormat('T')

  if (isToast) return ''

  if (minutes < 1) {
    return t('notification.timedifference.now')
  } else if (minutes < 60) {
    return t('notification.timedifference.beforeMinutes', {
      minutes: diff.timeDiffString
    })
  } else if (minutes > 60) {
    if (days > 2) {
      return t('notification.timedifference.dayBeforeYesterday')
    }
    if (days > 1) {
      return t('notification.timedifference.yesterday')
    }

    return createdAtAsTime
  }
}

export { useAllNotifications, useTimeDifference, getTimeDifference }
