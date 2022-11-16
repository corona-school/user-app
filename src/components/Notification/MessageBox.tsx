import { Box, HStack, Spacer, Text, VStack } from 'native-base'
import {
  getIconForCategory,
  getTimeDifference
} from '../../helper/notification-helper'
import { UserNotification } from '../../types/lernfair/Notification'

type Props = {
  notification: UserNotification
}

const MessageBox: React.FC<Props> = ({ notification }) => {
  const { notificationClass, headline, body, createdAt } = notification
  // const { headline, description, category, createdAt }
  const createdAtDummy = '2022-11-12T14:00'

  return (
    <Box borderRadius={2} bgColor="primary.100" mb={2} h="54px">
      <HStack alignItems="center" space={2}>
        <VStack>
          <Box pl={'8px'}>{getIconForCategory(notificationClass)}</Box>
        </VStack>
        <VStack>
          <Text bold mt={2}>
            {headline}
          </Text>
          <Text>{body.slice(0, 10)}</Text>
        </VStack>
        <Spacer />
        {createdAt && (
          <VStack>
            <Text pr={'8px'}>{getTimeDifference(createdAtDummy)}</Text>
          </VStack>
        )}
      </HStack>
    </Box>
  )
}

export default MessageBox
