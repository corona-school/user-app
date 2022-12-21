import { Box, HStack, Spacer, Text, VStack } from 'native-base'
import { getIconForMessageType } from '../../helper/notification-helper'
import { UserNotification } from '../../types/lernfair/Notification'
import TimeIndicator from './TimeIndicator'

type Props = {
  userNotification: UserNotification
  isStandalone?: boolean
  isRead?: boolean
}

const MessageBox: React.FC<Props> = ({
  userNotification,
  isStandalone,
  isRead
}) => {
  const { sentAt } = userNotification
  const { headline, body, messageType } = userNotification.message

  const boxProps = {
    mb: 2,
    height: 54,
    fullWidth: 320,
    width: 270,
    borderRadius: 10
  }

  const vStackProps = {
    mt: 2,
    maxW: 200
  }

  const Icon = getIconForMessageType(messageType)

  return (
    <Box
      borderRadius={boxProps.borderRadius}
      bgColor={isRead ? 'ghost' : 'primary.100'}
      mb={boxProps.mb}
      h={boxProps.height}
      w={!isStandalone ? boxProps.fullWidth : boxProps.width}>
      <HStack alignItems="center" space={1}>
        <VStack>
          <Box px="1.5"><Icon /></Box>
        </VStack>
        <VStack mt={vStackProps.mt} maxW={vStackProps.maxW}>
          <Text bold fontSize="md">
            {headline}
          </Text>
          <Text fontSize="sm" ellipsizeMode="tail" numberOfLines={1}>
            {body}
          </Text>
        </VStack>
        <Spacer />
        {!isStandalone && (
          <VStack>
            <TimeIndicator sentAt={sentAt} />
          </VStack>
        )}
      </HStack>
    </Box>
  )
}

export default MessageBox
