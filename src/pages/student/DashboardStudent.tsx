import {
  Text,
  Button,
  Heading,
  HStack,
  useTheme,
  VStack,
  Modal,
  Row,
  useToast,
  useBreakpointValue
} from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AppointmentCard from '../../widgets/AppointmentCard'
import HSection from '../../widgets/HSection'
import CTACard from '../../widgets/CTACard'
import ProfilAvatar from '../../widgets/ProfilAvatar'
import WithNavigation from '../../components/WithNavigation'
import { useNavigate } from 'react-router-dom'
import NotificationAlert from '../../components/NotificationAlert'
import { useTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'
import BooksIcon from '../../assets/icons/lernfair/lf-books.svg'
import PartyIcon from '../../assets/icons/lernfair/lf-pary-small.svg'
import HelperWizard from '../../widgets/HelperWizard'
import LearningPartner from '../../widgets/LearningPartner'
import { LFMatch } from '../../types/lernfair/Match'
import { LFSubCourse } from '../../types/lernfair/Course'
import { DateTime } from 'luxon'
import { TIME_THRESHOLD } from '../../Utility'

type Props = {}

const DashboardStudent: React.FC<Props> = () => {
  const toast = useToast()
  const { data, error, loading } = useQuery(gql`
    query {
      me {
        firstname
        student {
          openMatchRequestCount
          canRequestMatch {
            allowed
            reason
          }
          canCreateCourse {
            allowed
            reason
          }
          matches {
            id
            dissolved
            pupil {
              firstname
            }
          }
          subcoursesInstructing {
            lectures {
              start
              duration
            }
            course {
              name
              description
              outline
              tags {
                name
              }
            }
          }
        }
      }

      subcoursesPublic(take: 10, skip: 2) {
        course {
          name
          description
          outline
          tags {
            name
          }
        }
      }
    }
  `)

  const { space, sizes } = useTheme()
  const futureDate = useMemo(() => new Date(Date.now() + 360000 * 24 * 7), [])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isMatchRequested, setIsMatchRequested] = useState<boolean>()
  const [showDissolveModal, setShowDissolveModal] = useState<boolean>()
  const [dissolveData, setDissolveData] = useState<LFMatch>()

  const [createMatchRequest, matchRequest] = useMutation(gql`
    mutation {
      studentCreateMatchRequest
    }
  `)

  const [dissolve, _dissolve] = useMutation(gql`
    mutation dissolve($matchId: Float!) {
      matchDissolve(dissolveReason: 1.0, matchId: $matchId)
    }
  `)

  const requestMatch = useCallback(async () => {
    setIsMatchRequested(true)
    const res = (await createMatchRequest()) as {
      studentCreateMatchRequest: boolean
    }
    if (!res.studentCreateMatchRequest) {
      setIsMatchRequested(false)
    }
  }, [createMatchRequest])

  const dissolveMatch = useCallback((match: LFMatch) => {
    setDissolveData(match)
    setShowDissolveModal(true)
  }, [])

  useEffect(() => {
    if (_dissolve?.data?.matchDissolve) {
      // TODO fix this being called like 20 times a second
      // toast.show({
      //   description: 'Das Match wurde aufgelöst'
      // })
    }
  }, [_dissolve?.data?.matchDissolve, toast])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  if (loading) return <></>

  return (
    <>
      <WithNavigation
        headerContent={
          <HStack
            space={space['1']}
            alignItems="center"
            bgColor={'primary.900'}
            padding={space['0.5']}>
            <ProfilAvatar
              size="md"
              image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            />
            <Heading color={'#fff'}>
              {t('hallo')} {data?.me?.firstname}!
            </Heading>
          </HStack>
        }
        headerLeft={<NotificationAlert />}>
        <VStack paddingX={space['1']} width={ContainerWidth}>
          <VStack space={space['1']} marginTop={space['1']}>
            <VStack paddingY={space['1']}>
              <HelperWizard index={0} />
            </VStack>
            <VStack space={space['0.5']}>
              <Heading marginY={space['1']}>
                {t('dashboard.appointmentcard.header')}
              </Heading>
              <AppointmentCard
                href={'/single-course'}
                tags={[]}
                date={futureDate.toLocaleDateString()}
                isTeaser={true}
                image="https://images.unsplash.com/photo-1632571401005-458e9d244591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
                title="Mathe Grundlagen Klasse 6"
                description="In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch."
              />
            </VStack>
            <HSection
              title={t('dashboard.myappointments.header')}
              showAll={true}>
              {data?.me?.student?.subcoursesInstructing?.map(
                (el: LFSubCourse, i: number) => {
                  const course = el.course
                  if (!course) return <></>

                  const lectures = el.lectures
                  if (!lectures) return <></>

                  // // TODO sort lectures
                  // lectures.sort((a, b) => 1)

                  return lectures.map(lec => {
                    if (
                      DateTime.fromISO(lec.start).toMillis() - Date.now() >=
                      TIME_THRESHOLD
                    )
                      return (
                        <AppointmentCard
                          onPressToCourse={() =>
                            navigate('/single-course', {
                              state: { course: el.id }
                            })
                          }
                          key={`appointment-${el.id}`}
                          description={course.outline}
                          tags={course.tags}
                          date={lec.start}
                          image={course.image}
                          title={course.name}
                        />
                      )
                    else return <></>
                  })
                }
              ) || <Text>{t('empty.appointments')}</Text>}
            </HSection>
            <HSection
              title={t('dashboard.helpers.headlines.course')}
              showAll={true}
              scrollable={false}
              wrap={true}>
              {(new Array(0).length &&
                new Array(0)
                  .fill(0)
                  .map(({}, index) => (
                    <AppointmentCard
                      key={index}
                      variant="horizontal"
                      description="Lorem Ipsum"
                      tags={[{ name: 'Mathematik' }, { name: 'Gruppenkurs' }]}
                      date={new Date().toLocaleDateString()}
                      countCourse={4}
                      onPressToCourse={() => alert('YES')}
                      image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                      title="Diskussionen in Mathe!? – Die Kurvendiskussion"
                    />
                  ))) || (
                <VStack space={space['0.5']}>
                  <Text>{t('empty.courses')}</Text>
                </VStack>
              )}
              {(data?.me?.student?.canCreateCourse?.allowed && (
                <Button
                  marginY={space['1']}
                  onPress={() => navigate('/create-course')}>
                  {t('dashboard.helpers.buttons.course')}
                </Button>
              )) || (
                <Text mt={space['0.5']} fontSize="xs" opacity=".8">
                  {t(
                    `lernfair.reason.${data?.me?.student?.canCreateCourse?.reason}.course`
                  )}
                </Text>
              )}
            </HSection>
            {/* <VStack space={space['0.5']}>
            <Heading marginY={space['1']}>
              {t('dashboard.helpers.headlines.importantNews')}
            </Heading>
            <CTACard
              title={t('dashboard.helpers.headlines.newOffer')}
              closeable={false}
              content={<Text>{t('dashboard.helpers.contents.newOffer')}</Text>}
              button={
                <Button variant="outline">
                  {t('dashboard.helpers.buttons.offer')}
                </Button>
              }
              icon={<PartyIcon />}
            />
          </VStack> */}
            <VStack space={space['0.5']}>
              <Heading marginY={space['1']}>
                {t('dashboard.helpers.headlines.myLearningPartner')}
              </Heading>

              {data?.me?.student?.matches.map(
                (match: LFMatch, index: number) => (
                  <LearningPartner
                    key={index}
                    isDark={true}
                    name={match?.pupil?.firstname}
                    subjects={['Englisch']}
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
                        <Text color="lightText">Das Match wurde aufgelöst</Text>
                      )
                    }
                  />
                )
              ) || <Text>{t('empty.matchings')}</Text>}
              {(data?.me?.student?.canRequestMatch?.allowed && (
                <>
                  <Button
                    isDisabled={isMatchRequested}
                    marginY={space['1']}
                    onPress={requestMatch}>
                    {t('dashboard.helpers.buttons.requestMatch')}
                  </Button>
                  {data?.me?.pupil?.openMatchRequestCount ||
                    (isMatchRequested && (
                      <Text fontSize="xs">
                        Offene Anfragen:{' '}
                        {`${
                          data?.me?.pupil?.openMatchRequestCount ||
                          (isMatchRequested ? 1 : 0)
                        }`}
                      </Text>
                    ))}
                </>
              )) || (
                <Text mt={space['0.5']} fontSize="xs" opacity=".8">
                  {t(
                    `lernfair.reason.${data?.me?.student?.canRequestMatch?.reason}.matching`
                  )}
                </Text>
              )}
            </VStack>
            <VStack space={space['0.5']} marginBottom={space['1.5']}>
              <Heading marginY={space['1']}>
                {t('dashboard.helpers.headlines.recommend')}
              </Heading>
              <CTACard
                title={t('dashboard.helpers.headlines.recommendFriends')}
                closeable={false}
                content={
                  <Text>
                    {t('dashboard.helpers.contents.recommendFriends')}
                  </Text>
                }
                button={
                  <Button variant="outline">
                    {t('dashboard.helpers.buttons.recommend')}
                  </Button>
                }
                icon={<BooksIcon />}
              />
            </VStack>
          </VStack>
        </VStack>
      </WithNavigation>
      <Modal isOpen={showDissolveModal}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Match auflösen</Modal.Header>
          <Modal.Body>
            <VStack>
              <Text>
                Möchtest du das Match mit{' '}
                <Text bold>{dissolveData?.pupil.firstname}</Text> wirklich
                auflösen?
              </Text>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Row space={space['1']}>
              <Button
                onPress={() => {
                  dissolve({ variables: { matchId: dissolveData?.id } })
                  setShowDissolveModal(false)
                }}>
                Match auflösen
              </Button>
              <Button onPress={() => setShowDissolveModal(false)}>
                Zurück
              </Button>
            </Row>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default DashboardStudent
