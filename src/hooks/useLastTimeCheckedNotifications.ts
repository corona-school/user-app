import { gql, useMutation, useQuery } from '@apollo/client'
import useLernfair from './useLernfair'

const studentQuery = gql`
  query {
    me {
      student {
        lastTimeCheckedNotifications
      }
    }
  }
`

const pupilQuery = gql`
  query {
    me {
      pupil {
        lastTimeCheckedNotifications
      }
    }
  }
`

const studentMutation = gql`
  mutation updateLastTimeCheckedNotifications(
    $lastTimeCheckedNotifications: DateTime
  ) {
    meUpdate(
      update: {
        student: { lastTimeCheckedNotifications: $lastTimeCheckedNotifications }
      }
    )
  }
`

const pupilMutation = gql`
  mutation updateLastTimeCheckedNotifications(
    $lastTimeCheckedNotifications: DateTime
  ) {
    meUpdate(
      update: {
        pupil: { lastTimeCheckedNotifications: $lastTimeCheckedNotifications }
      }
    )
  }
`

const useLastTimeCheckedNotifications = () => {
  const { userType } = useLernfair()

  const { data, loading, error } = useQuery(
    userType === 'student' ? studentQuery : pupilQuery
  )

  const lastTimeChecked =
    userType === 'student'
      ? data?.me?.student?.lastTimeCheckedNotifications
      : data?.me?.pupil?.lastTimeCheckedNotifications

  const [updateLastTimeCheckedNotifications] = useMutation(
    userType === 'student' ? studentMutation : pupilMutation
  )

  return {
    lastTimeChecked,
    loading,
    error,
    updateLastTimeCheckedNotifications
  }
}

export { useLastTimeCheckedNotifications }
