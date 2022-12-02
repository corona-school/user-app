import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { UserNotification } from '../types/lernfair/Notification'

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

const useAllUserNotifications = () => {
  const { data, loading, error, refetch } = useQuery(userNotificationQuery)

  const [userNotifications, setUserNotifications] = useState<
    UserNotification[]
  >([])

  useEffect(() => {
    if (!loading && !error) {
      setUserNotifications(data?.me?.concreteNotifications)
    }
  }, [loading, error])

  return { userNotifications, loading, error, refetch }
}

export { useAllUserNotifications }
