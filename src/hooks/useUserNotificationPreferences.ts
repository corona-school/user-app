import { gql, useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

const notificationPreferencesQuery = gql`
  query {
    me {
      notificationPreferences
    }
  }
`

const notificationPreferencesMutation = gql`
  mutation changeMeNotificationPref {
    meUpdate(
      update: {
        notificationPreferences: {
          chat: { email: true, chat: false, whatsapp: false }
          match: { email: false, chat: true, whatsapp: true }
          course: { email: true, chat: true, whatsapp: true }
          appointment: { email: false, chat: true, whatsapp: true }
          survey: { email: true, chat: true, whatsapp: true }
          news: { email: false, chat: true, whatsapp: true }
        }
      }
    )
  }
`

const useUserPreferences = () => {
  const [userPreferences, setUserPreferences] = useState([])

  const { data, loading, error } = useQuery(notificationPreferencesQuery)

  const updateUserPreferences = useMutation(notificationPreferencesMutation)
  useEffect(() => {
    if (!loading && !error) {
      const userPreferencesAsJson = JSON.parse(
        data?.me?.notificationPreferences
      )
      setUserPreferences(userPreferencesAsJson)
    }
  }, [loading, error])
  return { userPreferences, loading, error }
}

export { useUserPreferences }
