import {
  Text,
  VStack,
  Heading,
  Select,
  useTheme,
  Checkbox,
  TextArea,
  Row,
  Column,
  Button
} from 'native-base'
import { useContext } from 'react'
import Accordion from '../../components/Accordion'
import DatePicker from '../../components/DatePicker'
import TextInput from '../../components/TextInput'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'
import { RequestCertificateContext } from '../RequestCertificate'

type Props = {
  onNext: () => any
  onBack: () => any
}

const RequestCertificateData: React.FC<Props> = ({ onNext, onBack }) => {
  const { space } = useTheme()

  const { state, setState } = useContext(RequestCertificateContext)

  return (
    <VStack space={space['1']}>
      <Heading>Informationen eintragen</Heading>

      <VStack space={space['0.5']}>
        <Text bold>Schüler:in</Text>
        <Select
          placeholder="Wähle deine:n Schüler:in"
          onValueChange={pupil =>
            setState(prev => ({ ...prev, pupil: pupil }))
          }>
          <Select.Item value="Schüler:in 1" label={'Schüler:in 1'} />
        </Select>
      </VStack>

      <VStack space={space['0.5']}>
        <Text bold>vom Zeitraum</Text>
        <DatePicker
          onChange={e => setState(prev => ({ ...prev, from: e.target.value }))}
        />
      </VStack>
      <VStack space={space['0.5']}>
        <Text bold>bis zum</Text>
        <DatePicker
          onChange={e => setState(prev => ({ ...prev, to: e.target.value }))}
        />
      </VStack>

      <Checkbox
        value={'ongoing'}
        onChange={val => setState(prev => ({ ...prev, ongoing: val }))}>
        Unterstützung dauert noch an
      </Checkbox>

      <VStack space={space['0.5']}>
        <Text bold>Fächer</Text>
        <TwoColGrid>
          <IconTagList
            initial={state?.subject === 'Fachname'}
            variant="selection"
            text="Fachname"
            onPress={() => setState(prev => ({ ...prev, subject: 'Fachname' }))}
          />
          <IconTagList
            initial={state?.subject === 'other'}
            variant="selection"
            text="Sonstiges"
            onPress={() =>
              setState(prev => ({
                ...prev,
                subject: prev.subject === 'other' ? false : 'other'
              }))
            }
          />
        </TwoColGrid>
        {state?.subject === 'other' && (
          <VStack>
            <Text bold>Sonstige</Text>
            <TextArea autoCompleteType={{}} />
          </VStack>
        )}
      </VStack>

      <VStack space={space['0.5']}>
        <Text bold>Medium</Text>
        <Select
          placeholder="Wähle dein Medium aus"
          onValueChange={medium => setState(prev => ({ ...prev, medium }))}>
          <Select.Item value="Medium 1" label={'Medium 1'} />
        </Select>
      </VStack>

      <VStack space={space['0.5']}>
        <Text bold>Zeit</Text>
        <Row>
          <Column flex={0.4}>
            <TextInput
              onChangeText={t => setState(prev => ({ ...prev, hrsPerWeek: t }))}
            />
          </Column>
          <Text flex="1">Stunden die Woche (durchschnittlich)</Text>
        </Row>
        <Row>
          <Column flex={0.4}>
            <TextInput
              onChangeText={t => setState(prev => ({ ...prev, hrsTotal: t }))}
            />
          </Column>
          <Text flex="1">Stunden insgesamt</Text>
        </Row>
      </VStack>

      <VStack space={space['0.5']}>
        <Text bold>Tätigkeit</Text>
        <Accordion title="Wähle deine Tätigkeiten">
          <Checkbox
            value="preparation"
            onChange={val => setState(prev => ({ ...prev, preparation: val }))}>
            Vorbereitung, Planung und Gestaltung von Unterrichtsstunden
          </Checkbox>
          <Checkbox
            value="organisation"
            onChange={val =>
              setState(prev => ({ ...prev, organisation: val }))
            }>
            Bearbeitung und Vermittlung von Unterrichtsinhalten
          </Checkbox>
          <Checkbox
            value="digital"
            onChange={val => setState(prev => ({ ...prev, digital: val }))}>
            Digitale Aufbereitung und Veranschaulichung von Unterrichtsinhalten
          </Checkbox>
          <Checkbox
            value="detail"
            onChange={val => setState(prev => ({ ...prev, detail: val }))}>
            Vertiefung und Wiederholung von Unterrichtsinhalten
          </Checkbox>
          <Checkbox
            value="group"
            onChange={val => setState(prev => ({ ...prev, group: val }))}>
            Gemeinsame Bearbeitung von Übungs- und Hausaufgaben
          </Checkbox>
          <Checkbox
            value="correction"
            onChange={val => setState(prev => ({ ...prev, correction: val }))}>
            Korrektur von Übungs- und Hausaufgaben
          </Checkbox>
          <Checkbox
            value="testprep"
            onChange={val => setState(prev => ({ ...prev, testprep: val }))}>
            Digitale Unterstützung bei der Prüfungsvorbereitung
          </Checkbox>
          <Checkbox
            value="digital-help"
            onChange={val => setState(prev => ({ ...prev, digitalhelp: val }))}>
            Digitale Unterstützung beim Lernen
          </Checkbox>
          <Text bold>Sonstiges</Text>
          <Button>Tätigkeit hinzufügen</Button>
        </Accordion>
        <Button onPress={onNext}>Weiter</Button>
        <Button variant="link" onPress={onBack}>
          Zurück
        </Button>
      </VStack>
    </VStack>
  )
}
export default RequestCertificateData
