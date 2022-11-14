import { Button, Text, Circle, Popover } from 'native-base'
import BellIcon from '../../assets/icons/lernfair/lf-bell.svg'
import NotificationPanel from './NotificationPanel'

const NotificationAlert: React.FC = () => {
  const count = 4 //TO DO: count from hook

  return (
    <>
      <Popover
        placement="bottom"
        trigger={triggerProps => {
          return (
            <>
              {count !== null && (
                <Circle
                  position="absolute"
                  top="3.5"
                  left="2"
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
            </>
          )
        }}
        children={<NotificationPanel />}></Popover>
    </>
  )
}
export default NotificationAlert
