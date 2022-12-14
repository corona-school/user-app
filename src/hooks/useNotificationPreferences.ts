import { gql, useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { NotificationPreferences } from '../types/lernfair/NotificationPreferences'
import {
  getAllNotificationPreferenceCategories,
} from "../helper/notification-preferences"

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

const defaultPreferences: NotificationPreferences = {}
for (const preference of getAllNotificationPreferenceCategories()) {
  defaultPreferences[preference] = { email: false}
}

const useUserPreferences = () => {
  const [userPreferences, setUserPreferences] =
    useState<NotificationPreferences>(defaultPreferences)

  const { data, loading, error } = useQuery(notificationPreferencesQuery)

  const [updateUserPreferences] = useMutation(notificationPreferencesMutation)

  useEffect(() => {
    if (!loading && !error && data?.me?.notificationPreferences) {
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
