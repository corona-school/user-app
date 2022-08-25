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
  HStack
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
import EditIcon from '../assets/icons/lernfair/lf-edit-white.svg'
import Star from '../assets/icons/lernfair/lf-star.svg'
import LFIcon from '../components/LFIcon'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

type Props = {}

const Profile: React.FC<Props> = () => {
  const { colors, space } = useTheme()
  const navigate = useNavigate()

  const [modalVisible, setModalVisible] = React.useState(false)
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const [profilName, setProfilName] = useState('Milan')
  const [userSettingChanged, setUserSettings] = useState(false)

  return (
    <WithNavigation
      headerTitle="Mein Profil"
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
            <Box position="absolute" right="-37px" bottom="-14px">
              <Link href="#">
                <LFIcon Icon={EditIcon} iconFill="#ffffff" />
              </Link>
            </Box>
          </Box>
          <Heading
            paddingTop={3}
            paddingBottom={9}
            color={colors.white}
            bold
            fontSize="xl">
            Tina
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
                <Text>Änderungen wurden erfolgreich gespeichert.</Text>
              </HStack>
            </HStack>
          </VStack>
        </Alert>
      )}
      <VStack space={space['1']}>
        <VStack paddingX={space['1.5']} space={space['1']}>
          <ProfileSettingRow
            title="Profilvollständigkeit"
            helpHeadline="Ihr Profilstatus"
            help="Allgemeiner Beschreibungstext zu den Stadien der Profilprüfung. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
            ">
            <UserProgress procent={25} />
          </ProfileSettingRow>
        </VStack>
        <VStack paddingX={space['1.5']} space={space['1']}>
          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            animationPreset="slide">
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>Name ändern</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label>Dein Name</FormControl.Label>
                  <Input
                    value={profilName}
                    onChangeText={text => {
                      setProfilName(text)
                    }}
                    ref={initialRef}
                  />
                </FormControl>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setModalVisible(false)
                    }}>
                    Abbrechen
                  </Button>
                  <Button
                    onPress={() => {
                      setModalVisible(false)
                      setUserSettings(true)
                    }}>
                    Speichern
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
          <ProfileSettingRow title="Persönliche Daten">
            <ProfileSettingItem
              title="Name"
              href={() => {
                setModalVisible(!modalVisible)
              }}>
              <Text>{profilName}</Text>
            </ProfileSettingItem>

            <ProfileSettingItem
              title="Fließende Sprache"
              href={() => navigate('/change-setting/language')}>
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="Deustch" />
                </Column>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="Englisch" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              title="Bundesland"
              href={() => navigate('/change-setting/state')}>
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="NRW" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              title="Schulform"
              href={() => navigate('/change-setting/school-type')}>
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="Gymnasium" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              title="Klasse"
              href={() => navigate('/change-setting/class')}>
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="6" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              border={false}
              title="Fächer, in denen ich mir Hilfe wünsche"
              href={() => navigate('/change-setting/subjects')}>
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="Mathe" />
                </Column>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="Deutsch" />
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
