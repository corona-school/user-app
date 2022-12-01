import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { UserNotification } from "../types/lernfair/Notification"

const concreteNotificationQuery = gql`
  query ConcreteNotification($id: Int!) {
    concrete_notification(concreteNotificationId: $id) {
      id
      headline
      body
      notification {
        messageType
      }
      createdAt
    }
  }
`

const isMessageValid = (message: UserNotification | null): boolean => {
  if (message === null) return false

  const requiredFields = ["id", "headline", "body", "notification"]
  const fields = Object.keys(message)

  for (const requiredField of requiredFields) {
    if (!fields.includes(requiredField)) return false
  }

  return true
}

export const useConcreteNotification = (id: number | null) => {
  const { data, loading, error } = useQuery(
    concreteNotificationQuery,
    {
      variables: { id },
      skip: typeof id !== 'number'
    }
  )
  const [concreteNotification, setConcreteNotification] = useState(null)

  useEffect(() => {
    if (!loading && !error && isMessageValid(data?.concrete_notification)) {
      setConcreteNotification(data?.concrete_notification)
    }
  }, [loading, data, error])

  return concreteNotification
}
