import { gql, useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Text,
  Circle,
  Popover,
  VStack,
  useBreakpointValue
} from 'native-base'
import { IButtonProps } from 'native-base/lib/typescript/components/primitives/Button/types'
import { useEffect, useState } from 'react'
import BellIcon from '../../assets/icons/lernfair/lf-bell.svg'
import { useNotifications } from '../../hooks/useNotifications'
import NotificationPanel from './NotificationPanel'

const NotificationAlert: React.FC = () => {
  const [count, setCount] = useState<number>(0)
  const [lastOpen, setLastOpen] = useState<string>('')
  const { notifications, refetch } = useNotifications()

  const { data } = useQuery(gql`
    query {
      me {
        pupil {
          lastTimeCheckedNotifications
        }
      }
    }
  `)

  // TODO with variables
  const [changeLastTimeCheckedNotifications] = useMutation(gql`
    mutation changeLastTimeCheckedNotifications {
      meUpdate(
        update: {
          pupil: { lastTimeCheckedNotifications: "2022-11-28T08:00:00.070Z" }
        }
      )
    }
  `)

  const badgeAlign = useBreakpointValue({
    base: 0,
    lg: 2
  })

  const handleClose = () => {
    const now = new Date()
    const nowString = now.toISOString()
    setCount(0)
    setLastOpen(nowString)
    changeLastTimeCheckedNotifications()
  }

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      notification => notification.sentAt > lastOpen
    )
    setCount(unreadNotifications.length)
    setLastOpen(data?.me?.pupil?.lastTimeCheckedNotifications)
    refetch()
    // TODO change notifications to contextNotifications
  }, [notifications, refetch])

  const handleTrigger = ({
    onPress,
    ref
  }: IButtonProps): React.ReactElement => {
    return (
      <VStack>
        {count > 0 && (
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
        userNotifications={notifications}
        lastOpen={lastOpen}
      />
    </Popover>
  )
}
export default NotificationAlert
