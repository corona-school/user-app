import { gql, useQuery } from '@apollo/client'
import { UserNotification } from '../types/lernfair/Notification'
import { useEffect, useState } from "react"

const userNotificationQuery = gql`
  query {
    me {
      concreteNotifications(take: 100) {
        id
        message {
          headline
          body
        }
        sentAt
      }
    }
  }
`

const useAllUserNotifications = (): UserNotification[] | undefined => {
  const { data, loading, error } = useQuery(userNotificationQuery)
  const [userNotifications, setUserNotifications] = useState()

  useEffect(() => {
    if (
      !loading &&
      !error
    ) {
      setUserNotifications(data?.me?.concreteNotifications)
    }
  }, [loading, data, error])

  return userNotifications
}

export { useAllUserNotifications }
