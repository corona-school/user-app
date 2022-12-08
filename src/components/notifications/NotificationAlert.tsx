import {
  Button,
  Text,
  Circle,
  Popover,
  VStack,
  useBreakpointValue
} from 'native-base'
import { IButtonProps } from 'native-base/lib/typescript/components/primitives/Button/types'
import { useContext, useEffect, useState } from 'react'
import BellIcon from '../../assets/icons/lernfair/lf-bell.svg'
import { useLastTimeCheckedNotifications } from '../../hooks/useLastTimeCheckedNotifications'
import { useAllUserNotifications } from '../../hooks/useAllUserNotifications'
import NotificationPanel from './NotificationPanel'
import { NotificationsContext } from '../NotificationsProvider'
import { getAllNewNotifications } from '../../helper/notification-helper'

const NotificationAlert: React.FC = () => {
  const [count, setCount] = useState<number>(0)
  const message = useContext(NotificationsContext)
  const { userNotifications } = useAllUserNotifications()

  const {
    lastTimeChecked,
    loading,
    error,
    updateLastTimeCheckedNotifications
  } = useLastTimeCheckedNotifications()

  const badgeAlign = useBreakpointValue({
    base: 0,
    lg: 2
  })

  const handleClose = () => {
    const now = new Date().toISOString()
    setCount(0)
    updateLastTimeCheckedNotifications({
      variables: { lastTimeCheckedNotifications: now }
    })
  }

  useEffect(() => {
    console.log('last time checked', lastTimeChecked)
    const unreadNotifications = getAllNewNotifications(
      userNotifications,
      lastTimeChecked
    )

    console.log('unread messages', unreadNotifications)
    setCount(unreadNotifications.length)
  }, [message])

  const handleTrigger = ({
    onPress,
    ref
  }: IButtonProps): React.ReactElement => {
    return (
      <VStack>
        {!loading && !error && count > 0 && (
          <Circle
            position="absolute"
            my={3}
            mx={badgeAlign}
            alignSelf="flex-start"
            bgColor="danger.500"
            size="3.5"
            zIndex={1}>
            <Text fontSize="xs" color="white">
              {count}
            </Text>
          </Circle>
        )}
        <Button onPress={onPress} ref={ref} variant="ghost">
          <BellIcon />
        </Button>
      </VStack>
    )
  }

  return (
    <Popover
      placement="bottom"
      trigger={triggerprops => handleTrigger(triggerprops)}
      onClose={() => handleClose()}>
      <NotificationPanel
        userNotifications={userNotifications}
        loadingUserNotifications={loading}
      />
    </Popover>
  )
}
export default NotificationAlert
