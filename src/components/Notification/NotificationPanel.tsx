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
import { setReadOrUnread } from '../../helper/notification-helper'
import { useLastTimeCheckedNotifications } from '../../hooks/useLastTimeCheckedNotifications'

type Props = {
  userNotifications: UserNotification[]
}

const NotificationPanel: React.FC<Props> = ({ userNotifications }) => {
  const [isShowAll, setIsShowAll] = useState<boolean>(false)
  const [notificationsToShow, setNotificationsToShow] = useState<
    UserNotification[]
  >([])

  const { lastTimeChecked } = useLastTimeCheckedNotifications()

  const { loading } = useNotifications()
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
    setIsShowAll(!isShowAll)
  }

  useEffect(() => {
    if (isShowAll) {
      return setNotificationsToShow(userNotifications)
    }
    const notificationsToRender = userNotifications.filter(
      notification => notification.sentAt > lastTimeChecked
    )
    for (let i = notificationsToRender.length; i < 5; i++) {
      notificationsToRender.push(userNotifications[i])
    }
    setNotificationsToShow([...notificationsToRender])
  }, [userNotifications, lastTimeChecked, isShowAll])

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
          {loading ? (
            <Spinner />
          ) : (
            <Box maxH={panelPropsAllDevices.maxH}>
              <ScrollView>
                <Box>
                  {notificationsToShow.map((notification: UserNotification) => (
                    <MessageBox
                      key={notification.id}
                      userNotification={notification}
                      isRead={setReadOrUnread(
                        notification.sentAt,
                        lastTimeChecked
                      )}
                    />
                  ))}
                </Box>
              </ScrollView>
              {!isShowAll && (
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
