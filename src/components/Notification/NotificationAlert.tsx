import { Button, Text, Circle, Popover, VStack } from 'native-base'
import BellIcon from '../../assets/icons/lernfair/lf-bell.svg'
import NotificationPanel from './NotificationPanel'

const NotificationAlert: React.FC = () => {
  // TODO: the implementation is done in the upcoming PR
  const count: number = 4

  return (
    <>
      <Popover
        placement="bottom"
        trigger={triggerProps => {
          return (
            <VStack>
              {count !== 0 && (
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
        }}>
        <NotificationPanel />
      </Popover>
    </>
  )
}
export default NotificationAlert
