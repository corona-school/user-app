import { Box, Button, Popover, ScrollView, Spinner } from 'native-base'
import { useState } from 'react'
import SettingsIcon from '../../assets/icons/lernfair/ico-settings.svg'
import { DummyUserNotification } from '../../types/lernfair/Notification'
import MessageBox from './MessageBox'
import { useAllNotifications } from '../../hooks/useNotificationPanel'

const NotificationPanel: React.FC = () => {
  const [showOldNotifications, setShowOldNotifications] = useState(false)
  const { data, loading } = useAllNotifications()

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Popover.Content>
          <Popover.Arrow />
          <Popover.CloseButton />
          <Popover.Header>
            <Box alignSelf="flex-end" mr={10}>
              <SettingsIcon />
            </Box>
          </Popover.Header>
          <Popover.Body>
            {!showOldNotifications && (
              <>
                <Box w="320">
                  {data.notifications
                    .slice(0, 5)
                    .map((notification: DummyUserNotification) => (
                      <MessageBox
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                </Box>
                <Button
                  onPress={() => setShowOldNotifications(!showOldNotifications)}
                  variant={'outline'}>
                  Ältere Benachrichtigungen anzeigen
                </Button>
              </>
            )}
            {showOldNotifications && (
              <ScrollView w="320" h="387">
                <Box>
                  {data.notifications.map(
                    (notification: DummyUserNotification) => (
                      <>
                        <MessageBox
                          key={notification.id}
                          notification={notification}
                        />
                      </>
                    )
                  )}
                </Box>
              </ScrollView>
            )}
          </Popover.Body>
        </Popover.Content>
      )}
    </>
  )
}

export default NotificationPanel
