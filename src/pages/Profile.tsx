import {
  Box,
  Heading,
  useTheme,
  VStack,
  Row,
  ThreeDotsIcon,
  Link,
  Column,
  AddIcon
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
import StarIcon from '../assets/icons/lernfair/lf-star.svg'

type Props = {}

const Profile: React.FC<Props> = () => {
  const { colors, space } = useTheme()

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
            <Box position="absolute" right={-17} bottom={0}>
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
            Tina
          </Heading>

          <Row width="80%" justifyContent="space-around">
            <Column textAlign="center">
              <UserAchievements points={30} icon={<StarIcon />} />
            </Column>
            <Column textAlign="center">
              <UserAchievements points={4} icon={<StarIcon />} />
            </Column>
            <Column textAlign="center">
              <UserAchievements points={90} icon={<StarIcon />} />
            </Column>
          </Row>
        </Box>
      }
      headerLeft={<SettingsButton />}
      headerRight={<NotificationAlert />}>
      <VStack space={space['1']}>
        <VStack paddingX={space['1.5']} space={space['1']}>
          <ProfileSettingRow
            title="Profilvollständigkeit"
            help="Lorem Ipsum dolor sit amet">
            <UserProgress procent={25} />
          </ProfileSettingRow>
        </VStack>
        <VStack paddingX={space['1.5']} space={space['1']}>
          <ProfileSettingRow title="Persönliche Daten">
            <ProfileSettingItem title="Name" href="/change-setting/name">
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="text" />
                </Column>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="text" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              title="Fließende Sprache"
              href="/change-setting/language">
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="text" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem title="Bundesland" href="/change-setting/state">
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="text" />
                </Column>
                <Column marginRight={2}>
                  <IconTagList isDisabled icon="h" text="text" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              title="Schulform"
              href="/change-setting/schooltype">
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="text" />
                </Column>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="text" />
                </Column>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="text" />
                </Column>
              </Row>
            </ProfileSettingItem>

            <ProfileSettingItem
              border={false}
              title="Fächer, in denen ich mir Hilfe wünsche"
              href="/change-setting/subjects">
              <Row>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="text" />
                </Column>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="text" />
                </Column>
                <Column marginRight={3}>
                  <IconTagList isDisabled icon="h" text="text" />
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
