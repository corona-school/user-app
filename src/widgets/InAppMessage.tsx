import { Box, Toast } from 'native-base'
import MessageBox from '../components/Notification/MessageBox'
import { UserNotification } from '../types/lernfair/Notification'

export const showInAppMessage = (
  notification: UserNotification,
  isMobile: boolean
) => {
  return Toast.show({
    placement: isMobile ? 'top' : 'top-right',
    render: () => {
      return (
        <Box mr={5}>
          <MessageBox
            key={notification.id}
            displayTime={false}
            userNotification={notification}
          />
        </Box>
      )
    }
  })
}
