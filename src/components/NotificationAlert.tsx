import { CircleIcon, Box, DeleteIcon } from 'native-base'

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
      <DeleteIcon color="lightText" size="xl" />
    </Box>
  )
}
export default NotificationAlert
