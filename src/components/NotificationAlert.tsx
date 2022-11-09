import { Box, Text, Circle } from 'native-base'

import BellIcon from '../assets/icons/lernfair/lf-bell.svg'

type Props = { count?: number }

const NotificationAlert: React.FC<Props> = ({ count = 1 }) => {
  return <></>
  return (
    <Box>
      <Circle
        position="absolute"
        top="-4"
        left="-4"
        bgColor="danger.500"
        size="3.5">
        <Text color="lightText" bold fontSize="xs">
          {count}
        </Text>
      </Circle>
      <BellIcon />
    </Box>
  )
}
export default NotificationAlert
