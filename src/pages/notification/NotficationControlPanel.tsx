import { t } from 'i18next'
import { Heading, Row, useTheme, View, VStack } from 'native-base'
import { useState } from 'react'
import Tabs, { Tab } from '../../components/Tabs'
import WithNavigation from '../../components/WithNavigation'
import SystemNotifications from './SystemNotifications'

const NotficationControlPanel = () => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const { space } = useTheme()

  return (
    <>
      <WithNavigation>
        <View py={3}>
          <Row marginBottom={space['2']}>
            <Heading>E-Mail-Benachrichtigungen</Heading>
          </Row>
          <VStack width={'1150'}>
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
