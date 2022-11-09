import {
  Box,
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
  Alert,
  HStack,
  TextArea,
  useBreakpointValue,
  Flex
} from 'native-base'
import NotificationAlert from '../../components/NotificationAlert'
import WithNavigation from '../../components/WithNavigation'
import IconTagList from '../../widgets/IconTagList'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

import UserProgress from '../../widgets/UserProgress'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import BackButton from '../../components/BackButton'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import { getSubjectKey } from '../../types/lernfair/Subject'
import AlertMessage from '../../widgets/AlertMessage'

type Props = {}

const Profile: React.FC<Props> = () => {
  const { colors, space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

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

  const { data, loading } = useQuery(
    gql`
      query {
        me {
          firstname
          lastname
          pupil {
            aboutMe
            state
            schooltype
            languages
            subjectsFormatted {
              name
            }
            gradeAsInt
          }
        }
      }
    `,
    {
      fetchPolicy: 'no-cache'
    }
  )

  const [changeName, _changeName] = useMutation(gql`
    mutation changeName($firstname: String!, $lastname: String!) {
      meUpdate(update: { firstname: $firstname, lastname: $lastname })
    }
  `)
  const [changeAboutMe, _changeAboutMe] = useMutation(gql`
    mutation changeAboutMe($aboutMe: String!) {
      meUpdate(update: { pupil: { aboutMe: $aboutMe } })
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
      setAboutMe(data?.me?.pupil?.aboutMe)
    }
  }, [data?.me])

  const profileCompleteness = useMemo(() => {
    const max = 7.0
    let complete = 0.0

    data?.me?.firstname && data?.me?.lastname && (complete += 1)
    data?.me?.pupil?.aboutMe && (complete += 1)
    data?.me?.pupil?.languages?.length && (complete += 1)
    data?.me?.pupil?.state && (complete += 1)
    data?.me?.pupil?.schooltype && (complete += 1)
    data?.me?.pupil?.gradeAsInt && (complete += 1)
    data?.me?.pupil?.subjectsFormatted?.length && (complete += 1)

    return Math.floor((complete / max) * 100)
  }, [
    data?.me?.firstname,
    data?.me?.lastname,
    data?.me?.pupil?.aboutMe,
    data?.me?.pupil?.gradeAsInt,
    data?.me?.pupil?.languages?.length,
    data?.me?.pupil?.schooltype,
    data?.me?.pupil?.state,
    data?.me?.pupil?.subjectsFormatted?.length
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
      documentTitle: 'Schüler Profil'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (showSuccessfulChangeAlert || userSettingChanged) {
      window.scrollTo({ top: 0 })
    }
  }, [showSuccessfulChangeAlert, userSettingChanged])

  if (loading) return <CenterLoadingSpinner />

  return (
    <>
      <WithNavigation
        showBack
        headerTitle={t('profile.title')}
        headerContent={
          <Flex
            marginX="auto"
            width="100%"
            maxWidth={ContainerWidth}
            bg={HeaderStyle.bgColor}
            alignItems={HeaderStyle.isMobile ? 'center' : 'flex-start'}
            justifyContent="center"
            paddingY={HeaderStyle.paddingY}
            borderBottomRadius={16}>
            <Box
              marginX="auto"
              width="100%"
              maxWidth={ContainerWidth}
              bg={HeaderStyle.bgColor}
              alignItems="center"
              paddingY={space['2']}
              borderBottomRadius={16}>
              <Box position="relative">
                {/* <ProfilAvatar
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                size="xl"
              /> */}
                {/* <Box position="absolute" right="-14px" bottom="8px">
                <Link href="#">
                  <EditIcon
                    fill={colors['lightText']}
                    stroke={colors['lightText']}
                  />
                </Link>
              </Box> */}
              </Box>
              <Heading
                // paddingTop={3}
                // paddingBottom={9}
                color={colors.white}
                bold
                fontSize="xl">
                {data?.me?.firstname}
              </Heading>

              {/* <Row width="80%" justifyContent="space-around">
              <Column
                textAlign="center"
                justifyContent="center"
                alignItems="center">
                <UserAchievements points={30} icon={<LFIcon Icon={Star} />} />
              </Column>
              <Column textAlign="center">
                <UserAchievements points={4} icon={<LFIcon Icon={Star} />} />
              </Column>
              <Column textAlign="center">
                <UserAchievements points={90} icon={<LFIcon Icon={Star} />} />
              </Column>
            </Row> */}
            </Box>
          </Flex>
        }
        headerLeft={
          <Row space={space['1']}>
            <NotificationAlert />
          </Row>
        }>
        {(showSuccessfulChangeAlert || userSettingChanged) && (
          <AlertMessage content={t('profile.successmessage')} />
        )}
        <VStack
          space={space['1']}
          width="100%"
          marginX="auto"
          maxWidth={ContainerWidth}>
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
                <Text>{aboutMe}</Text>
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.FluentLanguagenalData.label')}
                href={() => navigate('/change-setting/language')}>
                {(data?.me?.pupil?.languages?.length && (
                  <Row flexWrap="wrap" w="100%">
                    {data?.me?.pupil?.languages.map((lang: string) => (
                      <Column marginRight={3} mb={space['0.5']}>
                        <IconTagList
                          isDisabled
                          iconPath={`languages/icon_${lang.toLowerCase()}.svg`}
                          text={t(`lernfair.languages.${lang.toLowerCase()}`)}
                        />
                      </Column>
                    ))}
                  </Row>
                )) || <Text>{t('profile.Notice.noLanguage')}</Text>}
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.State.label')}
                href={() => navigate('/change-setting/state')}>
                <Row flexWrap="wrap" w="100%">
                  {(data?.me?.pupil?.state && (
                    <Column marginRight={3} mb={space['0.5']}>
                      {(data?.me?.pupil?.state !== 'other' && (
                        <IconTagList
                          isDisabled
                          iconPath={`states/icon_${data?.me?.pupil?.state}.svg`}
                          text={t(`lernfair.states.${data?.me?.pupil?.state}`)}
                        />
                      )) || <Text>Keine Angabe</Text>}
                    </Column>
                  )) || <Text>{t('profile.Notice.noState')}</Text>}
                </Row>
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.SchoolType.label')}
                href={() => navigate('/change-setting/school-type')}>
                <Row flexWrap="wrap" w="100%">
                  {(data?.me?.pupil?.schooltype && (
                    <Column marginRight={3} mb={space['0.5']}>
                      <IconTagList
                        isDisabled
                        iconPath={`schooltypes/icon_${data.me.pupil?.schooltype}.svg`}
                        text={t(
                          `lernfair.schooltypes.${data?.me?.pupil?.schooltype}`
                        )}
                      />
                    </Column>
                  )) || <Text>{t('profile.Notice.noSchoolType')}</Text>}
                </Row>
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.SchoolClass.label')}
                href={() => navigate('/change-setting/class')}>
                <Row flexWrap="wrap" w="100%">
                  {(data?.me?.pupil?.gradeAsInt && (
                    <Column marginRight={3} mb={space['0.5']}>
                      <IconTagList
                        isDisabled
                        textIcon={data?.me?.pupil?.gradeAsInt}
                        text={t('lernfair.schoolclass', {
                          class: data?.me?.pupil?.gradeAsInt
                        })}
                      />
                    </Column>
                  )) || <Text>{t('profile.Notice.noSchoolGrade')}</Text>}
                </Row>
              </ProfileSettingItem>

              <ProfileSettingItem
                border={false}
                title={t('profile.NeedHelpIn.label')}
                href={() => navigate('/change-setting/subjects')}>
                <Row flexWrap="wrap" w="100%">
                  {(data?.me?.pupil?.subjectsFormatted?.length &&
                    data?.me?.pupil?.subjectsFormatted?.map(
                      (sub: { name: string; __typename: string }) => (
                        <Column marginRight={3} mb={space['0.5']}>
                          <IconTagList
                            isDisabled
                            iconPath={`subjects/icon_${getSubjectKey(
                              sub.name
                            )}.svg`}
                            text={sub.name}
                          />
                        </Column>
                      )
                    )) || <Text>{t('profile.Notice.noSchoolSubject')}</Text>}
                </Row>
              </ProfileSettingItem>
            </ProfileSettingRow>
          </VStack>
        </VStack>
      </WithNavigation>
      <Modal
        bg="modalbg"
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
              <Input value={firstName} onChangeText={setFirstName} />
            </FormControl>
            <FormControl>
              <FormControl.Label>
                {t('profile.UserName.label.lastname')}
              </FormControl.Label>
              <Input value={lastName} onChangeText={setLastName} />
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
        bg="modalbg"
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
export default Profile
