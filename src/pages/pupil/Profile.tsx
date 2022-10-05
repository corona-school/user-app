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
  TextArea
} from 'native-base'
import NotificationAlert from '../../components/NotificationAlert'
import WithNavigation from '../../components/WithNavigation'
import IconTagList from '../../widgets/IconTagList'
import ProfilAvatar from '../../widgets/ProfilAvatar'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

import UserAchievements from '../../widgets/UserAchievements'
import UserProgress from '../../widgets/UserProgress'
import EditIcon from '../assets/icons/lernfair/lf-edit.svg'
import Star from '../assets/icons/lernfair/lf-star.svg'
import LFIcon from '../../components/LFIcon'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'

type Props = {}

const Profile: React.FC<Props> = () => {
  const { colors, space } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [firstName, setFirstName] = useState<string>()
  const [lastName, setLastName] = useState<string>()

  const [nameModalVisible, setNameModalVisible] = useState<boolean>(false)
  const [aboutMeModalVisible, setAboutMeModalVisible] = useState<boolean>(false)

  const [aboutMe, setAboutMe] = useState<string>(
    'Willkommen im Profil. Hier kannst du deinen Text anpassen.'
  )
  const [userSettingChanged, setUserSettings] = useState<boolean>(false)

  const { data, error, loading } = useQuery(gql`
    query {
      me {
        firstname
        lastname
        pupil {
          state
          schooltype
          subjectsFormatted {
            name
          }
          gradeAsInt
        }
      }
    }
  `)

  const [changeName, _changeName] = useMutation(gql`
    mutation changeName($firstname: String!, $lastname: String!) {
      meUpdate(update: { firstname: $firstname, lastname: $lastname })
    }
  `)

  useEffect(() => {
    if (_changeName.data) {
      setUserSettings(true)
    }
  }, [_changeName.data])

  useEffect(() => {
    if (data?.me) {
      setFirstName(data?.me?.firstname)
      setLastName(data?.me?.lastname)
    }
  }, [data?.me])

  const profileCompleteness = useMemo(() => {
    const max = 7.0
    let complete = 0.0

    data?.me?.firstname && data?.me?.lastname && (complete += 1)
    data?.me?.aboutMe && (complete += 1)
    data?.me?.pupil?.languages?.length && (complete += 1)
    data?.me?.pupil?.state && (complete += 1)
    data?.me?.pupil?.schooltype && (complete += 1)
    data?.me?.pupil?.gradeAsInt && (complete += 1)
    data?.me?.pupil?.subjectsFormatted?.length && (complete += 1)

    return Math.floor((complete / max) * 100)
  }, [
    data?.me?.aboutMe,
    data?.me?.firstname,
    data?.me?.lastname,
    data?.me?.pupil?.gradeAsInt,
    data?.me?.pupil?.languages?.length,
    data?.me?.pupil?.schooltype,
    data?.me?.pupil?.state,
    data?.me?.pupil?.subjectsFormatted?.length
  ])

  if (loading) return <></>

  return (
    <>
      <WithNavigation
        headerTitle={t('profile.title')}
        headerContent={
          <Box
            bg={'primary.700'}
            alignItems="center"
            paddingY={space['2']}
            borderBottomRadius={16}>
            <Box position="relative">
              <ProfilAvatar
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                size="xl"
              />
              <Box position="absolute" right="-14px" bottom="8px">
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
        }
        headerLeft={<NotificationAlert />}>
        {userSettingChanged && (
          <Alert
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
        <VStack space={space['1']}>
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
                  <Row>
                    {data?.me?.pupil?.languages.map((lang: string) => (
                      <Column marginRight={3}>
                        <IconTagList
                          isDisabled
                          iconPath={`subjects/icon_${lang.toLowerCase()}.svg`}
                          text={lang}
                        />
                      </Column>
                    ))}
                  </Row>
                )) || <Text>Es wurden keine Sprachen angegeben</Text>}
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.State.label')}
                href={() => navigate('/change-setting/state')}>
                <Row>
                  {(data?.me?.pupil?.state && (
                    <Column marginRight={3}>
                      <IconTagList
                        isDisabled
                        iconPath={`states/icon_${data?.me?.pupil?.state}.svg`}
                        text={t(`lernfair.states.${data?.me?.pupil?.state}`)}
                      />
                    </Column>
                  )) || <Text>Es wurde kein Bundesland angegeben</Text>}
                </Row>
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.SchoolType.label')}
                href={() => navigate('/change-setting/school-type')}>
                <Row>
                  {(data?.me?.pupil?.schooltype && (
                    <Column marginRight={3}>
                      <IconTagList
                        isDisabled
                        iconPath={`schooltypes/icon_${data.me.pupil?.schooltype}.svg`}
                        text={t(
                          `lernfair.schooltypes.${data?.me?.pupil?.schooltype}`
                        )}
                      />
                    </Column>
                  )) || <Text>Es wurde keine Schulform angegeben</Text>}
                </Row>
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.SchoolClass.label')}
                href={() => navigate('/change-setting/class')}>
                <Row>
                  {(data?.me?.pupil?.gradeAsInt && (
                    <Column marginRight={3}>
                      <IconTagList
                        isDisabled
                        textIcon={data?.me?.pupil?.gradeAsInt}
                        text={t('lernfair.schoolclass', {
                          class: data?.me?.pupil?.gradeAsInt
                        })}
                      />
                    </Column>
                  )) || <Text>Es wurde keine Klasse angegeben</Text>}
                </Row>
              </ProfileSettingItem>

              <ProfileSettingItem
                border={false}
                title={t('profile.NeedHelpIn.label')}
                href={() => navigate('/change-setting/subjects')}>
                <Row>
                  {(data?.me?.pupil?.subjectsFormatted?.length &&
                    data?.me?.pupil?.subjectsFormatted?.map(
                      (sub: { name: string; __typename: string }) => (
                        <Column marginRight={3}>
                          <IconTagList
                            isDisabled
                            iconPath={'subjects/icon_mathe.svg'}
                            text={sub.name}
                          />
                        </Column>
                      )
                    )) || <Text>Es wurde keine Fächer angegeben</Text>}
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
                onChangeText={text => {
                  setAboutMe(text)
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
                  setAboutMeModalVisible(false)
                }}>
                {t('profile.AboutMe.popup.exit')}
              </Button>
              <Button
                onPress={() => {
                  setAboutMeModalVisible(false)
                  setUserSettings(true)
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
