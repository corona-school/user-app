import { Box, Text } from 'native-base'
import { useTranslation } from 'react-i18next'
import { preferencesData } from './PreferencesData'
import PreferenceItem from './PreferenceItem'

const SystemNotifications = () => {
  const { t } = useTranslation()

  return (
    <>
      <Box ml={5}>
        <Text mb={3}>
          {t('notification.controlPanel.tabs.tab1.description')}
        </Text>
        <Box>
          {preferencesData.map(data => (
            <PreferenceItem {...data} />
          ))}
        </Box>
      </Box>
    </>
  )
}

export default SystemNotifications
