import { Text, VStack, Heading, useTheme, Button } from 'native-base'

type Props = {
  onAutomatic: () => any
  onManual: () => any
  onBack: () => any
}

const RequestCertificateMode: React.FC<Props> = ({
  onAutomatic,
  onManual,
  onBack
}) => {
  const { space } = useTheme()

  return (
    <VStack space={space['1.5']}>
      <Heading>Modus auswählen</Heading>

      <VStack space={space['0.5']}>
        <Text bold>Automatisch anfordern</Text>
        <Text>
          Alles fertig ausgefüllt? Dann kannst du die Daten jetzt abschicken:
        </Text>
        <Button onPress={onAutomatic}>Automatisch anfordern</Button>
      </VStack>
      <VStack space={space['0.5']}>
        <Text bold>Manuell erstellen</Text>
        <Text>
          Alternativ kannst du die Bescheinigung auch manuell herunterladen und
          an deine:n Schüler:in per E-Mail verschicken:
        </Text>
        <Button variant="outline" onPress={onManual}>
          Manuell erstellen
        </Button>
      </VStack>
      <Button variant="link" onPress={onBack}>
        Zurück
      </Button>
    </VStack>
  )
}
export default RequestCertificateMode
