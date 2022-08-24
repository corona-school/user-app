import { CircleIcon, Box, DeleteIcon } from 'native-base'

import BellIcon from '../assets/icons/lernfair/lf-bell.svg'

type Props = {}

const NotificationAlert: React.FC<Props> = () => {
  return (
    <Box>
      <CircleIcon
        position="absolute"
        top="-4"
        left="-4"
        color="danger.500"
        size="sm"
      />
      <BellIcon />
    </Box>
  )
}
export default NotificationAlert
