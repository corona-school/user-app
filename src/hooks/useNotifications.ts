import { gql, useQuery } from '@apollo/client'

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

const useNotifications = () => {
  const { data, loading, error, refetch } = useQuery(userNotificationQuery)
  // TODO: on first request me seems to be empty, not evaluation
  const notifications = data?.me?.concreteNotifications
  return { data, notifications, loading, error, refetch }
}

export { useNotifications }
