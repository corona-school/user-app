import { gql, useQuery } from '@apollo/client'
import { Text, useTheme, VStack, Checkbox, Button } from 'native-base'
import { useCallback, useContext, useState } from 'react'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import { LFMatch } from '../../types/lernfair/Match'
import { RequestCertificateContext } from '../../pages/RequestCertificate'

type Props = {
  onNext: () => any
}

const SelectPupilsWidget: React.FC<Props> = ({ onNext }) => {
  const { space } = useTheme()
  const [_selections, setSelections] = useState<string[]>([])
  const { state, setState } = useContext(RequestCertificateContext)

  const { data, loading } = useQuery(gql`
    query {
      me {
        student {
          subjectsFormatted {
            name
          }
          matches {
            subjectsFormatted {
              name
            }
            pupil {
              id
              firstname
              lastname
            }
          }
        }
      }
    }
  `)

  const next = useCallback(() => {
    if (!data?.me?.student?.matches) return []
    const selections: LFMatch[] | undefined = _selections?.map((id: string) => {
      return data.me.student.matches.find(
        (match: LFMatch) => match.pupil.id === id
      )
    })
    if (!selections) return
    setState(prev => ({ ...prev, pupilMatches: selections }))
    onNext()
  }, [_selections, data?.me?.student?.matches, onNext, setState])

  if (loading) return <CenterLoadingSpinner />

  return (
    <VStack space={space['1']}>
      <Text>
        Bei welchen Schüler:innen möchtest du eine Bescheinigung beantragen?
      </Text>
      <Checkbox.Group
        accessibilityLabel="Wähle deine Schüler:innen"
        onChange={setSelections}
        value={_selections}>
        <VStack space={space['1']}>
          {data?.me?.student?.matches?.map((match: LFMatch) => (
            <Checkbox value={match.pupil.id}>
              {`${match.pupil.firstname} ${match.pupil.lastname}`}
            </Checkbox>
          ))}
        </VStack>
      </Checkbox.Group>

      <Button isDisabled={_selections.length === 0} onPress={next}>
        Weiter
      </Button>
      <Button variant="link">Zurück</Button>
    </VStack>
  )
}
export default SelectPupilsWidget
