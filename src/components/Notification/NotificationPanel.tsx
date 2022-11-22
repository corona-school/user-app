import {
  Box,
  Button,
  Popover,
  ScrollView,
  Spinner,
  Text,
  useBreakpointValue
} from 'native-base'
import { useEffect, useState } from 'react'
import SettingsIcon from '../../assets/icons/lernfair/ico-settings.svg'
import { UserNotification } from '../../types/lernfair/Notification'
import { useNotifications } from '../../hooks/useNotifications'
import MessageBox from './MessageBox'
import { useTranslation } from 'react-i18next'

const NotificationPanel: React.FC = () => {
  const [showOldNotifications, setShowOldNotifications] =
    useState<boolean>(false)
  const { notifications, loading, refetch } = useNotifications()
  const { t } = useTranslation()

  const PanelMarginLeft = useBreakpointValue({
    base: 3,
    lg: 0
  })

  const PanelMarginRight = useBreakpointValue({
    base: 0,
    lg: 10
  })

  const handleClick = () => {
    refetch()
    setShowOldNotifications(!showOldNotifications)
  }

  useEffect(() => {
    // TODO: implementation in the upcoming PR - setNotifications to render based on showOld
  })

  return (
    <Box>
      <Popover.Content ml={PanelMarginLeft} mr={PanelMarginRight} minW={320}>
        <Popover.Arrow />
        <Popover.CloseButton />
        <Popover.Header>
          <Box alignSelf="flex-end" mr={10}>
            <SettingsIcon />
          </Box>
        </Popover.Header>
        <Popover.Body>
          {loading ? (
            <Spinner />
          ) : (
            <Box maxH={420}>
              <ScrollView>
                <Box>
                  {notifications.map((notification: UserNotification) => (
                    <MessageBox
                      key={notification.id}
                      userNotification={notification}
                    />
                  ))}
                </Box>
              </ScrollView>
              {!showOldNotifications && (
                <Button onPress={handleClick} variant={'outline'}>
                  <Text fontSize="xs">
                    {t('notification.panel.button.text')}
                  </Text>
                </Button>
              )}
            </Box>
          )}
        </Popover.Body>
      </Popover.Content>
    </Box>
  )
}

export default NotificationPanel
