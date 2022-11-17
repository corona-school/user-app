import { Box, HStack, Spacer, Text, VStack } from 'native-base'
import { getIconForCategory } from '../../helper/notification-helper'
import { useTimeDifference } from '../../hooks/useNotificationPanel'
import { UserNotification } from '../../types/lernfair/Notification'

type Props = {
  userNotification: UserNotification
}

const MessageBox: React.FC<Props> = ({ userNotification }) => {
  const { headline, body, notification, sentAt } = userNotification

  return (
    <Box borderRadius={2} bgColor="primary.100" mb={2} h="54px">
      <HStack alignItems="center" space={2}>
        <VStack>
          <Box pl={'8px'}>{getIconForCategory(notification.messageType)}</Box>
        </VStack>
        <VStack>
          <Text bold mt={2}>
            {headline}
          </Text>
          <Text>{body.slice(0, 20)}</Text>
        </VStack>
        <Spacer />
        <VStack>
          <Text pr={'8px'}>{useTimeDifference(sentAt)}</Text>
        </VStack>
      </HStack>
    </Box>
  )
}

export default MessageBox
