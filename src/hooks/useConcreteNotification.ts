import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

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

const useConcreteNotification = (id?: number) => {
  const { data, loading, error, refetch } = useQuery(
    concreteNotificationQuery,
    {
      variables: { id },
      skip: typeof id !== 'number'
    }
  )
  const [notification, setNotification] = useState()

  useEffect(() => {
    if (!loading && !error) {
      setNotification(data?.concrete_notification)
    }
  }, [loading])

  return { data, notification, loading, error, refetch }
}

export { useConcreteNotification }
