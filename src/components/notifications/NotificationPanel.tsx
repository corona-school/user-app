import { Box, Popover, Spinner, useBreakpointValue } from 'native-base'
import { useEffect, useState } from 'react'
import SettingsIcon from '../../assets/icons/lernfair/ico-settings.svg'
import { UserNotification } from '../../types/lernfair/Notification'
import { getAllNewUserNotificationsButMinimumFiveNotifications } from '../../helper/notification-helper'
import { useLastTimeCheckedNotifications } from '../../hooks/useLastTimeCheckedNotifications'
import {
  AllNotifications,
  NewNotifications,
  NoNotifications
} from './PanelContent'

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
          {loadingUserNotifications && <Spinner />}
          <Box maxH={panelPropsAllDevices.maxH}>
            {!shouldShowAll && (
              <NewNotifications
                notificationsToShow={notificationsToShow}
                lastTimeChecked={lastTimeChecked}
                handleClick={handleClick}
              />
            )}
            {shouldShowAll && (
              <AllNotifications
                userNotifications={notificationsToShow}
                lastTimeChecked={lastTimeChecked}
              />
            )}
            {userNotifications.length === 0 && <NoNotifications />}
          </Box>
        </Popover.Body>
      </Popover.Content>
    </Box>
  )
}

export default NotificationPanel
