import { Box, useBreakpointValue, Text } from 'native-base'
import { useTranslation } from 'react-i18next'

const MarketingNotifications = () => {
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
          {t('notification.controlPanel.tabs.tab2.description')}
        </Text>
        <Box>
          <Text>Marketing Notifications</Text>
        </Box>
      </Box>
    </>
  )
}

export default MarketingNotifications
