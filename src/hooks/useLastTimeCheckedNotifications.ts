import { gql, useMutation, useQuery } from '@apollo/client'

const useLastTimeCheckedNotifications = () => {
  const { data, loading, error } = useQuery(gql`
    query {
      me {
        pupil {
          lastTimeCheckedNotifications
        }
      }
    }
  `)

  const lastTimeChecked = data?.me?.pupil?.lastTimeCheckedNotifications
  const lastTimeCheckedLoading = loading
  const lastTimeCheckedError = error

  const [updateLastTimeCheckedNotifications] = useMutation(gql`
    mutation updateLastTimeCheckedNotifications(
      $lastTimeCheckedNotifications: DateTime
    ) {
      meUpdate(
        update: {
          pupil: { lastTimeCheckedNotifications: $lastTimeCheckedNotifications }
        }
      )
    }
  `)

  return {
    lastTimeChecked,
    lastTimeCheckedLoading,
    lastTimeCheckedError,
    updateLastTimeCheckedNotifications
  }
}

export { useLastTimeCheckedNotifications }
