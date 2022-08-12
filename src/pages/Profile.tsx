import {
  Button,
  Box,
  Avatar,
  Heading,
  useTheme,
  VStack,
  Row
} from 'native-base'
import CTACard from '../widgets/CTACard'
import SimpleDataRow from '../widgets/SimpleDataRow'
import SubjectTag from '../widgets/SubjectTag'

type Props = {}

const Profile: React.FC<Props> = () => {
  const { colors, space } = useTheme()

  return (
    <VStack space={space['1']}>
      <Box
        bg={'primary.100'}
        alignItems="center"
        paddingY={space['2']}
        borderBottomRadius={16}>
        <Avatar size="xl" />
        <Heading color={colors.white}>Tina</Heading>
      </Box>
      <VStack paddingX={space['1']} space={space['1']}>
        <CTACard
          title="Wir möchten dich kennenlernen"
          content="Bevor du bei uns anfangen kannst möchten wir dich in einem persönlichen Gespräch kennenlernen. Vereinbare einfach einen Termin mit uns."
          button={<Button onPress={() => null}>Termin vereinbaren</Button>}
        />
        <CTACard
          variant="outline"
          closeable={false}
          title="Führungszeugnis"
          content="Denke dran, dein Führungszeugnis einzureichen, damit du weiterhin bei uns mitmachen kannst. Hierfür hast du 2 Monate nach Registrierung Zeit."
          button={
            <VStack space={space['0.5']}>
              <Button variant={'outline'} onPress={() => null}>
                Vordruck herunterladen
              </Button>
              <Button onPress={() => null}>Einreichen</Button>
            </VStack>
          }
        />
        <Button onPress={() => null}>Profil vervollständigen</Button>
        <VStack space={space['0.5']}>
          <Heading>Persönliche Daten</Heading>
          <SimpleDataRow label="Name" value="Rainer Zufall" />
          <SimpleDataRow label="Schulform" value="Gymnasium, Gesamtschule" />
          <SimpleDataRow label="Klasse" value="6, 7, 8" />
          <SimpleDataRow label="Art der Unterstützung" value="1:1 Betreuung" />
          <SimpleDataRow label="Meine Verfügbarkeit" value="Wochenende" />
        </VStack>
        <Heading>Meine Fächer</Heading>
        <Row space={space['0.5']}>
          <SubjectTag title="Englisch" />
          <SubjectTag title="Informatik" />
          <SubjectTag title="Mathematik" />
        </Row>
      </VStack>
    </VStack>
  )
}
export default Profile
