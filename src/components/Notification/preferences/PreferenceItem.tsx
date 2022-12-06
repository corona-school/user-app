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
import { getInformationsForMessageTypeNotificationPreference } from '../../../helper/notification-helper'

type PrefProps = {
  category: string
  channel: string
  value: boolean
  onUpdate: (value: boolean) => void
}

const PreferenceItem: React.FC<PrefProps> = ({
  category,
  channel,
  value,
  onUpdate
}) => {
  const { t } = useTranslation()

  const preferenceInformation =
    getInformationsForMessageTypeNotificationPreference(category)

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
          <VStack>{preferenceInformation?.icon}</VStack>
          <VStack maxW={maxW}>
            <Text fontSize="md" mr="3" ellipsizeMode="tail" numberOfLines={2}>
              {t(preferenceInformation.title)}
              <>
                {isMobile ? (
                  <Pressable
                    ml={1}
                    // TODO treated in another PR
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
