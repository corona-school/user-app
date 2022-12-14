import {
  Text,
  useTheme,
  VStack,
  Select,
  Checkbox,
  Button,
  Row,
  Column,
  TextArea,
  Heading
} from 'native-base'
import { useContext, useState } from 'react'
import Accordion from '../../components/Accordion'
import DatePicker from '../../components/DatePicker'
import TextInput from '../../components/TextInput'
import { getSubjectKey, LFSubject } from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'
import { RequestCertificateContext } from '../RequestCertificate'

type Props = {}

const RequestCertificateGroupWizard: React.FC<Props> = () => {
  const { space } = useTheme()
  const { state, setState } = useContext(RequestCertificateContext)
  const [others, setOthers] = useState<string[]>([])
  const [addOther, setAddOther] = useState<string>('')
  const data: any = {}
  return (
    <>
      <Heading>Group Group Group</Heading>
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
          {data?.me?.student?.subjectsFormatted.map((subject: LFSubject) => (
            <Column mb={space['0.5']}>
              <IconTagList
                initial={state?.subject === subject.name}
                variant="selection"
                text={subject.name}
                iconPath={`languages/icon_${getSubjectKey(subject.name)}.svg`}
                onPress={() =>
                  setState(prev => ({ ...prev, subject: subject.name }))
                }
              />
            </Column>
          ))}
          <Column mb={space['0.5']}>
            <IconTagList
              initial={state?.subject === 'other'}
              variant="selection"
              text="Sonstiges"
              iconPath={`languages/icon_andere.svg`}
              onPress={() =>
                setState(prev => ({
                  ...prev,
                  subject: prev.subject === 'other' ? false : 'other'
                }))
              }
            />
          </Column>
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
        <Row alignItems="center">
          <Column flex={0.4}>
            <TextInput
              keyboardType="numeric"
              onChangeText={t => setState(prev => ({ ...prev, hrsPerWeek: t }))}
            />
          </Column>
          <Text flex="1" ml={space['1']}>
            Stunden die Woche (durchschnittlich)
          </Text>
        </Row>
        <Row alignItems="center">
          <Column flex={0.4}>
            <TextInput
              keyboardType="numeric"
              onChangeText={t => setState(prev => ({ ...prev, hrsTotal: t }))}
            />
          </Column>
          <Text flex="1" ml={space['1']}>
            Stunden insgesamt
          </Text>
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
          <Text bold mb="1" mt="3">
            Sonstiges
          </Text>
          {others.map((o: string) => (
            <Row my="1">
              <Checkbox
                value={o}
                defaultIsChecked
                onChange={val => setState(prev => ({ ...prev, [o]: val }))}>
                {o}
              </Checkbox>
            </Row>
          ))}
          <Row>
            <TextInput
              flex="1"
              value={addOther}
              onChangeText={setAddOther}
              _input={{ color: 'darkText' }}
            />
            <Button
              isDisabled={!addOther}
              onPress={() => {
                setOthers(prev => [...prev, addOther])
                setAddOther('')
              }}>
              +
            </Button>
          </Row>
        </Accordion>
        <Button>Weiter</Button>
        <Button variant="link">Zurück</Button>
      </VStack>
    </>
  )
}
export default RequestCertificateGroupWizard
