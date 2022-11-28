import { gql, useMutation, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Text,
  VStack,
  Heading,
  Button,
  useTheme,
  useBreakpointValue,
  Flex,
  Column,
  Modal,
  useToast,
  Box,
  Row
} from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import AsNavigationItem from '../../components/AsNavigationItem'
import Tabs from '../../components/Tabs'
import WithNavigation from '../../components/WithNavigation'
import DissolveMatchModal from '../../modals/DissolveMatchModal'
import { LFMatch } from '../../types/lernfair/Match'
import Hello from '../../widgets/Hello'
import AlertMessage from '../../widgets/AlertMessage'
import LearningPartner from '../../widgets/LearningPartner'
import { LFSubject } from '../../types/lernfair/Subject'
import Tag from '../../components/Tag'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'

type Props = {}
const query = gql`
  query {
    me {
      student {
        id
        subjectsFormatted {
          name
        }
        matches {
          id
          dissolved
          pupil {
            firstname

            grade
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
`

const MatchingStudent: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const toast = useToast()

  const [showDissolveModal, setShowDissolveModal] = useState<boolean>()
  const [focusedMatch, setFocusedMatch] = useState<LFMatch>()
  const [showCancelModal, setShowCancelModal] = useState<boolean>()
  const [toastShown, setToastShown] = useState<boolean>()

  const { data, loading } = useQuery(query)

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '48%'
  })

  const [dissolveMatch, { data: dissolveData }] = useMutation(
    gql`
      mutation ($matchId: Float!, $dissolveReason: Float!) {
        matchDissolve(matchId: $matchId, dissolveReason: $dissolveReason)
      }
    `,
    { refetchQueries: [{ query }] }
  )

  const [cancelMatchRequest, { loading: cancelLoading }] = useMutation(
    gql`
      mutation {
        studentDeleteMatchRequest
      }
    `,
    { refetchQueries: [{ query }] }
  )

  const showDissolveMatchModal = useCallback((match: LFMatch) => {
    setFocusedMatch(match)
    setShowDissolveModal(true)
  }, [])

  const dissolve = useCallback(
    (reason: string) => {
      trackEvent({
        category: 'matching',
        action: 'click-event',
        name: 'Helfer Matching lösen',
        documentTitle: 'Helfer Matching'
      })
      dissolveMatch({
        variables: {
          matchId: focusedMatch?.id,
          dissolveReason: parseInt(reason)
        }
      })
      setShowDissolveModal(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dissolveMatch, focusedMatch?.id]
  )

  const showCancelMatchRequestModal = useCallback(() => {
    setShowCancelModal(true)
  }, [])

  const cancelRequest = useCallback(async () => {
    setShowCancelModal(false)
    trackEvent({
      category: 'matching',
      action: 'click-event',
      name: 'Helfer Matching Anfrage löschen',
      documentTitle: 'Helfer Matching'
    })
    const res = (await cancelMatchRequest()) as {
      studentDeleteMatchRequest: boolean
    }

    if (res.studentDeleteMatchRequest) {
      toast.show({ description: 'Die Anfrage wurde gelöscht' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.me?.student?.id])

  useEffect(() => {
    if (dissolveData?.matchDissolve && !toastShown) {
      setToastShown(true)
      toast.show({ description: 'Das Match wurde aufgelöst' })
    }
  }, [dissolveData?.matchDissolve, toast, toastShown])

  const activeMatches = useMemo(
    () =>
      data?.me?.student?.matches?.filter(
        (match: LFMatch) => !match.dissolved
      ) || [],
    [data?.me?.student?.matches]
  )

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Helfer Matching'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mandatorySubjects = useMemo(
    () =>
      data?.me?.student?.subjectsFormatted?.filter(
        (sub: LFSubject) => sub.mandatory
      ),
    [data?.me?.student?.subjectsFormatted]
  )

  return (
    <AsNavigationItem path="matching">
      <WithNavigation
        headerTitle={t('matching.request.check.header')}
        headerContent={<Hello />}>
        {loading && <CenterLoadingSpinner />}
        {!loading && (
          <VStack
            paddingX={space['1']}
            maxWidth={ContainerWidth}
            width="100%"
            marginX="auto">
            <Heading paddingBottom={space['0.5']}>
              {t('matching.request.check.title')}
            </Heading>
            <VStack space={space['0.5']}>
              <Text paddingBottom={space['0.5']}>
                {t('matching.request.check.content')}
              </Text>

              <Text mt="1" bold>
                {t('matching.request.check.contentHeadline')}
              </Text>
              <Text paddingBottom={space['1.5']}>
                {t('matching.request.check.contenHeadlineContent')}
              </Text>

              {(data?.me?.student?.canRequestMatch.allowed && (
                <Button
                  width={ButtonContainer}
                  marginBottom={space['1.5']}
                  onPress={() => navigate('/request-match')}>
                  {t('matching.request.check.requestmatchButton')}
                </Button>
              )) || (
                <AlertMessage
                  content={t(
                    `lernfair.reason.${data?.me?.student?.canRequestMatch?.reason}.matching`
                  )}
                />
              )}
            </VStack>

            <Tabs
              tabs={[
                {
                  title: t('matching.request.check.tabs.tab1'),
                  content: (
                    <VStack>
                      <Flex direction="row" flexWrap="wrap">
                        {(activeMatches.length &&
                          activeMatches?.map(
                            (match: LFMatch, index: number) => (
                              <Column width={CardGrid} marginRight="15px">
                                <LearningPartner
                                  key={index}
                                  isDark={true}
                                  name={match?.pupil?.firstname}
                                  subjects={match?.pupil?.subjectsFormatted}
                                  schooltype={
                                    match?.pupil?.schooltype || 'Backend Error'
                                  }
                                  schoolclass={match?.pupil?.grade}
                                  avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                  button={
                                    (!match.dissolved && (
                                      <Button
                                        variant="outlinelight"
                                        onPress={() =>
                                          showDissolveMatchModal(match)
                                        }>
                                        {t(
                                          'dashboard.helpers.buttons.solveMatch'
                                        )}
                                      </Button>
                                    )) || (
                                      <AlertMessage
                                        content={t(
                                          'matching.request.check.resoloveMatch'
                                        )}
                                      />
                                    )
                                  }
                                />
                              </Column>
                            )
                          )) || (
                          <AlertMessage
                            content={t('matching.request.check.noMatches')}
                          />
                        )}
                      </Flex>
                    </VStack>
                  )
                },
                {
                  title: 'Anfragen',
                  content: (
                    <VStack space={space['1']}>
                      <Text marginBottom={space['1']}>
                        Offene Anfragen:{'  '}
                        {data?.me?.student?.openMatchRequestCount}
                      </Text>
                      <VStack space={space['0.5']}>
                        <Flex direction="row" flexWrap="wrap">
                          {(data?.me?.student?.openMatchRequestCount &&
                            new Array(data?.me?.student?.openMatchRequestCount)
                              .fill('')
                              .map((_, i) => (
                                <Column
                                  width={CardGrid}
                                  marginRight="15px"
                                  marginBottom="15px">
                                  <Box
                                    bgColor="primary.900"
                                    padding={space['1.5']}
                                    borderRadius={8}>
                                    <Heading
                                      color="lightText"
                                      paddingLeft={space['1']}>
                                      Anfrage {`${i + 1}`.padStart(2, '0')}
                                    </Heading>

                                    <Row
                                      mt="3"
                                      paddingLeft={space['1']}
                                      space={space['0.5']}
                                      alignItems="center">
                                      <Text color="lightText" mb={space['0.5']}>
                                        Fächer:
                                      </Text>
                                      <Row space={space['0.5']}>
                                        {data?.me?.student?.subjectsFormatted.map(
                                          (sub: LFSubject) => (
                                            <Tag
                                              variant="secondary"
                                              text={sub.name}
                                            />
                                          )
                                        )}
                                      </Row>
                                    </Row>
                                    <Button
                                      isDisabled={cancelLoading}
                                      variant="outlinelight"
                                      mt="3"
                                      onPress={showCancelMatchRequestModal}>
                                      Anfrage zurücknehmen
                                    </Button>
                                  </Box>
                                </Column>
                              ))) || (
                            <AlertMessage
                              content={t('matching.request.check.noMatches')}
                            />
                          )}
                        </Flex>
                      </VStack>
                    </VStack>
                  )
                }
              ]}
            />
          </VStack>
        )}
      </WithNavigation>

      <DissolveMatchModal
        showDissolveModal={showDissolveModal}
        onPressDissolve={(reason: string) => {
          dissolve(reason)
        }}
        onPressBack={() => setShowDissolveModal(false)}
      />
      <Modal isOpen={showCancelModal}>
        <Modal.Content>
          <Modal.Header>Anfrage löschen</Modal.Header>
          <Modal.CloseButton onPress={() => setShowCancelModal(false)} />
          <Modal.Body>Möchtest du die Anfrage wirklich löschen?</Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onPress={() => setShowCancelModal(false)}>
              Abbrechen
            </Button>
            <Button onPress={cancelRequest}>Anfrage löschen</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </AsNavigationItem>
  )
}
export default MatchingStudent
