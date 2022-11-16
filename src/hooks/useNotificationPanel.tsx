import { gql, useQuery } from '@apollo/client'

const userNotificationQuery = gql`
  query {
    me {
      concrete_notifications {
        notification {
          category
          description
        }
        headline
        createdAt
      }
    }
  }
`

//query draft
const queryUserNotification = gql`
  query {
    userNotificationsList {
      user
      notifications {
        id
        headline
        body
        notificationClass
        createdAt
      }
    }
  }
`

const useAllNotifications = () => {
  const { data, loading, error } = useQuery(queryUserNotification)
  return { data, loading, error }
}

export { useAllNotifications }
