import { Box, Text, useBreakpointValue } from 'native-base'
import { useTranslation } from 'react-i18next'
import { NotificationPreference } from './PreferencesData'
import PreferenceItem from './PreferenceItem'
import { useUserPreferences } from '../../../hooks/useUserNotificationPreferences'

const SystemNotifications = () => {
  const { t } = useTranslation()

  const { userPreferences } = useUserPreferences()

  const marginLeft = useBreakpointValue({
    base: 0,
    lg: 5
  })

  const marginBottom = useBreakpointValue({
    base: 5,
    lg: 3
  })

  return (
    <>
      <Box ml={marginLeft}>
        <Text mb={marginBottom}>
          {t('notification.controlPanel.tabs.tab1.description')}
        </Text>
        <Box>
          {userPreferences.map((pref: NotificationPreference) =>
            Object.keys(pref).map((key: string) => (
              <PreferenceItem id={key} channel={pref[key]} />
            ))
          )}
        </Box>
      </Box>
    </>
  )
}

export default SystemNotifications
