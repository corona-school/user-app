import {
  Text,
  VStack,
  Heading,
  FormControl,
  TextArea,
  Button
} from 'native-base'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'

type Props = {
  description: string
  selectedSubjects: any
  selectedClasses: any
  setSelectedSubjects: any
  setFocusedSubject: any
  setShowModal: any
  setDescription: any
  setCurrentIndex: any
  data: any
}

const RequestMatchWizard: React.FC<Props> = ({
  description,
  selectedSubjects,
  selectedClasses,
  setSelectedSubjects,
  setFocusedSubject,
  setShowModal,
  setDescription,
  setCurrentIndex,
  data
}) => {
  const navigate = useNavigate()

  const isValidInput = useMemo(() => {
    if (description.length < 5) return false

    Object.entries(selectedSubjects)
      .filter(s => s[1] && s)
      .forEach(([sub, _]) => {
        if (!selectedClasses[sub].min || !selectedClasses[sub].max) {
          return false
        }
      })

    return true
  }, [description, selectedSubjects, selectedClasses])

  return (
    <VStack>
      <Heading>Match anfordern</Heading>
      <Text>
        Die 1:1 Lernunterstützung ist eine 1:1 Betreuung für Schüler:innen die
        individuelle Hilfe benötigen.
      </Text>

      <Text mt="1" bold>
        Wichtig
      </Text>
      <Text>
        Es kann bis zu einer Woche dauern, ehe wir ein Match für dich gefunden
        haben.
      </Text>

      <Heading>Persönliche Daten</Heading>

      <Text bold>Für welches Fach möchtest du deine Hilfe anbieten?</Text>
      <Text>
        Solltest du meherere Fächer anbieten wollen, ist eine Mehrfachauswahl
        möglich.
      </Text>

      <TwoColGrid>
        {data?.me?.student?.subjectsFormatted.map((sub: any) => (
          <IconTagList
            variant="center"
            text={sub.name}
            initial={selectedSubjects[sub.name]}
            onPress={() => {
              setSelectedSubjects((prev: any) => ({
                [sub.name]: !prev[sub.name]
              }))
              setFocusedSubject(sub)
              setShowModal(true)
            }}
          />
        ))}
      </TwoColGrid>

      <FormControl>
        <FormControl.Label>Beschreibung</FormControl.Label>
        <TextArea
          autoCompleteType={{}}
          onChangeText={setDescription}
          value={description}
        />
      </FormControl>

      <Button isDisabled={isValidInput} onPress={() => setCurrentIndex(1)}>
        Angaben prüfen
      </Button>
      <Button variant="outline" onPress={() => navigate(-1)}>
        Abbrechen
      </Button>
    </VStack>
  )
}
export default RequestMatchWizard
