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

type Props = {
  userNotifications: UserNotification[]
  lastOpen: string
}

const NotificationPanel: React.FC<Props> = ({
  userNotifications,
  lastOpen
}) => {
  const [isShowAll, setIsShowAll] = useState<boolean>(false)
  const [notificationsToShow, setNotificationsToShow] = useState<
    UserNotification[]
  >([])

  const { loading } = useNotifications()
  const { t } = useTranslation()

  const unRead = (sentAt: string, open: string) => {
    if (sentAt > open) {
      return false
    } else if (sentAt < open) {
      return true
    }
  }

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
      notification => notification.sentAt > lastOpen
    )

    for (let i = notificationsToRender.length; i < 5; i++) {
      notificationsToRender.push(userNotifications[i])
    }
    setNotificationsToShow([...notificationsToRender])
  }, [userNotifications, lastOpen, isShowAll])

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
                      isRead={unRead(notification.sentAt, lastOpen)}
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
