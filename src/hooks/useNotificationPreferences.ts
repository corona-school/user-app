import { gql, useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { NotificationPreferences } from '../types/lernfair/NotificationPreferences'

const notificationPreferencesQuery = gql`
  query {
    me {
      notificationPreferences
    }
  }
`

const notificationPreferencesMutation = gql`
  mutation changeMeNotificationPref($preferences: [PreferencesInput!]) {
    meUpdate(update: { notificationPreferences: $preferences })
  }
`

const useUserPreferences = () => {
  const [userPreferences, setUserPreferences] =
    useState<NotificationPreferences>()

  const { data, loading, error } = useQuery(notificationPreferencesQuery)

  const [updateUserPreferences] = useMutation(notificationPreferencesMutation)

  useEffect(() => {
    if (!loading && !error) {
      const userPreferencesAsJson = JSON.parse(
        data?.me?.notificationPreferences
      )
      const [preferences] = userPreferencesAsJson
      setUserPreferences(preferences)
    }
  }, [loading, error, data?.me?.notificationPreferences])
  return {
    userPreferences,
    loading,
    error,
    updateUserPreferences
  }
}

export { useUserPreferences }
