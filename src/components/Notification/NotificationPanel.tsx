import { Box, Popover, ScrollView } from 'native-base'
import React from 'react'
import SettingsIcon from '../../assets/icons/lernfair/ico-settings.svg'
import { InAppNotification } from '../../types/lernfair/Notification'
import MessageBox from './MessageBox'
import { useAllNotifications } from '../../hooks/useNotificationPanel'

const NotificationPanel: React.FC = () => {
  const { data, loading, error } = useAllNotifications()

  return (
    <>
      {!error && (
        <Popover.Content>
          <Popover.Arrow />
          <Popover.CloseButton />
          <Popover.Header>
            <Box alignSelf="flex-end" mr={10}>
              <SettingsIcon />
            </Box>
          </Popover.Header>
          <Popover.Body>
            <ScrollView w="320" h="387">
              <Box>
                {!loading &&
                  data.notifications.map((noti: InAppNotification) => (
                    <>
                      <MessageBox key={noti.id} notification={noti} />
                    </>
                  ))}
              </Box>
            </ScrollView>
          </Popover.Body>
        </Popover.Content>
      )}
    </>
  )
}

export default NotificationPanel
