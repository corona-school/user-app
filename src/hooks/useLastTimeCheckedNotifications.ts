import { gql, useMutation, useQuery } from '@apollo/client'

const getLastTimeCheckedQuery = gql`
  query {
    me {
      lastTimeCheckedNotifications
    }
  }
`
const meLastTimeCheckedNotifications = gql`
  mutation updateMeLastTime($lastTimeCheckedNotifications: DateTime) {
    meUpdate(
      update: { lastTimeCheckedNotifications: $lastTimeCheckedNotifications }
    )
  }
`

const useLastTimeCheckedNotifications = () => {
  const { data, loading, error } = useQuery(getLastTimeCheckedQuery)

  const lastTimeChecked: string = data?.me?.lastTimeCheckedNotifications

  const [updateLastTimeCheckedNotifications] = useMutation(
    meLastTimeCheckedNotifications
  )

  return {
    lastTimeChecked,
    loading,
    error,
    updateLastTimeCheckedNotifications
  }
}

export { useLastTimeCheckedNotifications }
