import {
  Box,
  HStack,
  VStack,
  Text,
  Pressable,
  Circle,
  Spacer,
  Switch,
  useBreakpointValue,
  Tooltip
} from 'native-base'
import { useTranslation } from 'react-i18next'
import { FC } from "react"
import { NotificationCategoryDetails } from "../../../helper/notification-preferences"

type PrefProps = {
  category: string
  notificationTypeDetails: NotificationCategoryDetails
  value: boolean
  onUpdate: (value: boolean) => void
}

const PreferenceItem: React.FC<PrefProps> = ({
  notificationTypeDetails,
  value,
  onUpdate
}) => {
  const { t } = useTranslation()

  const Icon: FC = notificationTypeDetails?.icon ? notificationTypeDetails?.icon : () => null

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  const maxW = useBreakpointValue({
    base: 200,
    lg: '100%'
  })

  const width = useBreakpointValue({
    base: 340,
    lg: '100%'
  })

  const handleToggle = (preferenceValue: boolean) => {
    onUpdate(preferenceValue)
  }

  return (
    <>
      <Box
        borderBottomWidth={1}
        borderBottomColor={'#F7F7F7'}
        py={3}
        width={width}>
        <HStack alignItems="center" space={1}>
          {notificationTypeDetails?.icon && (
            <VStack><Icon /></VStack>
          )}
          <VStack maxW={maxW}>
            <Text fontSize="md" mr="3" ellipsizeMode="tail" numberOfLines={2}>
              {t(notificationTypeDetails.title)}
              <>
                {isMobile ? (
                  <Pressable
                    ml={1}
                    onPress={() => console.log('open info modal')}>
                    <Circle rounded="full" bg="amber.700" size={4}>
                      <Box _text={{ color: 'white' }}>i</Box>
                    </Circle>
                  </Pressable>
                ) : (
                  <Tooltip label="Testlabel">
                    <Circle rounded="full" bg="amber.700" size={4} ml={1}>
                      <Box _text={{ color: 'white' }}>i</Box>
                    </Circle>
                  </Tooltip>
                )}
              </>
            </Text>
          </VStack>
          <Spacer />
          <VStack>
            <Switch value={value} onToggle={() => handleToggle(!value)} />
          </VStack>
        </HStack>
      </Box>
    </>
  )
}

export default PreferenceItem
