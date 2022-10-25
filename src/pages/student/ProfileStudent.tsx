import {
  Box,
  Heading,
  useTheme,
  VStack,
  Row,
  Link,
  Column,
  Text,
  Modal,
  FormControl,
  Input,
  Button,
  Alert,
  HStack,
  TextArea,
  Container,
  useBreakpointValue
} from 'native-base'
import NotificationAlert from '../../components/NotificationAlert'
import WithNavigation from '../../components/WithNavigation'
import IconTagList from '../../widgets/IconTagList'
import ProfilAvatar from '../../widgets/ProfilAvatar'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

import UserProgress from '../../widgets/UserProgress'
import EditIcon from '../../assets/icons/lernfair/lf-edit.svg'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'
import Tabs from '../../components/Tabs'
import HSection from '../../widgets/HSection'
import HelperCardCertificates from '../../widgets/HelperCardCertificates'
import HelperWizard from '../../widgets/HelperWizard'
import { DateTime } from 'luxon'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {}

const ProfileStudent: React.FC<Props> = () => {
  const { colors, space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [firstName, setFirstName] = useState<string>()
  const [lastName, setLastName] = useState<string>()

  const [nameModalVisible, setNameModalVisible] = useState<boolean>(false)
  const [aboutMeModalVisible, setAboutMeModalVisible] = useState<boolean>(false)

  const [aboutMe, setAboutMe] = useState<string>('')
  const [userSettingChanged, setUserSettings] = useState<boolean>(false)

  const { data, error, loading } = useQuery(gql`
    query {
      me {
        firstname
        lastname
        student {
          state
          aboutMe
          subjectsFormatted {
            name
          }
          participationCertificates {
            subjectsFormatted
            state
            startDate
            pupilId
          }
        }
      }
    }
  `)

  const [changeName, _changeName] = useMutation(gql`
    mutation changeName($firstname: String!, $lastname: String!) {
      meUpdate(update: { firstname: $firstname, lastname: $lastname })
    }
  `)
  const [changeAboutMe, _changeAboutMe] = useMutation(gql`
    mutation changeAboutMe($aboutMe: String!) {
      meUpdate(update: { student: { aboutMe: $aboutMe } })
    }
  `)

  useEffect(() => {
    if (_changeName.data || _changeAboutMe.data) {
      setUserSettings(true)
    }
  }, [_changeAboutMe.data, _changeName.data])

  useEffect(() => {
    if (data?.me) {
      setFirstName(data?.me?.firstname)
      setLastName(data?.me?.lastname)
      setAboutMe(data?.me?.student?.aboutMe)
    }
  }, [data?.me])

  const profileCompleteness = useMemo(() => {
    const max = 4.0
    let complete = 0.0

    data?.me?.firstname && data?.me?.lastname && (complete += 1)
    data?.me?.aboutMe && (complete += 1)
    // data?.me?.student?.languages?.length && (complete += 1)
    data?.me?.student?.state && (complete += 1)
    // data?.me?.student?.schooltype && (complete += 1)
    // data?.me?.student?.gradeAsInt && (complete += 1)
    data?.me?.student?.subjectsFormatted?.length && (complete += 1)

    return Math.floor((complete / max) * 100)
  }, [
    data?.me?.aboutMe,
    data?.me?.firstname,
    data?.me?.lastname,
    data?.me?.student?.state,
    data?.me?.student?.subjectsFormatted?.length
  ])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ButtonWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Helfer Matching'
    })
  }, [])

  if (loading) return <></>

  return (
    <>
      <WithNavigation
        headerTitle={t('profile.title')}
        headerContent={
          <Box
            width={ContainerWidth}
            bg={'primary.700'}
            alignItems="center"
            paddingY={space['2']}
            borderBottomRadius={16}>
            <Box position="relative">
              <ProfilAvatar
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                size="xl"
              />
              <Box position="absolute" right="-10px" bottom="5px">
                <Link href="#">
                  <EditIcon
                    fill={colors['lightText']}
                    stroke={colors['lightText']}
                  />
                </Link>
              </Box>
            </Box>
            <Heading
              paddingTop={3}
              paddingBottom={9}
              color={colors.white}
              bold
              fontSize="xl">
              {data?.me?.firstname}
            </Heading>

            {/* <Row width="80%" justifyContent="space-between">
              <Column
                width="33%"
                textAlign="center"
                justifyContent="center"
                alignItems="center">
                <Circle
                  width="45px"
                  height="45px"
                  backgroundColor="primary.400">
                  <Text color="lightText" fontSize="17px" bold>
                    3
                  </Text>
                </Circle>
                <Text marginY={space['0.5']} fontWeight="600" color="lightText">
                  Kurse
                </Text>
              </Column>
              <Column
                width="33%"
                textAlign="center"
                justifyContent="center"
                alignItems="center">
                <Circle
                  width="45px"
                  height="45px"
                  backgroundColor="primary.400">
                  <Text color="lightText" fontSize="17px" bold>
                    5
                  </Text>
                </Circle>
                <Text marginY={space['0.5']} fontWeight="600" color="lightText">
                  Schüler:innen
                </Text>
              </Column>
              <Column
                width="33%"
                textAlign="center"
                justifyContent="center"
                alignItems="center">
                <Circle
                  width="45px"
                  height="45px"
                  backgroundColor="primary.400">
                  <Text color="lightText" fontSize="17px" bold>
                    12
                  </Text>
                </Circle>
                <Text marginY={space['0.5']} fontWeight="600" color="lightText">
                  Bewertungen
                </Text>
              </Column>
            </Row> */}
          </Box>
        }
        headerLeft={<NotificationAlert />}>
        {userSettingChanged && (
          <Alert
            width={ContainerWidth}
            marginY={10}
            marginX={space['1.5']}
            colorScheme="success"
            status="success">
            <VStack space={2} flexShrink={1} w="100%">
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between">
                <HStack space={2} flexShrink={1} alignItems="center">
                  <Alert.Icon />
                  <Text>{t('profile.successmessage')}</Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        )}

        <VStack
          width={ContainerWidth}
          paddingX={space['1']}
          paddingY={space['1']}>
          <HelperWizard index={0} />
        </VStack>

        <VStack space={space['1']} width={ContainerWidth}>
          <VStack paddingX={space['1.5']} space={space['1']}>
            <ProfileSettingRow title={t('profile.ProfileCompletion.name')}>
              <UserProgress percent={profileCompleteness} />
            </ProfileSettingRow>
          </VStack>
          <VStack paddingX={space['1.5']} space={space['1']}>
            <ProfileSettingRow title={t('profile.PersonalData')}>
              <ProfileSettingItem
                title={t('profile.UserName.label.title')}
                href={() => {
                  setNameModalVisible(!nameModalVisible)
                }}>
                <Text>
                  {data?.me?.firstname} {data?.me?.lastname}
                </Text>
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.AboutMe.label')}
                href={() => {
                  setAboutMeModalVisible(!aboutMeModalVisible)
                }}>
                {(data?.me?.student?.aboutMe && <Text>{aboutMe}</Text>) || (
                  <Text>{t('profile.AboutMe.empty')}</Text>
                )}
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.State.label')}
                href={() =>
                  navigate('/change-setting/state', {
                    state: { userType: 'student' }
                  })
                }>
                <Row>
                  {(data?.me?.student.state &&
                    data?.me?.student.state !== 'other' && (
                      <Column marginRight={3}>
                        <IconTagList
                          isDisabled
                          iconPath={`states/icon_${data?.me?.student.state}.svg`}
                          text={t(`lernfair.states.${data?.me?.student.state}`)}
                        />
                      </Column>
                    )) || <Text>{t('profile.State.empty')}</Text>}
                </Row>
              </ProfileSettingItem>

              <ProfileSettingItem
                border={false}
                title={t('profile.subjects.label')}
                href={() =>
                  navigate('/change-setting/subjects', {
                    state: { userType: 'student' }
                  })
                }>
                <Row>
                  {data?.me?.student?.subjectsFormatted?.map(
                    (sub: { name: string }) => (
                      <Column marginRight={3}>
                        <IconTagList
                          isDisabled
                          iconPath={'subjects/icon_mathe.svg'}
                          text={sub.name}
                        />
                      </Column>
                    )
                  ) || <Text>{t('profile.subjects.empty')}</Text>}
                </Row>
              </ProfileSettingItem>
            </ProfileSettingRow>
            <ProfileSettingRow title={t('profile.Helper.certificate.title')}>
              <Container
                maxWidth="100%"
                width="100%"
                marginBottom={space['1']}
                alignItems="stretch">
                <Tabs
                  removeSpace={true}
                  tabs={[
                    {
                      title: t('profile.Helper.certificate.tabbestaetigt'),
                      content: (
                        <>
                          <HSection isNoSpace={true}>
                            {data?.me?.student?.participationCertificates
                              ?.filter(
                                (el: any) =>
                                  el.state === 'manual' ||
                                  el.state === 'automatic'
                              )
                              .map((el: any) => (
                                <Column>
                                  <HelperCardCertificates
                                    name={el.pupilId}
                                    subject={el.subjectsFormatted}
                                    status={el.state}
                                    createDate={DateTime.fromISO(
                                      el.startDate
                                    ).toFormat('dd.MM.yyyy')}
                                    avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                    download={() => alert('Hallo')}
                                  />
                                </Column>
                              ))}
                          </HSection>
                        </>
                      )
                    },
                    {
                      title: t('profile.Helper.certificate.tabausstehend'),
                      content: (
                        <>
                          <HSection>
                            {data?.me?.student?.participationCertificates
                              ?.filter(
                                (el: any) => el.state === 'awaiting-approval'
                              )
                              .map((el: any) => (
                                <Column>
                                  <HelperCardCertificates
                                    name={el.pupilId}
                                    subject={el.subjectsFormatted}
                                    status={el.state}
                                    createDate={DateTime.fromISO(
                                      el.startDate
                                    ).toFormat('dd.MM.yyyy')}
                                    avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                    download={() => alert('Hallo')}
                                  />
                                </Column>
                              ))}
                          </HSection>
                        </>
                      )
                    }
                  ]}
                />
              </Container>
              <Container maxWidth="100%" width="100%" alignItems="stretch">
                <Button
                  width={ButtonWidth}
                  onPress={() => {
                    trackEvent({
                      category: 'profil',
                      action: 'click-event',
                      name: 'Helfer Profil – Bescheinigung anfordern Button Klick',
                      documentTitle: 'Helfer Profil – Bescheinigung anfordern'
                    })
                  }}>
                  {t('profile.Helper.certificate.button')}
                </Button>
              </Container>
            </ProfileSettingRow>
          </VStack>
        </VStack>
      </WithNavigation>
      <Modal
        isOpen={nameModalVisible}
        onClose={() => setNameModalVisible(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{t('profile.UserName.popup.header')}</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>
                {t('profile.UserName.label.firstname')}
              </FormControl.Label>
              <Input
                value={firstName}
                onChangeText={text => {
                  setFirstName(text)
                }}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>
                {t('profile.UserName.label.lastname')}
              </FormControl.Label>
              <Input
                value={lastName}
                onChangeText={text => {
                  setLastName(text)
                }}
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setNameModalVisible(false)
                }}>
                {t('profile.UserName.popup.exit')}
              </Button>
              <Button
                isDisabled={!firstName || !lastName}
                onPress={() => {
                  setNameModalVisible(false)
                  changeName({
                    variables: { firstname: firstName, lastname: lastName }
                  })
                }}>
                {t('profile.UserName.popup.save')}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={aboutMeModalVisible}
        onClose={() => setAboutMeModalVisible(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{t('profile.AboutMe.popup.header')}</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>
                {t('profile.AboutMe.popup.label')}
              </FormControl.Label>
              <TextArea
                autoCompleteType={{}}
                value={aboutMe}
                onChangeText={setAboutMe}
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setAboutMeModalVisible(false)
                }}>
                {t('profile.AboutMe.popup.exit')}
              </Button>
              <Button
                onPress={() => {
                  changeAboutMe({ variables: { aboutMe } })
                  setAboutMeModalVisible(false)
                }}>
                {t('profile.AboutMe.popup.save')}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default ProfileStudent
