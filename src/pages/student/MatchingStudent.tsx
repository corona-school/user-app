import { gql, useQuery } from '@apollo/client'
import { View, Text, VStack, Heading, Button, useTheme } from 'native-base'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Tabs from '../../components/Tabs'
import WithNavigation from '../../components/WithNavigation'
import { LFMatch } from '../../types/lernfair/Match'
import { LFSubject } from '../../types/lernfair/Subject'
import LearningPartner from '../../widgets/LearningPartner'

type Props = {}

const MatchingStudent: React.FC<Props> = () => {
  const { space } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showDissolveModal, setShowDissolveModal] = useState<boolean>()

  const { data, loading, error } = useQuery(gql`
    query {
      me {
        student {
          matches {
            id
            dissolved
            pupil {
              firstname

              subjectsFormatted {
                name
              }
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

  const dissolveMatch = useCallback((match: LFMatch) => {
    console.log('dissolve match', match)
    setShowDissolveModal(true)
  }, [])

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
                    data?.me?.student?.matches?.map(
                      (match: LFMatch, index: number) => (
                        <LearningPartner
                          key={index}
                          isDark={true}
                          name={match?.pupil?.firstname}
                          subjects={match?.pupil?.subjectsFormatted.map(
                            (sub: LFSubject) => sub.name
                          )}
                          schooltype="Grundschule"
                          schoolclass={4}
                          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                          button={
                            (!match.dissolved && (
                              <Button
                                variant="outlinelight"
                                onPress={() => dissolveMatch(match)}>
                                {t('dashboard.helpers.buttons.solveMatch')}
                              </Button>
                            )) || (
                              <Text color="lightText">
                                Das Match wurde aufgelöst
                              </Text>
                            )
                          }
                        />
                      )
                    )) || <Text>Du hast keine Matches</Text>}
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
