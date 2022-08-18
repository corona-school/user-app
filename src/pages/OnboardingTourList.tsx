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
  CheckCircleIcon
} from 'native-base'
import WithNavigation from '../components/WithNavigation'
import CTACard from '../widgets/CTACard'
import EditDataRow from '../widgets/EditDataRow'
import ProfilAvatar from '../widgets/ProfilAvatar'
import ProfileSettingRow from '../widgets/ProfileSettingRow'

type Props = {}

const OnboardingTourList: React.FC<Props> = () => {
  const { colors, space } = useTheme()
  const tabspace = 3

  return (
    <WithNavigation
      headerTitle="Onboarding-Tour"
      headerLeft={<ArrowBackIcon size="xl" color="lightText" />}
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
      <VStack
        paddingX={space['1.5']}
        space={space['1']}
        paddingBottom={space['2']}>
        <CTACard
          variant="dark"
          title="Du brauchst Hife bei deinen Hausaufgaben?"
          closeable={false}
          content={
            <Text>
              Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir
              zeigen dir die wichtigsten Funktionen.
            </Text>
          }
          button={<Button>Tour starten</Button>}
          icon={<CheckCircleIcon size="10" />}
        />
        <CTACard
          variant="dark"
          title="Onboarding-Tour 1:1 Matching"
          closeable={false}
          content={
            <Text>
              Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir
              zeigen dir die wichtigsten Funktionen.
            </Text>
          }
          button={<Button>Tour starten</Button>}
          icon={<CheckCircleIcon size="10" />}
        />
        <CTACard
          variant="dark"
          title="Onboarding-Tour Gruppenkurs"
          closeable={false}
          content={
            <Text>
              Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir
              zeigen dir die wichtigsten Funktionen.
            </Text>
          }
          button={<Button>Tour starten</Button>}
          icon={<CheckCircleIcon size="10" />}
        />
        <CTACard
          variant="dark"
          title="Onboarding-Tour Hilfebereich"
          closeable={false}
          content={
            <Text>
              Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir
              zeigen dir die wichtigsten Funktionen.
            </Text>
          }
          button={<Button>Tour starten</Button>}
          icon={<CheckCircleIcon size="10" />}
        />
        <CTACard
          variant="dark"
          title="Onboarding-Tour Termine"
          closeable={false}
          content={
            <Text>
              Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir
              zeigen dir die wichtigsten Funktionen.
            </Text>
          }
          button={<Button>Tour starten</Button>}
          icon={<CheckCircleIcon size="10" />}
        />
      </VStack>
    </WithNavigation>
  )
}
export default OnboardingTourList
