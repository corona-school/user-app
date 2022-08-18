import {
  Box,
  Heading,
  useTheme,
  VStack,
  Column,
  ArrowBackIcon,
  Badge,
  DeleteIcon,
  HStack
} from 'native-base'
import WithNavigation from '../components/WithNavigation'
import EditDataRow from '../widgets/EditDataRow'
import ProfilAvatar from '../widgets/ProfilAvatar'
import ProfileSettingRow from '../widgets/ProfileSettingRow'

type Props = {}

const Settings: React.FC<Props> = () => {
  const { colors, space } = useTheme()
  const tabspace = 3

  return (
    <WithNavigation
      headerTitle="Einstellungen"
      headerLeft={<ArrowBackIcon size="xl" color="lightText" />}
      headerRight={
        <Box>
          <Badge
            bgColor={'danger.500'}
            rounded="3xl"
            zIndex={1}
            variant="solid"
            alignSelf="flex-end"
            top="2"
            right="-5">
            {' '}
          </Badge>
          <DeleteIcon color="lightText" size="xl" />
        </Box>
      }>
      <VStack paddingTop={space['4']} paddingBottom={7} paddingX={space['1.5']}>
        <HStack space={space['1']} alignItems="center">
          <ProfilAvatar
            size="md"
            image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
          <Heading>Milan</Heading>
        </HStack>
      </VStack>
      <VStack paddingX={space['1.5']} space={space['1']}>
        <ProfileSettingRow title="Allgemein" isSpace={false}>
          <Column mb={tabspace}>
            <EditDataRow label="Profil" />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Sprachversion" />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Benachrichtigungen" />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Onboarding-Tour" />
          </Column>
        </ProfileSettingRow>
        <ProfileSettingRow title="Konto" isSpace={false}>
          <Column mb={tabspace}>
            <EditDataRow label="E-Mail ändern" />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Passwort ändern" />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Benutzer wechseln" />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Abmelden" />
          </Column>
        </ProfileSettingRow>
        <ProfileSettingRow title="Rechtliches" isSpace={false}>
          <Column mb={tabspace}>
            <EditDataRow label="Impressum" />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Datenschutz" />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Nutzungsbedingungen" />
          </Column>
        </ProfileSettingRow>
      </VStack>
    </WithNavigation>
  )
}
export default Settings
