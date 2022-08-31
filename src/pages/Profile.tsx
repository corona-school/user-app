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
import NotificationAlert from '../components/NotificationAlert'
import SettingsButton from '../components/SettingsButton'
import WithNavigation from '../components/WithNavigation'
import IconTagList from '../widgets/IconTagList'
import ProfilAvatar from '../widgets/ProfilAvatar'
import ProfileSettingItem from '../widgets/ProfileSettingItem'
import ProfileSettingRow from '../widgets/ProfileSettingRow'

import UserAchievements from '../widgets/UserAchievements'
import UserProgress from '../widgets/UserProgress'
import EditIcon from '../assets/icons/lernfair/lf-edit.svg'
import Star from '../assets/icons/lernfair/lf-star.svg'
import LFIcon from '../components/LFIcon'
import { useNavigate } from 'react-router-dom'
import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {}

const Profile: React.FC<Props> = () => {
  const { colors, space } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [nameModalVisible, setNameModalVisible] = useState<boolean>(false)
  const [aboutMeModalVisible, setAboutMeModalVisible] = useState<boolean>(false)
  const [profilName, setProfilName] = useState<string>('Milan')
  const [aboutMe, setAboutMe] = useState<string>(
    'Willkommen im Profil. Hier kannst du deinen Text anpassen.'
  )
  const [userSettingChanged, setUserSettings] = useState(false)

  return (
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
            <Box position="absolute" right="-5px" bottom="-5px">
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
            Milan
          </Heading>

          <Row width="80%" justifyContent="space-around">
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
          </Row>
        </Box>
      }
      headerLeft={<SettingsButton />}
      headerRight={<NotificationAlert />}>
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
            <UserProgress procent={25} />
          </ProfileSettingRow>
        </VStack>
        <VStack paddingX={space['1.5']} space={space['1']}>
          <Modal
            isOpen={nameModalVisible}
            onClose={() => setNameModalVisible(false)}>
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>{t('profile.UserName.popup.header')}</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label>
                    {t('profile.UserName.popup.label')}
                  </FormControl.Label>
                  <Input
                    value={profilName}
                    onChangeText={text => {
                      setProfilName(text)
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
                      setUserSettings(true)
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
          <ProfileSettingRow title={t('profile.PersonalData')}>
            <ProfileSettingItem
              title={t('profile.UserName.label')}
              href={() => {
                setNameModalVisible(!nameModalVisible)
              }}>
              <Text>{profilName}</Text>
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
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled iconPath="#" text="Deustch" />
                </Column>
                <Column marginRight={3}>
                  <IconTagList isDisabled iconPath="#" text="Englisch" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              title={t('profile.State.label')}
              href={() => navigate('/change-setting/state')}>
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled iconPath="#" text="NRW" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              title={t('profile.SchoolType.label')}
              href={() => navigate('/change-setting/school-type')}>
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled iconPath="#" text="Gymnasium" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              title={t('profile.SchoolClass.label')}
              href={() => navigate('/change-setting/class')}>
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled iconPath="#" text="6" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              border={false}
              title={t('profile.NeedHelpIn.label')}
              href={() => navigate('/change-setting/subjects')}>
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled iconPath="#" text="Mathe" />
                </Column>
                <Column marginRight={3}>
                  <IconTagList isDisabled iconPath="#" text="Deutsch" />
                </Column>
              </Row>
            </ProfileSettingItem>
          </ProfileSettingRow>
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default Profile
