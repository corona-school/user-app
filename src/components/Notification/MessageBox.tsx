import { Box, HStack, Spacer, Text, VStack } from 'native-base'
import { getIconForCategory } from '../../helper/notification-helper'
import { UserNotification } from '../../types/lernfair/Notification'
import TimeAgo from './TimeAgo'

type Props = {
  userNotification: UserNotification
  isToast?: boolean
  isRead?: boolean
}

const MessageBox: React.FC<Props> = ({ userNotification, isToast, isRead }) => {
  const { headline, body, notification, createdAt } = userNotification

  return (
    <Box borderRadius={2} bgColor={isRead ? '' : 'primary.100'} mb={2} h="54px">
      <HStack alignItems="center" space={1}>
        <VStack>
          <Box p={'8px'}>{getIconForCategory(notification.messageType)}</Box>
        </VStack>
        <VStack>
          <Text bold fontSize="14px" mt={2}>
            {headline}
          </Text>
          <Text fontSize="12px">{body.slice(0, 30)}</Text>
        </VStack>
        <Spacer />
        <Box>{!isToast && <TimeAgo createdAt={createdAt} />}</Box>
      </HStack>
    </Box>
  )
}

export default MessageBox
