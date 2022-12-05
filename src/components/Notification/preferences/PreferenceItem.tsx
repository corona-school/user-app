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
import { getInformationsForMessageTypeNotificationPreference } from '../../../helper/notification-helper'
import { useUserPreferences } from '../../../hooks/useUserNotificationPreferences'
import { NotificationPreference } from './PreferencesData'

type PrefProps = {
  id: string
  channel: { [channel: string]: boolean }
}

const PreferenceItem: React.FC<PrefProps> = ({ id, channel }) => {
  const [emailActivated, setEmailActivated] = useState<boolean>(true)
  const { t } = useTranslation()
  const { userPreferences } = useUserPreferences()

  const preferenceInformation =
    getInformationsForMessageTypeNotificationPreference(id)

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

  const handleToggle = (event: any) => {
    console.log(event)
    userPreferences.map((pref: NotificationPreference) =>
      Object.keys(pref).map((key: string) => console.log(pref[key]))
    )

    // TODO change value of one channel (reduce?)
    const newPreferences = Object.keys(channel).map(key => {
      if (key === 'email') return { ...channel, email: event }
    })

    setEmailActivated(event)
  }

  const filterActiveNotificationPreferncesAndCheckForActiveEmail = () => {
    const activeChannels = Object.keys(channel).filter(
      key => channel[key] === true
    )
    const email = activeChannels.includes('email')
    setEmailActivated(email)
  }

  useEffect(() => {
    filterActiveNotificationPreferncesAndCheckForActiveEmail()
  }, [])

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
            <Switch
              value={emailActivated}
              onValueChange={event => handleToggle(event)}
            />
          </VStack>
        </HStack>
      </Box>
    </>
  )
}

export default PreferenceItem
