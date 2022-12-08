import { Box, Button, ScrollView, Text } from 'native-base'
import { useTranslation } from 'react-i18next'
import { isNewNotification } from '../../helper/notification-helper'
import { UserNotification } from '../../types/lernfair/Notification'
import MessageBox from './MessageBox'

const NewNotifications = (
  notificationsToShow: UserNotification[],
  lastTimeChecked: string,
  handleClick: () => void
) => {
  const { t } = useTranslation()
  const panelPropsAllDevices = {
    maxH: 420,
    minW: 320
  }

  return (
    <Box maxH={panelPropsAllDevices.maxH}>
      <ScrollView>
        <Box>
          {notificationsToShow.map((notification: UserNotification) => (
            <MessageBox
              key={notification.id}
              userNotification={notification}
              isRead={isNewNotification(notification.sentAt, lastTimeChecked)}
            />
          ))}
        </Box>
      </ScrollView>
      <Button onPress={handleClick} variant={'outline'}>
        <Text fontSize="xs">{t('notification.panel.button.text')}</Text>
      </Button>
    </Box>
  )
}

const AllNotifications = (
  userNotifications: UserNotification[],
  lastTimeChecked: string
) => {
  return userNotifications.map((notification: UserNotification) => (
    <MessageBox
      key={notification.id}
      userNotification={notification}
      isRead={isNewNotification(notification.sentAt, lastTimeChecked)}
    />
  ))
}

const NoNotifications = () => {
  const { t } = useTranslation()
  return (
    <Box>
      <Text>{t('notification.panel.noNotifications')}</Text>
    </Box>
  )
}

export { NewNotifications, AllNotifications, NoNotifications }
