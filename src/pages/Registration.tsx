import {
  Text,
  VStack,
  Input,
  Heading,
  Checkbox,
  Button,
  Modal,
  useTheme
} from 'native-base'
import { useState } from 'react'
import ToggleButton from '../components/ToggleButton'

type Props = {}

const Registration: React.FC<Props> = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [legalChecked, setLegalChecked] = useState<boolean>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { space } = useTheme()

  return (
    <>
      <VStack flex="1" paddingX={space['0.5']}>
        <VStack space={space['0.5']}>
          <Input placeholder="Email" />
          <Input placeholder="Passwort" />
          <Input placeholder="Passwort wiederholen" />
        </VStack>
        <VStack space={space['0.5']} marginTop={space['1']}>
          <Heading>Ich bin</Heading>
          <ToggleButton label="Elternteil" />
          <ToggleButton label="Schüler:in" />
          <ToggleButton label="Helfer:in" />
        </VStack>
        <VStack space={space['1']} marginTop={space['1']}>
          <Checkbox value={'legalChecked'} onChange={setLegalChecked}>
            Hiermit stimme ich den Nutzungsbedingungen und der
            Datenschutzerklärung zu.
          </Checkbox>
          <Button onPress={() => setModalVisible(true)}>Weiter</Button>
        </VStack>
      </VStack>
      <Modal isOpen={modalVisible} onClose={setModalVisible} size={'full'}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Wichtig</Modal.Header>
          <Modal.Body>
            <Text>
              Unsere Angebote richten sich an bildungsbenachteiligten
              Schüler:innen. Du weißt nicht genau, ob du zu dieser Zielgruppe
              gehörst?
            </Text>
            <Text>
              Dann schaue dir die nachfolgenden Punkte an. Kannst du zwei oder
              mehr von ihnen mit "ja" beantworten? Dann darfst du gerne alle
              Angebote von Lern-Fair nutzen.
            </Text>
            <Checkbox value={''}>
              Sind deine Eltern/ Erziehungsberechtigten nicht in der Lage, eine
              Nachhilfe für dich zu finanzieren?
            </Checkbox>
            <Checkbox value={''}>
              Sind beide Eltern/ Erziehungsberechtigten nicht erwerbstätig
            </Checkbox>
            <Checkbox value={''}>
              Sind beide Eltern/ Erziehungsberechtigten physisch oder psychisch
              (aufgrund einer Krankheit / eines Unfalls etc.) eingeschränkt?
            </Checkbox>
            <Checkbox value={''}>
              Bist du von einer physischen Krankheit betroffen, die es erschwert
              zur Schule zu gehen?
            </Checkbox>
            <Checkbox value={''}>
              Bist du oder sind deine Eltern nicht in Deutschland geboren?
            </Checkbox>
            <Checkbox value={''}>
              Können dir deine Eltern/ Erziehungsberechtigten aufgrund einer
              sprachlichen Barriere nicht bei den Hausaufgaben helfen?
            </Checkbox>
            <Checkbox value={''}>
              Können dir deine Eltern/ Erziehungsberechtigten wegen ihres
              Bildungsweges nicht bei den Hausaufgaben helfen?
            </Checkbox>
            <Text>
              Wenn du dir noch immer unsicher bist und noch Fragen hast, dann
              wende dich bitte an sorgen-eule@lern-fair.de
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false)
                }}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setModalVisible(false)
                }}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default Registration
