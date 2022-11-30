import {
  Box,
  HStack,
  Spacer,
  Text,
  useBreakpointValue,
  VStack
} from 'native-base'
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
  const { headline, body, notification, createdAt } = userNotification

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

  return (
    <Box
      borderRadius={boxProps.borderRadius}
      bgColor={isRead ? 'ghost' : 'primary.100'}
      mb={boxProps.mb}
      h={boxProps.height}
      w={!isStandalone ? boxProps.fullWidth : boxProps.width}>
      <HStack alignItems="center" space={1}>
        <VStack>
          <Box px="1.5">{getIconForMessageType(notification.messageType)}</Box>
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
            <TimeIndicator createdAt={createdAt} />
          </VStack>
        )}
      </HStack>
    </Box>
  )
}

export default MessageBox
