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

const NotficationControlPanel = () => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const { space } = useTheme()

  const width = useBreakpointValue({
    base: 600,
    lg: 1150
  })

  return (
    <>
      <WithNavigation>
        <View py={3} width={600}>
          <Row marginBottom={space['2']}>
            <Heading>E-Mail-Benachrichtigungen</Heading>
          </Row>
          <VStack>
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
