import { Box, Text, useBreakpointValue } from 'native-base'
import { useTranslation } from 'react-i18next'
import { preferencesData } from './PreferencesData'
import PreferenceItem from './PreferenceItem'

const SystemNotifications = () => {
  const { t } = useTranslation()

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
          {preferencesData.map(data => (
            <PreferenceItem
              id={data.id}
              title={data.title}
              icon={data.icon}
              modal={data.modal}
            />
          ))}
        </Box>
      </Box>
    </>
  )
}

export default SystemNotifications
