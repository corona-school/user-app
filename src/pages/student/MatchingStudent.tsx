import { gql, useQuery } from '@apollo/client'
import { View, Text, VStack, Heading, Button } from 'native-base'
import { useCallback } from 'react'
import Tabs from '../../components/Tabs'
import WithNavigation from '../../components/WithNavigation'
import LearningPartner from '../../widgets/LearningPartner'

type Props = {}

const Matching: React.FC<Props> = () => {
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

  const onRequestMatch = useCallback(() => {}, [])

  return (
    <WithNavigation>
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

        <Button onPress={onRequestMatch}>Match anfordern</Button>

        <Tabs
          tabs={[
            {
              title: 'Matches',
              content: (
                <VStack>
                  {data?.me?.student?.matches?.map((pupil: any) => (
                    <LearningPartner
                      subjects={pupil.subjects}
                      name={pupil.firstname}
                      schoolclass={pupil.gradeAsInt}
                      schooltype={pupil.schooltype}
                    />
                  ))}
                </VStack>
              )
            }
          ]}
        />
      </VStack>
    </WithNavigation>
  )
}
export default Matching
