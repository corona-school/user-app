import { DocumentNode, gql, useMutation, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Text,
  VStack,
  Button,
  useTheme,
  useBreakpointValue,
  Flex,
  Column,
  useToast,
  Box,
  Heading,
  Row
} from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import AsNavigationItem from '../../components/AsNavigationItem'
import Tabs from '../../components/Tabs'
import Tag from '../../components/Tag'
import WithNavigation from '../../components/WithNavigation'
import { LFMatch } from '../../types/lernfair/Match'
import { LFSubject } from '../../types/lernfair/Subject'
import AlertMessage from '../../widgets/AlertMessage'
import LearningPartner from '../../widgets/LearningPartner'
import MatchingOnboarding from './MatchingOnboarding'

type Props = {}

const query: DocumentNode = gql`
  query {
    me {
      pupil {
        openMatchRequestCount
        id
        subjectsFormatted {
          name
        }
        matches {
          id
          dissolved
          student {
            firstname
          }
        }
        canRequestMatch {
          allowed
          reason
          limit
        }
      }
    }
  }
`

const Matching: React.FC<Props> = () => {
  const { trackPageView, trackEvent } = useMatomo()
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const toast = useToast()
  const { data, loading } = useQuery(query)

  const [showDissolveModal, setShowDissolveModal] = useState<boolean>()
  const [focusedMatch, setFocusedMatch] = useState<LFMatch>()
  const [showCancelModal, setShowCancelModal] = useState<boolean>()
  const [toastShown, setToastShown] = useState<boolean>()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler Matching'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const backArrow = useBreakpointValue({
    base: true,
    lg: false
  })

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

  return (
    <>
      <AsNavigationItem path="matching">
        <WithNavigation showBack={backArrow}>
          <MatchingOnboarding
            onRequestMatch={() => navigate('/request-match')}
          />
          <Box paddingX={space['1']}>
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
                  title: t('matching.request.check.tabs.tab2'),
                  content: (
                    <VStack space={space['1']}>
                      <Text marginBottom={space['1']}>
                        {t('matching.request.check.openedRequests')}
                        {'  '}
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
                                      {t('matching.request.check.request')}{' '}
                                      {`${i + 1}`.padStart(2, '0')}
                                    </Heading>

                                    <Row
                                      mt="3"
                                      paddingLeft={space['1']}
                                      space={space['0.5']}
                                      alignItems="center">
                                      <Text color="lightText" mb={space['0.5']}>
                                        {t('matching.request.check.subjects')}
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
                                      {t(
                                        'matching.request.check.removeRequest'
                                      )}
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
          </Box>
        </WithNavigation>
      </AsNavigationItem>
    </>
  )
}
export default Matching
