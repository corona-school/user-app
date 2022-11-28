import {
  Box,
  Circle,
  FlatList,
  HStack,
  Spacer,
  Switch,
  Text,
  VStack
} from 'native-base'
import IconMessage from '../../assets/icons/lernfair/notifications/Icon_Message.svg'
import IconMatch from '../../assets/icons/lernfair/notifications/Icon_Match.svg'
import IconAppointment from '../../assets/icons/lernfair/notifications/Icon_Appointment.svg'
import IconCourse from '../../assets/icons/lernfair/notifications/Icon_Course.svg'
import IconNews from '../../assets/icons/lernfair/notifications/Icon_News.svg'
import IconSurvey from '../../assets/icons/lernfair/notifications/Icon_Survey.svg'
import { Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'

const data = [
  {
    id: 1,
    title: 'Chat-Nachrichten',
    icon: <IconMessage />
  },
  {
    id: 2,
    title: 'Matches & Informationen zur Zordnung',
    icon: <IconMatch />
  },
  {
    id: 3,
    title: 'Lehrinformationen & Zertifikate',
    icon: <IconCourse />
  },
  {
    id: 4,
    title: 'Terminhinweise',
    icon: <IconAppointment />
  },
  {
    id: 5,
    title: 'Feedback & Befragungen',
    icon: <IconSurvey />
  },
  {
    id: 6,
    title: 'Neue Funktionen & Features',
    icon: <IconNews />
  }
]
const SystemNotifications = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box ml={5}>
        <Text mb={3}>
          {t('notification.controlPanel.tabs.tab1.description')}
        </Text>
        <FlatList
          data={data}
          renderItem={item => (
            <Box borderBottomWidth={1} borderBottomColor={'#F7F7F7'} py={3}>
              <HStack alignItems="center" space={1}>
                <VStack>{item.item.icon}</VStack>
                <VStack>
                  <HStack>
                    <Text bold fontSize="md" mr="3">
                      {item.item.title}
                    </Text>
                    <Pressable onPress={() => console.log('open info modal')}>
                      <Circle rounded="full" bg="amber.700" size={4}>
                        <Box _text={{ color: 'white' }}>i</Box>
                      </Circle>
                    </Pressable>
                  </HStack>
                </VStack>
                <Spacer />
                <VStack>
                  <Switch></Switch>
                </VStack>
              </HStack>
            </Box>
          )}
        />
      </Box>
    </>
  )
}

export default SystemNotifications
