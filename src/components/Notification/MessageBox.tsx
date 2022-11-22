import { Box, HStack, Spacer, Text, VStack } from 'native-base'
import { getIcon } from '../../helper/notification-helper'
import { UserNotification } from '../../types/lernfair/Notification'
import TimeIndicator from './TimeIndicator'

type Props = {
  userNotification: UserNotification
  displayTime?: boolean
  isRead?: boolean
}

const MessageBox: React.FC<Props> = ({
  userNotification,
  displayTime = true,
  isRead
}) => {
  const { headline, body, notification, createdAt } = userNotification

  return (
    <Box
      borderRadius={10}
      bgColor={isRead ? 'ghost' : 'primary.100'}
      mb={2}
      h="54px">
      <HStack alignItems="center" space={1}>
        <VStack>
          <Box px="1.5">{getIcon(notification.messageType)}</Box>
        </VStack>
        <VStack mt={2}>
          <Text bold fontSize="md">
            {headline}
          </Text>
          <Text fontSize="sm">{body.slice(0, 30)}</Text>
        </VStack>
        <Spacer />
        <VStack pr="3">
          {displayTime && <TimeIndicator createdAt={createdAt} />}
        </VStack>
      </HStack>
    </Box>
  )
}

export default MessageBox
