import { Text, VStack, Heading, Button } from 'native-base'
import IconTagList from '../../widgets/IconTagList'

type Props = {
  subjects: string[]
  classes: {
    [key: string]: { [key: string]: boolean }
  }
  description: string
  onRequestMatch: () => any
  onBack: () => any
}

const RequestMatchPreview: React.FC<Props> = ({
  subjects,
  classes,
  description,
  onRequestMatch,
  onBack
}) => {
  return (
    <VStack>
      <Heading>Angaben prüfen</Heading>
      <Text>
        Bitte überprüfe deine Angaben noch einmal, bevor du dein Match
        anforderst.
      </Text>

      {subjects.map((sub: any, index) => (
        <VStack>
          <Text bold>Fach {index + 1}</Text>
          <IconTagList variant="center" text={sub} isDisabled />
          <Text bold>Klassen für Fach {index + 1}</Text>
          {
            // classes[sub.name].map
          }
        </VStack>
      ))}
      <Text bold>Beschreibung</Text>
      <Text>{description}</Text>

      <Button>Match anfordern</Button>
      <Button variant={'outline'}>Daten bearbeiten</Button>
    </VStack>
  )
}
export default RequestMatchPreview
