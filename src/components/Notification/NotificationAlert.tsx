import {
  Button,
  Text,
  Circle,
  Popover,
  VStack,
  useBreakpointValue
} from 'native-base'
import { IButtonProps } from 'native-base/lib/typescript/components/primitives/Button/types'
import BellIcon from '../../assets/icons/lernfair/lf-bell.svg'
import NotificationPanel from './NotificationPanel'

const NotificationAlert: React.FC = () => {
  // TODO: the implementation is done in the upcoming PR
  const count: number = 4

  const badgeAlign = useBreakpointValue({
    base: 0,
    lg: 2
  })

  const handleTrigger = ({
    onPress,
    ref
  }: IButtonProps): React.ReactElement => {
    return (
      <VStack>
        {count && (
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
      trigger={triggerprops => handleTrigger(triggerprops)}>
      <NotificationPanel />
    </Popover>
  )
}
export default NotificationAlert
