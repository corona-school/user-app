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
        sentAt
      }
    }
  }
`

const useAllNotifications = (skip?: number, take?: number) => {
  const { data, loading, error } = useQuery(userNotificationQuery)
  return { data, loading, error }
}

const useTimeDifference = (timestamp: string) => {
  const { t } = useTranslation()

  const now = DateTime.now()
  const createdAt = DateTime.fromISO(timestamp)

  const timeDiff = now.diff(createdAt, 'minutes')
  const timeDiffInMin = timeDiff.minutes

  const createdAtAsTime = DateTime.fromISO(timestamp).toFormat('T')
  const timeDiffAsString = timeDiff.toFormat('m')

  if (timeDiffInMin < 1) {
    return ''
  } else if (timeDiffInMin > 1 && timeDiffInMin < 2) {
    return t('notification.timedifference.now')
  } else if (timeDiffInMin < 60) {
    return t('notification.timedifference.beforeMinutes', {
      minutes: timeDiffAsString
    })
  } else if (timeDiffInMin > 60) {
    if (timeDiffInMin > 1440) {
      return t('notification.timedifference.yesterday')
    }
    return createdAtAsTime
  }
}

export { useAllNotifications, useTimeDifference }
