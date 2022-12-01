import { gql, useMutation, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Heading,
  useTheme,
  VStack,
  Column,
  HStack,
  useBreakpointValue,
  useToast
} from 'native-base'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import WithNavigation from '../components/WithNavigation'
import useApollo from '../hooks/useApollo'
import useLernfair from '../hooks/useLernfair'
import EditDataRow from '../widgets/EditDataRow'
import ProfileSettingRow from '../widgets/ProfileSettingRow'

const Settings: React.FC = () => {
  const toast = useToast()
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useApollo()
  const tabspace = 3
  const { userType } = useLernfair()
  const { trackPageView, trackEvent } = useMatomo()

  const [deactivateAccount, { loading: loadingDeactivate }] = useMutation(gql`
    mutation {
      meDeactivate
    }
  `)

  useEffect(() => {
    trackPageView({
      documentTitle: 'Einstellungen'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const { data, loading } = useQuery(gql`
    query {
      me {
        firstname
      }
    }
  `)

  const deactivate = useCallback(async () => {
    const res = await deactivateAccount()

    if (res.data.meDeactivate) {
      trackEvent({
        category: 'profil',
        action: 'click-event',
        name: 'Account deaktivieren',
        documentTitle: 'Deactivate'
      })
      logout()
      navigate('/welcome', { state: { deactivated: true } })
    } else {
      toast.show({
        description: 'Dein Account konnte nicht deaktiviert werden.'
      })
    }
  }, [deactivateAccount, logout, navigate, toast, trackEvent])

  return (
    <WithNavigation
      headerTitle={t('settings.header')}
      showBack
      hideMenu
      isLoading={loading}>
      <VStack
        paddingBottom={7}
        paddingX={space['1.5']}
        marginX="auto"
        width="100%"
        maxWidth={ContainerWidth}>
        <HStack space={space['1']} alignItems="center">
          <Heading>{data?.me?.firstname}</Heading>
        </HStack>
      </VStack>
      <VStack
        paddingX={space['1.5']}
        space={space['1']}
        marginX="auto"
        width="100%"
        maxWidth={ContainerWidth}>
        <ProfileSettingRow title={t('settings.general.title')} isSpace={false}>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.general.profile')}
              onPress={() => navigate('/profile')}
            />
          </Column>
          {/* <Column mb={tabspace}>
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
          </Column> */}
          {userType === 'student' && (
            <Column mb={tabspace}>
              <EditDataRow
                label={t('settings.general.onboarding')}
                onPress={() => navigate('/onboarding-list')}
              />
            </Column>
          )}
        </ProfileSettingRow>
        <ProfileSettingRow title={t('settings.account.title')} isSpace={false}>
          {/* <Column mb={tabspace}>
            <EditDataRow label={t('settings.account.changeEmail')} isDisabled />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.account.changePassword')}
              isDisabled
            />
          </Column> */}
          {/* <Column mb={tabspace}>
            <EditDataRow label={t('settings.account.changeUser')} isDisabled />
          </Column> */}
          {/* <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.account.deleteAccount')}
              isDisabled
            />
          </Column> */}
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
                logout()
                navigate(0)
              }}
            />
          </Column>
        </ProfileSettingRow>
        <ProfileSettingRow title={t('settings.legal.title')} isSpace={false}>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.legal.imprint')}
              onPress={() => navigate('/imprint')}
            />
          </Column>
          <Column mb={tabspace}>
            <EditDataRow
              label={t('settings.legal.datapolicy')}
              onPress={() => navigate('/privacy')}
            />
          </Column>
        </ProfileSettingRow>

        {userType === 'pupil' && (
          <Column mt={tabspace}>
            <EditDataRow
              isDisabled={loadingDeactivate}
              label={t('settings.account.deactivateAccount')}
              onPress={deactivate}
            />
          </Column>
        )}
      </VStack>
    </WithNavigation>
  )
}
export default Settings
