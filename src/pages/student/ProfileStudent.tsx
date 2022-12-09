import {
  Heading,
  useTheme,
  VStack,
  Row,
  Column,
  Text,
  Modal,
  FormControl,
  Input,
  Button,
  TextArea,
  Container,
  useBreakpointValue,
  Flex
} from 'native-base'
import NotificationAlert from '../../components/notifications/NotificationAlert'
import WithNavigation from '../../components/WithNavigation'
import IconTagList from '../../widgets/IconTagList'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

import UserProgress from '../../widgets/UserProgress'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { getSubjectKey } from '../../types/lernfair/Subject'
import AlertMessage from '../../widgets/AlertMessage'
import { useLocation, useNavigate } from 'react-router-dom'
import CSSWrapper from '../../components/CSSWrapper'
import useLernfair from '../../hooks/useLernfair'

type Props = {}

const query = gql`
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
`

const ProfileStudent: React.FC<Props> = () => {
  const { colors, space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { rootPath } = useLernfair()
  const [firstName, setFirstName] = useState<string>()
  const [lastName, setLastName] = useState<string>()

  const [nameModalVisible, setNameModalVisible] = useState<boolean>(false)
  const [aboutMeModalVisible, setAboutMeModalVisible] = useState<boolean>(false)

  const [aboutMe, setAboutMe] = useState<string>('')
  const [userSettingChanged, setUserSettings] = useState<boolean>(false)

  const location = useLocation()
  const { showSuccessfulChangeAlert = false } = (location.state || {}) as {
    showSuccessfulChangeAlert: boolean
  }

  const { data, loading } = useQuery(query, {
    fetchPolicy: 'no-cache'
  })

  const [changeName, _changeName] = useMutation(
    gql`
      mutation changeName($firstname: String!, $lastname: String!) {
        meUpdate(update: { firstname: $firstname, lastname: $lastname })
      }
    `,
    { refetchQueries: [query] }
  )
  const [changeAboutMe, _changeAboutMe] = useMutation(
    gql`
      mutation changeAboutMeStudent($aboutMe: String!) {
        meUpdate(update: { student: { aboutMe: $aboutMe } })
      }
    `,
    { refetchQueries: [query] }
  )

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
    data?.me?.student?.aboutMe?.length > 0 && (complete += 1)
    // data?.me?.student?.languages?.length && (complete += 1)
    data?.me?.student?.state && (complete += 1)
    // data?.me?.student?.schooltype && (complete += 1)
    // data?.me?.student?.gradeAsInt && (complete += 1)
    data?.me?.student?.subjectsFormatted?.length > 0 && (complete += 1)
    return Math.floor((complete / max) * 100)
  }, [
    data?.me?.firstname,
    data?.me?.lastname,
    data?.me?.student?.aboutMe?.length,
    data?.me?.student?.state,
    data?.me?.student?.subjectsFormatted?.length
  ])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const HeaderStyle = useBreakpointValue({
    base: {
      isMobile: true,
      bgColor: 'primary.700',
      paddingY: space['2']
    },
    lg: {
      isMobile: false,
      bgColor: 'transparent',
      paddingY: 0
    }
  })

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Helfer Matching'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (showSuccessfulChangeAlert || userSettingChanged) {
      window.scrollTo({ top: 0 })
    }
  }, [showSuccessfulChangeAlert, userSettingChanged])
  return (
    <>
      <WithNavigation
        showBack
        isLoading={loading}
        onBack={() => (!!rootPath && navigate(`/${rootPath}`)) || navigate(-1)}
        headerTitle={t('profile.title')}
        headerContent={
          <Flex
            maxWidth={ContainerWidth}
            marginX="auto"
            width="100%"
            bg={HeaderStyle.bgColor}
            alignItems={HeaderStyle.isMobile ? 'center' : 'flex-start'}
            justifyContent="center"
            paddingY={HeaderStyle.paddingY}
            borderBottomRadius={16}>
            <Heading color={colors.white} bold fontSize="xl">
              {data?.me?.firstname}
            </Heading>
          </Flex>
        }
        headerLeft={<NotificationAlert />}>
        {(showSuccessfulChangeAlert || userSettingChanged) && (
          <Container maxWidth={ContainerWidth} paddingX={space['1']}>
            <AlertMessage content={t('profile.successmessage')} />
          </Container>
        )}

        <VStack
          space={space['1']}
          maxWidth={ContainerWidth}
          marginX="auto"
          width="100%">
          {profileCompleteness !== 100 && (
            <VStack paddingX={space['1.5']} space={space['1']}>
              <ProfileSettingRow title={t('profile.ProfileCompletion.name')}>
                <UserProgress percent={profileCompleteness} />
              </ProfileSettingRow>
            </VStack>
          )}
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
                {(data?.me?.student?.aboutMe && (
                  <Text>{data?.me?.student?.aboutMe}</Text>
                )) || <Text>{t('profile.AboutMe.empty')}</Text>}
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.State.label')}
                href={() =>
                  navigate('/change-setting/state', {
                    state: { userType: 'student' }
                  })
                }>
                <Row>
                  {(data?.me?.student.state && (
                    <Column marginRight={3}>
                      {(data?.me?.student?.state && (
                        <CSSWrapper className="profil-tab-link">
                          <IconTagList
                            isDisabled
                            iconPath={`states/icon_${data?.me?.student.state}.svg`}
                            text={t(
                              `lernfair.states.${data?.me?.student.state}`
                            )}
                          />
                        </CSSWrapper>
                      )) || <Text>Keine Angabe</Text>}
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
                        <CSSWrapper className="profil-tab-link">
                          <IconTagList
                            isDisabled
                            iconPath={`subjects/icon_${getSubjectKey(
                              sub.name
                            )}.svg`}
                            text={sub.name}
                          />
                        </CSSWrapper>
                      </Column>
                    )
                  ) || <Text>{t('profile.subjects.empty')}</Text>}
                </Row>
              </ProfileSettingItem>
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
