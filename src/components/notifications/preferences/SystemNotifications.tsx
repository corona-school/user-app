import { Box, Text, useBreakpointValue } from 'native-base'
import { useTranslation } from 'react-i18next'
import PreferenceItem from './PreferenceItem'
import { useUserPreferences } from '../../../hooks/useNotificationPreferences'

const SystemNotifications = () => {
  const { userPreferences, updateUserPreferences } = useUserPreferences()
  const { t } = useTranslation()

  const handleSwitchUpdate = (
    category: string,
    channel: string,
    value: boolean
  ) => {
    const perefencesToBeUpdated = { ...userPreferences }
    perefencesToBeUpdated[category][channel] = value
    updateUserPreferences({
      variables: {
        preferences: perefencesToBeUpdated
      },
      optimisticResponse: { meUpdate: true }
    })
  }

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
          {userPreferences &&
            Object.keys(userPreferences).map((category: string) =>
              Object.keys(userPreferences[category]).map((channel: string) => (
                <PreferenceItem
                  category={category}
                  channel={channel}
                  value={userPreferences[category][channel]}
                  onUpdate={(value: boolean) =>
                    handleSwitchUpdate(category, channel, value)
                  }
                />
              ))
            )}
        </Box>
      </Box>
    </>
  )
}

export default SystemNotifications
