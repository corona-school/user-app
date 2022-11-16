import { Box, HStack, Spacer, Text, VStack } from 'native-base'
import {
  getIconForCategory,
  getTimeDifference
} from '../../helper/notification-helper'
import { DummyUserNotification } from '../../types/lernfair/Notification'

type Props = {
  notification: DummyUserNotification
}

const MessageBox: React.FC<Props> = ({ notification }) => {
  const { id, description, category } = notification
  // const { headline, body, messageType, createdAt } = notification
  const createdAtDummy = '2022-11-16T12:34'

  return (
    <Box borderRadius={2} bgColor="primary.100" mb={2} h="54px">
      <HStack alignItems="center" space={2}>
        <VStack>
          <Box pl={'8px'}>{getIconForCategory('NotificationClass0')}</Box>
        </VStack>
        <VStack>
          <Text bold mt={2}>
            {description.slice(0, 10)}
          </Text>
          <Text>{description.slice(0, 10)}</Text>
        </VStack>
        <Spacer />
        {createdAtDummy && (
          <VStack>
            <Text pr={'8px'}>{getTimeDifference(createdAtDummy)}</Text>
          </VStack>
        )}
      </HStack>
    </Box>
  )
}

export default MessageBox
