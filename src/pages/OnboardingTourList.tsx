import {
  Button,
  Box,
  Text,
  Heading,
  useTheme,
  VStack,
  Column,
  ArrowBackIcon,
  Badge,
  DeleteIcon,
  HStack,
  CheckCircleIcon,
  Stagger
} from 'native-base'
import BackButton from '../components/BackButton'
import WithNavigation from '../components/WithNavigation'
import CTACard from '../widgets/CTACard'
import EditDataRow from '../widgets/EditDataRow'
import ProfilAvatar from '../widgets/ProfilAvatar'
import ProfileSettingRow from '../widgets/ProfileSettingRow'

type Props = {}

const cards = [
  {
    title: 'Du brauchst Hife bei deinen Hausaufgaben?',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title: 'Onboarding-Tour 1:1 Matching',
    text: ' Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title: 'Onboarding-Tour Gruppenkurs',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title: 'Onboarding-Tour Hilfebereich',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  },
  {
    title: 'Onboarding-Tour Termine',
    text: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.'
  }
]

const OnboardingTourList: React.FC<Props> = () => {
  const { space } = useTheme()

  return (
    <WithNavigation
      headerTitle="Onboarding-Tour"
      headerLeft={<BackButton />}
      headerRight={
        <Box>
          <Badge
            bgColor={'danger.500'}
            rounded="3xl"
            zIndex={1}
            variant="solid"
            alignSelf="flex-end"
            top="2"
            right="-5">
            {' '}
          </Badge>
          <DeleteIcon color="lightText" size="xl" />
        </Box>
      }>
      <VStack paddingTop={space['4']} paddingBottom={7} paddingX={space['1.5']}>
        <Heading paddingBottom={space['0.5']}>Onboarding</Heading>
        <Text maxWidth={330}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod.
        </Text>
      </VStack>
      <VStack paddingX={space['1.5']} paddingBottom={space['2']}>
        <Stagger
          initial={{ opacity: 0, translateY: 20 }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: { stagger: { offset: 60 }, duration: 500 }
          }}
          visible>
          {cards.map(({ title, text }) => (
            <CTACard
              marginBottom={space['1']}
              variant="dark"
              title={title}
              closeable={false}
              content={<Text>{text}</Text>}
              button={<Button>Tour starten</Button>}
              icon={<CheckCircleIcon size="10" />}
            />
          ))}
        </Stagger>
      </VStack>
    </WithNavigation>
  )
}
export default OnboardingTourList
