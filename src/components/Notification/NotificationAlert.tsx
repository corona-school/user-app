import { Button, Text, Circle, Popover, VStack } from 'native-base'
import BellIcon from '../../assets/icons/lernfair/lf-bell.svg'
import { useAllNotifications } from '../../hooks/useNotificationPanel'
import NotificationPanel from './NotificationPanel'

const NotificationAlert: React.FC = () => {
  const count = 4 //TO DO
  // const { data, loading, error } = useAllNotifications()

  return (
    <>
      <Popover
        placement="bottom"
        trigger={triggerProps => {
          return (
            <VStack>
              {count !== null && (
                <Circle
                  //_web
                  position="absolute"
                  my={3}
                  alignSelf="flex-start"
                  bgColor="danger.500"
                  size="3.5"
                  zIndex={1}>
                  <Text fontSize="10" color="white">
                    {count}
                  </Text>
                </Circle>
              )}
              <Button {...triggerProps} bgColor="">
                <BellIcon />
              </Button>
            </VStack>
          )
        }}
        children={<NotificationPanel />}></Popover>
    </>
  )
}
export default NotificationAlert
