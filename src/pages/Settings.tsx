import { gql, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Heading,
  useTheme,
  VStack,
  Column,
  HStack,
  useBreakpointValue
} from 'native-base'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import WithNavigation from '../components/WithNavigation'
import useApollo from '../hooks/useApollo'
import EditDataRow from '../widgets/EditDataRow'
import ProfilAvatar from '../widgets/ProfilAvatar'
import ProfileSettingRow from '../widgets/ProfileSettingRow'

type Props = {}

const Settings: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { clearToken } = useApollo()
  const tabspace = 3
  // const { user } = useLernfair()
  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Einstellungen'
    })
  }, [])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const { data, error, loading } = useQuery(gql`
    query {
      me {
        firstname
      }
    }
  `)

  if (loading) return <></>

  return (
    <WithNavigation
      headerTitle={t('settings.header')}
      headerLeft={<BackButton />}>
      <VStack paddingBottom={7} paddingX={space['1.5']}>
        <HStack space={space['1']} alignItems="center">
          <ProfilAvatar
            size="md"
            image="https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
          <Heading>{data?.me?.firstname}</Heading>
        </HStack>
      </VStack>
      <VStack
        paddingX={space['1.5']}
        space={space['1']}
        maxWidth={ContainerWidth}>
        <ProfileSettingRow title={t('settings.general.title')} isSpace={false}>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.general.profile')}
              onPress={() => navigate('/profile')}
            />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.general.languageVersion')}
              isDisabled
            />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.general.notifications')}
              isDisabled
            />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.general.onboarding')}
              onPress={() => navigate('/onboarding-list')}
            />
          </Column>
        </ProfileSettingRow>
        <ProfileSettingRow title={t('settings.account.title')} isSpace={false}>
          <Column mb={tabspace}>
            <EditDataRow label={t('settings.account.changeEmail')} isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.account.changePassword')}
              isDisabled
            />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label={t('settings.account.changeUser')} isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.account.deleteAccount')}
              isDisabled
            />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.account.logout')}
              onPress={() => {
                trackEvent({
                  category: 'profil',
                  action: 'click-event',
                  name: 'Abmelden im Account',
                  documentTitle: 'Logout'
                })
                clearToken()
                navigate(0)
              }}
            />
          </Column>
        </ProfileSettingRow>
        <ProfileSettingRow title={t('settings.legal.title')} isSpace={false}>
          <Column mb={tabspace}>
            <EditDataRow label={t('settings.legal.imprint')} isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label={t('settings.legal.datapolicy')} isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow label={t('settings.legal.terms')} isDisabled />
          </Column>
        </ProfileSettingRow>
      </VStack>
    </WithNavigation>
  )
}
export default Settings
