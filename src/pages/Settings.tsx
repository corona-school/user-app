import { Heading, useTheme, VStack, Column, HStack } from 'native-base'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import NotificationAlert from '../components/NotificationAlert'
import WithNavigation from '../components/WithNavigation'
import useApollo from '../hooks/useApollo'
import EditDataRow from '../widgets/EditDataRow'
import ProfilAvatar from '../widgets/ProfilAvatar'
import ProfileSettingRow from '../widgets/ProfileSettingRow'

type Props = {}

const Settings: React.FC<Props> = () => {
  const { space } = useTheme()
  const navigate = useNavigate()
  const { clearToken } = useApollo()
  const tabspace = 3

  return (
    <WithNavigation
      headerTitle="Einstellungen"
      headerLeft={<BackButton />}
      headerRight={<NotificationAlert />}>
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
            <EditDataRow label="Profil" onPress={() => navigate('/profile')} />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Sprachversion" isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Benachrichtigungen" isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow
              label="Onboarding-Tour"
              onPress={() => navigate('/onboarding-list')}
            />
          </Column>
        </ProfileSettingRow>
        <ProfileSettingRow title="Konto" isSpace={false}>
          <Column mb={tabspace}>
            <EditDataRow label="E-Mail ändern" isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Passwort ändern" isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Benutzer wechseln" isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow
              label="Abmelden"
              onPress={() => {
                clearToken()
                navigate(0)
              }}
            />
          </Column>
        </ProfileSettingRow>
        <ProfileSettingRow title="Rechtliches" isSpace={false}>
          <Column mb={tabspace}>
            <EditDataRow label="Impressum" isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Datenschutz" isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label="Nutzungsbedingungen" isDisabled />
          </Column>
        </ProfileSettingRow>
      </VStack>
    </WithNavigation>
  )
}
export default Settings
