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
import { useConcreteNotifications } from '../../hooks/useConcreteNotifications'
import NotificationPanel from './NotificationPanel'
import { NotificationsContext } from '../NotificationsProvider'
import { getNewNotifications } from '../../helper/notification-helper'

const NotificationAlert: React.FC = () => {
  const [count, setCount] = useState<number>(0)
  const message = useContext(NotificationsContext)
  const { userNotifications, refetch, loading } = useConcreteNotifications()

  const {
    lastTimeCheckedNotifications,
    updateLastTimeChecked
  } = useLastTimeCheckedNotifications()

  const badgeAlign = useBreakpointValue({
    base: 0,
    lg: 2
  })

  useEffect(() => {
    if (message?.id) {
      setCount((count + 1))
    }
  },[message?.id])

  useEffect(() => {
    if (!userNotifications) {
      return
    }

    const unreadNotifications = getNewNotifications(
      userNotifications,
      lastTimeCheckedNotifications
    )
    setCount(unreadNotifications.length)
  }, [ lastTimeCheckedNotifications, userNotifications])

  const handleTrigger = ({
    onPress,
    ref
  }: IButtonProps): React.ReactElement => {
    return (
      <VStack>
        { count && (
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
    <>
      <Popover
        placement="bottom"
        trigger={triggerprops => handleTrigger(triggerprops)}
        onClose={updateLastTimeChecked} onOpen={refetch}>
        <NotificationPanel
          loading={loading}
          userNotifications={userNotifications || []}
          lastTimeCheckedNotifications={lastTimeCheckedNotifications}
        />
      </Popover>
    </>
  )
}
export default NotificationAlert
