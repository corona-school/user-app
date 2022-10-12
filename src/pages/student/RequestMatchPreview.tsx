import { Text, VStack, Heading, Button, useTheme } from 'native-base'
import ToggleButton from '../../components/ToggleButton'
import Utility from '../../Utility'
import IconTagList from '../../widgets/IconTagList'

type Props = {
  subjects: string[]
  classes: {
    [key: string]: { [key: string]: boolean }
  }
  description: string
  onRequestMatch: () => any
  onBack: () => any
  disableButton: boolean
  disableReason: string
}

const RequestMatchPreview: React.FC<Props> = ({
  subjects,
  classes,
  description,
  onRequestMatch,
  onBack,
  disableButton,
  disableReason
}) => {
  const { space } = useTheme()
  return (
    <VStack space={space['1']}>
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
          {Object.entries(classes[sub] || {}).map(([key, val], index: any) => {
            const range = Utility.intToClassRange(parseInt(key))

            return (
              <ToggleButton
                dataKey={index}
                isActive={false}
                label={`${range.min}. - ${range.max}. Klasse`}
              />
            )
          })}
        </VStack>
      ))}
      <Text bold>Beschreibung</Text>
      <Text>{description}</Text>

      <Button onPress={onRequestMatch} isDisabled={disableButton}>
        Match anfordern
      </Button>
      {disableButton && <Text>{disableReason}</Text>}
      <Button variant={'outline'} onPress={onBack}>
        Daten bearbeiten
      </Button>
    </VStack>
  )
}
export default RequestMatchPreview
