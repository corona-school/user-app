import { gql, useQuery } from '@apollo/client'
import { View, Text, VStack, Heading, Button, useTheme } from 'native-base'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Tabs from '../../components/Tabs'
import WithNavigation from '../../components/WithNavigation'
import LearningPartner from '../../widgets/LearningPartner'

type Props = {}

const MatchingStudent: React.FC<Props> = () => {
  const { space } = useTheme()
  const navigate = useNavigate()
  const { data, loading, error } = useQuery(gql`
    query {
      me {
        student {
          matches {
            id
            pupil {
              firstname
              subjects
              schooltype
              gradeAsInt
            }
          }
          canRequestMatch {
            allowed
            reason
            limit
          }
          openMatchRequestCount
        }
      }
    }
  `)

  return (
    <WithNavigation>
      <VStack paddingX={space['1']}>
        <Heading>Match anfordern</Heading>
        <VStack space={space['0.5']}>
          <Text>
            Die 1:1 Lernunterstützung ist eine 1:1 Betreuung für Schüler:innen
            die individuelle Hilfe benötigen.
          </Text>

          <Text mt="1" bold>
            Wichtig
          </Text>
          <Text>
            Es kann bis zu einer Woche dauern, ehe wir ein Match für dich
            gefunden haben.
          </Text>
          <Button onPress={() => navigate('/request-match')}>
            Match anfordern
          </Button>
        </VStack>

        <Tabs
          tabs={[
            {
              title: 'Matches',
              content: (
                <VStack>
                  {(data?.me?.student?.matches.length &&
                    data?.me?.student?.matches?.map((pupil: any) => (
                      <LearningPartner
                        subjects={pupil.subjects}
                        name={pupil.firstname}
                        schoolclass={pupil.gradeAsInt}
                        schooltype={pupil.schooltype}
                      />
                    ))) || <Text>Du hast keine Matches</Text>}
                </VStack>
              )
            }
          ]}
        />
      </VStack>
    </WithNavigation>
  )
}
export default MatchingStudent
