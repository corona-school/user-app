import { Box, Button, Popover, ScrollView } from 'native-base'
import { useState } from 'react'
import SettingsIcon from '../../assets/icons/lernfair/ico-settings.svg'
import { UserNotification } from '../../types/lernfair/Notification'
import MessageBox from './MessageBox'
import { useAllNotifications } from '../../hooks/useNotificationPanel'

const NotificationPanel: React.FC = () => {
  const [showOldNotifications, setShowOldNotifications] = useState(false)
  const { data } = useAllNotifications()

  return (
    <>
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
                {data.userNotificationsList.notifications
                  .slice(0, 5)
                  .map((notification: UserNotification) => (
                    <MessageBox
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
              </Box>
              <Button
                onPress={() => setShowOldNotifications(!showOldNotifications)}>
                Ältere Benachrichtigungen anzeigen
              </Button>
            </>
          )}
          {showOldNotifications && (
            <ScrollView w="320" h="387">
              <Box>
                {data.userNotificationsList.notifications.map(
                  (notification: UserNotification) => (
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
    </>
  )
}

export default NotificationPanel
