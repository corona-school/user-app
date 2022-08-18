import {
  Button,
  Box,
  Text,
  Heading,
  useTheme,
  VStack,
  Row,
  ThreeDotsIcon,
  Link,
  Column,
  AddIcon
} from 'native-base'
import CTACard from '../widgets/CTACard'
import IconTagList from '../widgets/IconTagList'
import ProfilAvatar from '../widgets/ProfilAvatar'
import ProfileSettingItem from '../widgets/ProfileSettingItem'
import ProfileSettingRow from '../widgets/ProfileSettingRow'
import SimpleDataRow from '../widgets/SimpleDataRow'
import SubjectTag from '../widgets/SubjectTag'
import UserAchievements from '../widgets/UserAchievements'
import UserProgress from '../widgets/UserProgress'

type Props = {}

const ChangeSetting: React.FC<Props> = () => {
  const { colors, space } = useTheme()

  return (
    <VStack space={space['1']}>
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
              <ThreeDotsIcon color="white" />
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
            <UserAchievements
              points={30}
              icon={<AddIcon size="3" color="primary.700" />}
            />
          </Column>
          <Column textAlign="center">
            <UserAchievements
              points={4}
              icon={<AddIcon size="3" color="primary.700" />}
            />
          </Column>
          <Column textAlign="center">
            <UserAchievements
              points={90}
              icon={<AddIcon size="3" color="primary.700" />}
            />
          </Column>
        </Row>
      </Box>
      <VStack paddingX={space['1.5']} space={space['1']}>
        <ProfileSettingRow
          title="Profilvollständigkeit"
          help="Lorem Ipsum dolor sit amet">
          <UserProgress procent={25} />
        </ProfileSettingRow>
      </VStack>
      <VStack paddingX={space['1.5']} space={space['1']}>
        <ProfileSettingRow title="Persönliche Daten">
          <ProfileSettingItem title="Name">
            <Row>
              <Column marginRight={3}>
                <IconTagList icon="h" text="text" />
              </Column>
              <Column marginRight={3}>
                <IconTagList icon="h" text="text" />
              </Column>
            </Row>
          </ProfileSettingItem>

          <ProfileSettingItem title="Fließende Sprache">
            <Row>
              <Column marginRight={3}>
                <IconTagList icon="h" text="text" />
              </Column>
            </Row>
          </ProfileSettingItem>

          <ProfileSettingItem title="Bundesland">
            <Row>
              <Column marginRight={3}>
                <IconTagList icon="h" text="text" />
              </Column>
              <Column marginRight={2}>
                <IconTagList icon="h" text="text" />
              </Column>
            </Row>
          </ProfileSettingItem>

          <ProfileSettingItem title="Schulform">
            <Row>
              <Column marginRight={3}>
                <IconTagList icon="h" text="text" />
              </Column>
              <Column marginRight={3}>
                <IconTagList icon="h" text="text" />
              </Column>
              <Column marginRight={3}>
                <IconTagList icon="h" text="text" />
              </Column>
            </Row>
          </ProfileSettingItem>

          <ProfileSettingItem title="Fächer, in denen ich mir Hilfe wünsche">
            <Row>
              <Column marginRight={3}>
                <IconTagList icon="h" text="text" />
              </Column>
              <Column marginRight={3}>
                <IconTagList icon="h" text="text" />
              </Column>
              <Column marginRight={3}>
                <IconTagList icon="h" text="text" />
              </Column>
            </Row>
          </ProfileSettingItem>
        </ProfileSettingRow>
      </VStack>
    </VStack>
  )
}
export default ChangeSetting
