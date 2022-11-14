import { Box, HStack, Spacer, Text, VStack } from 'native-base'
import { getIconForCategory } from '../../helper/notification-helper'

import {
  InAppNotification,
  NotificationType
} from '../../types/lernfair/Notification'

type Props = {
  notification: InAppNotification
}

const MessageBox: React.FC<Props> = ({ notification }) => {
  const { category, description } = notification

  return (
    <Box borderRadius={2} bgColor="primary.100" mb={2} h="54px">
      <HStack alignItems="center" space={2}>
        {/* ICON */}
        <Box>{getIconForCategory(NotificationType.SURVEY)}</Box>
        <VStack>
          {/* HEADER */}
          <Text bold>{description.slice(0, 20)}</Text>
          {/* BODY Text */}
          <Text>{category.toString()}</Text>
        </VStack>
        <Spacer />
        <VStack>
          {/* DURATION */}
          <Text>15 min</Text>
        </VStack>
      </HStack>
    </Box>
  )
}

export default MessageBox
