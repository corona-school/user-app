import { gql, useQuery } from '@apollo/client'

const userNotificationQuery = gql`
  {
    me {
      concrete_notifications {
        id
        headline
        body
        createdAt
        notification {
          class
        }
      }
    }
  }
`

const queryUserNotification = gql`
  query {
    notifications {
      id
      description
      category
    }
  }
`

const useAllNotifications = () => {
  const { data, loading, error } = useQuery(queryUserNotification)
  console.log(data)
  return { data, loading, error }
}

export { useAllNotifications }
