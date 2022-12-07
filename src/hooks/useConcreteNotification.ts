import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { UserNotification } from '../types/lernfair/Notification'

const concreteNotificationQuery = gql`
  query ConcreteNotification($id: Int!) {
    concrete_notification(concreteNotificationId: $id) {
      id
      message {
          headline
          body
          notification
      }
      sentAt
    }
  }
`

const isMessageValid = (message: UserNotification | null): boolean => {
  if (!message) return false

  const requiredFields = ['headline', 'body', 'notification']
  const fields = Object.keys(message)

  for (const requiredField of requiredFields) {
    if (!fields.includes(requiredField)) return false
  }

  return true
}

export const useConcreteNotification = (id: number | null) => {
  const { data, loading, error } = useQuery(concreteNotificationQuery, {
    variables: { id },
    skip: !id
  })
  const [concreteNotification, setConcreteNotification] = useState(null)

  useEffect(() => {
    if (!loading && !error && isMessageValid(data?.concrete_notification?.message)) {
      setConcreteNotification(data?.concrete_notification)
    }
  }, [loading, data, error])

  return concreteNotification
}
