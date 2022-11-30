import { t } from 'i18next'
import {
  Heading,
  Row,
  useBreakpointValue,
  useTheme,
  View,
  VStack
} from 'native-base'
import { useState } from 'react'
import Tabs, { Tab } from '../../components/Tabs'
import WithNavigation from '../../components/WithNavigation'
import SystemNotifications from '../../components/notification/preferences/SystemNotifications'
import { useTranslation } from 'react-i18next'

const NotficationControlPanel = () => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const { space } = useTheme()
  const { t } = useTranslation()

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  const width = useBreakpointValue({
    base: '90%',
    lg: '90%'
  })

  return (
    <>
      <WithNavigation
        showBack
        headerTitle={t('notification.controlPanel.title')}>
        <View py={5} width={width}>
          {!isMobile && (
            <Row marginBottom={space['2']} ml={3}>
              <Heading>{t('notification.controlPanel.title')}</Heading>
            </Row>
          )}
          <VStack ml={3}>
            <Tabs
              onPressTab={(tab: Tab, index: number) => {
                setActiveTab(index)
              }}
              tabs={[
                {
                  title: t('notification.controlPanel.tabs.tab1.title'),
                  content: <SystemNotifications />
                },
                {
                  title: t('notification.controlPanel.tabs.tab2.title'),
                  content: 'Coming soon.'
                }
              ]}
            />
          </VStack>
        </View>
      </WithNavigation>
    </>
  )
}

export default NotficationControlPanel
