import { gql, useQuery } from '@apollo/client'
import { Text, VStack, Heading, TextArea, Button, useTheme } from 'native-base'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LFSubject } from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'

type Props = {}

const subs: LFSubject[] = [
  { name: 'Englisch', grade: { min: 1, max: 11 }, mandatory: false },
  { name: 'Informatik', grade: { min: 1, max: 11 }, mandatory: false }
]

const MatchingWizard: React.FC<Props> = () => {
  const navigate = useNavigate()
  const { space } = useTheme()
  const { data, error, loading } = useQuery(gql`
    query {
      me {
        pupil {
          schooltype
          gradeAsInt
          subjectsFormatted {
            name
          }
        }
      }
    }
  `)

  const onRequestMatch = useCallback(() => {}, [])

  return (
    <VStack space={space['1']} paddingX={space['1']}>
      <Heading>Überprüfen deine Daten</Heading>
      <Text>
        Damit wir dir eine:n optimale:n Lernpartner:in zuteilen können, bitten
        wir dich deine persönlichen Informationen noch einmal zu überprüfen und
        zu vervollständigen.
      </Text>
      <Text bold>Persönliche Daten</Text>

      <Text>
        <Text bold>Schulform:</Text> {data?.me?.pupil?.schooltype}
      </Text>
      <Text>
        <Text bold>Klasse:</Text> {data?.me?.pupil?.gradeAsInt}
      </Text>
      <Text bold>In welchem Fach benötigst du Hilfe?</Text>
      <Text>
        Solltest du in mehreren Fächern gleich drigend Hilfe benötigen, ist eine
        Mehrfachauswahl möglich.
      </Text>
      <TwoColGrid>
        {subs.map((sub: any) => (
          <IconTagList text={sub.name} variant="selection" />
        ))}
      </TwoColGrid>
      <Text bold>Beschreibung</Text>
      <TextArea autoCompleteType={{}} />
      <Button onPress={onRequestMatch}>Match anfordern</Button>
      <Button variant={'outline'} onPress={() => navigate(-1)}>
        Abbrechen
      </Button>
    </VStack>
  )
}
export default MatchingWizard
