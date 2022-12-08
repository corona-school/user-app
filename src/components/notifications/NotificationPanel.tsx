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
import MessageBox from './MessageBox'
import { useTranslation } from 'react-i18next'
import {
  getAllNewUserNotificationsButMinimumFiveNotifications,
  isNewNotification
} from '../../helper/notification-helper'
import { useLastTimeCheckedNotifications } from '../../hooks/useLastTimeCheckedNotifications'

type Props = {
  userNotifications: UserNotification[]
  loadingUserNotifications: boolean
}

const NotificationPanel: React.FC<Props> = ({
  userNotifications,
  loadingUserNotifications
}) => {
  const [shouldShowAll, setShouldShowAll] = useState<boolean>(false)
  const [notificationsToShow, setNotificationsToShow] = useState<
    UserNotification[]
  >([])

  const { lastTimeChecked } = useLastTimeCheckedNotifications()
  const { t } = useTranslation()

  const panelMarginLeft = useBreakpointValue({
    base: 3,
    lg: 0
  })

  const panelMarginRight = useBreakpointValue({
    base: 0,
    lg: 10
  })

  const panelPropsAllDevices = {
    maxH: 420,
    minW: 320
  }

  const handleClick = () => {
    setShouldShowAll(!shouldShowAll)
  }

  useEffect(() => {
    if (shouldShowAll) {
      return setNotificationsToShow(userNotifications)
    }
    const notificationsToRender =
      getAllNewUserNotificationsButMinimumFiveNotifications(
        userNotifications,
        lastTimeChecked
      )
    setNotificationsToShow([...notificationsToRender])
  }, [userNotifications, lastTimeChecked, shouldShowAll])

  return (
    <Box>
      <Popover.Content
        ml={panelMarginLeft}
        mr={panelMarginRight}
        minW={panelPropsAllDevices.minW}>
        <Popover.Arrow />
        <Popover.CloseButton />
        <Popover.Header>
          <Box alignSelf="flex-end" mr={10}>
            <SettingsIcon />
          </Box>
        </Popover.Header>
        <Popover.Body>
          {notificationsToShow.length === 0 && shouldShowAll ? (
            loadingUserNotifications ? (
              <Spinner />
            ) : (
              <Box maxH={panelPropsAllDevices.maxH}>
                <ScrollView>
                  <Box>
                    {notificationsToShow.map(
                      (notification: UserNotification) => (
                        <MessageBox
                          key={notification.id}
                          userNotification={notification}
                          isRead={isNewNotification(
                            notification.sentAt,
                            lastTimeChecked
                          )}
                        />
                      )
                    )}
                  </Box>
                </ScrollView>
                {!shouldShowAll && (
                  <Button onPress={handleClick} variant={'outline'}>
                    <Text fontSize="xs">
                      {t('notification.panel.button.text')}
                    </Text>
                  </Button>
                )}
              </Box>
            )
          ) : (
            userNotifications.map((notification: UserNotification) => (
              <MessageBox
                key={notification.id}
                userNotification={notification}
                isRead={isNewNotification(notification.sentAt, lastTimeChecked)}
              />
            ))
          )}
        </Popover.Body>
      </Popover.Content>
    </Box>
  )
}

export default NotificationPanel
