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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDataForNotificationPreference } from '../../../helper/notification-helper'

type Props = {
  id: string
  activatedChannels: string[]
}

const PreferenceItem: React.FC<Props> = ({ id, activatedChannels }) => {
  const [emailActivated, setEmailActivated] = useState(true)
  const { t } = useTranslation()

  const preference = getDataForNotificationPreference(id)

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  const maxW = useBreakpointValue({
    base: 200,
    lg: '100%'
  })

  const width = useBreakpointValue({
    base: 300,
    lg: '100%'
  })

  // TODO mutate preferences
  const handleToggle = () => {
    setEmailActivated(!emailActivated)
  }

  useEffect(() => {
    const emailActive = activatedChannels.includes('email')
    emailActive ? setEmailActivated(true) : setEmailActivated(false)
  }, [])

  return (
    <>
      <Box
        borderBottomWidth={1}
        borderBottomColor={'#F7F7F7'}
        py={3}
        width={width}>
        <HStack alignItems="center" space={1}>
          <VStack>{preference?.icon}</VStack>
          <VStack maxW={maxW}>
            <Text
              bold
              fontSize="md"
              mr="3"
              ellipsizeMode="tail"
              numberOfLines={2}>
              {t(preference.title)}
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
            <Switch isChecked={emailActivated} onToggle={handleToggle} />
          </VStack>
        </HStack>
      </Box>
    </>
  )
}

export default PreferenceItem
