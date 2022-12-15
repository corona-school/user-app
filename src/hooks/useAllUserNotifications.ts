import { ApolloError, gql, useQuery } from '@apollo/client'
import { UserNotification } from '../types/lernfair/Notification'

const userNotificationQuery = gql`
  query {
    me {
      userID
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

const useAllUserNotifications = (): {
  userNotifications: UserNotification[] | undefined
  loading: boolean
  error: ApolloError | undefined
} => {
  const { data, loading, error } = useQuery(userNotificationQuery)

  const userNotifications = data?.me.concreteNotifications

  return { userNotifications, loading, error }
}

export { useAllUserNotifications }
