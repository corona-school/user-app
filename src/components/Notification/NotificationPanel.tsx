import { Box, Button, Popover, ScrollView, Spinner } from 'native-base'
import { useState } from 'react'
import SettingsIcon from '../../assets/icons/lernfair/ico-settings.svg'
import { UserNotification } from '../../types/lernfair/Notification'
import { useAllNotifications } from '../../hooks/useNotificationPanel'
import MessageBox from './MessageBox'

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
              <Box w="320" maxH="580">
                <ScrollView>
                  <Box w="320">
                    {data.me.concreteNotifications
                      .slice(0, 5)
                      .map((notification: UserNotification) => (
                        <MessageBox
                          key={notification.id}
                          userNotification={notification}
                        />
                      ))}
                  </Box>
                </ScrollView>
                <Button
                  onPress={() => setShowOldNotifications(!showOldNotifications)}
                  variant={'outline'}>
                  Ältere Benachrichtigungen anzeigen
                </Button>
              </Box>
            )}
            {showOldNotifications && (
              <ScrollView w="320" maxH="580">
                <Box>
                  {data.me.concreteNotifications.map(
                    (notification: UserNotification) => (
                      <Box>
                        <MessageBox
                          key={notification.id}
                          userNotification={notification}
                        />
                      </Box>
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
