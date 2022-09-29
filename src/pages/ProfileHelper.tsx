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
  Circle,
  Container
} from 'native-base'
import NotificationAlert from '../components/NotificationAlert'
import WithNavigation from '../components/WithNavigation'
import IconTagList from '../widgets/IconTagList'
import ProfilAvatar from '../widgets/ProfilAvatar'
import ProfileSettingItem from '../widgets/ProfileSettingItem'
import ProfileSettingRow from '../widgets/ProfileSettingRow'

import UserProgress from '../widgets/UserProgress'
import EditIcon from '../assets/icons/lernfair/lf-edit.svg'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gql, useMutation, useQuery } from '@apollo/client'
import Tabs from '../components/Tabs'
import HSection from '../widgets/HSection'
import HelperCardCertificates from '../widgets/HelperCardCertificates'
import HelperWizard from '../widgets/HelperWizard'

type Props = {}

const ProfileHelper: React.FC<Props> = () => {
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

        <VStack paddingX={space['1']} paddingY={space['1']}>
          <HelperWizard index={0} />
        </VStack>

        <VStack space={space['1']}>
          <VStack paddingX={space['1.5']} space={space['1']}>
            <ProfileSettingRow title={t('profile.ProfileCompletion.name')}>
              <UserProgress percent={25} />
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
                title={t('profile.State.label')}
                href={() => navigate('/change-setting/state')}>
                <Row>
                  {data?.me?.pupil.state && (
                    <Column marginRight={3}>
                      <IconTagList
                        isDisabled
                        iconPath={`states/icon_${data?.me?.pupil.state}.svg`}
                        text={t(`lernfair.states.${data?.me?.pupil.state}`)}
                      />
                    </Column>
                  )}
                </Row>
              </ProfileSettingItem>

              <ProfileSettingItem
                title={t('profile.SchoolType.label')}
                href={() => navigate('/change-setting/school-type')}>
                <Row>
                  {data?.me?.pupil?.schooltype && (
                    <Column marginRight={3}>
                      <IconTagList
                        isDisabled
                        iconPath={`schooltypes/icon_${data.me.pupil.schooltype}.svg`}
                        text={t(
                          `lernfair.schooltypes.${data?.me?.pupil.schooltype}`
                        )}
                      />
                    </Column>
                  )}
                </Row>
              </ProfileSettingItem>
              <ProfileSettingItem
                border={false}
                title={t('profile.NeedHelpIn.label')}
                href={() => navigate('/change-setting/subjects')}>
                <Row>
                  {data?.me?.pupil?.subjectsFormatted?.map(
                    (sub: { name: string; __typename: string }) => (
                      <Column marginRight={3}>
                        <IconTagList
                          isDisabled
                          iconPath={'subjects/icon_mathe.svg'}
                          text={sub.name}
                        />
                      </Column>
                    )
                  )}
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
                            {Array(2)
                              .fill(0)
                              .map((el, i) => (
                                <HelperCardCertificates
                                  name="Nele Mustermann"
                                  subject="Mathe"
                                  status="Manuell bestätigt"
                                  createDate="01.09.22"
                                  avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                  download={() => alert('Hallo')}
                                />
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
                            {Array(2)
                              .fill(0)
                              .map((el, i) => (
                                <HelperCardCertificates
                                  name="Nele Mustermann"
                                  subject="Mathe"
                                  status="ausstehend"
                                  createDate="01.09.22"
                                  avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                  download={() => alert('Hallo')}
                                />
                              ))}
                          </HSection>
                        </>
                      )
                    }
                  ]}
                />
              </Container>
              <Container maxWidth="100%" width="100%" alignItems="stretch">
                <Button>{t('profile.Helper.certificate.button')}</Button>
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
                value={(!!firstName && firstName) || data?.me?.firstname}
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
                value={(!!lastName && lastName) || data?.me?.lastname}
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
export default ProfileHelper
