import { gql, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Heading,
  useTheme,
  VStack,
  Column,
  HStack,
  useBreakpointValue,
  CloseIcon,
  Pressable,
  Modal,
  Button
} from 'native-base'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import WithNavigation from '../components/WithNavigation'
import useApollo, { useUserType } from '../hooks/useApollo'
import DeactivateAccountModal from '../modals/DeactivateAccountModal'
import EditDataRow from '../widgets/EditDataRow'
import ProfileSettingRow from '../widgets/ProfileSettingRow'

const Settings: React.FC = () => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useApollo()
  const tabspace = 3
  const userType = useUserType()
  const { trackPageView, trackEvent } = useMatomo()

  const [showDeactivate, setShowDeactivate] = useState<boolean>(false)
  const [showCertificateOptions, setShowCertificateOptions] =
    useState<boolean>()

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
    query GetFirstname {
      me {
        firstname
      }
    }
  `)

  return (
    <>
      <WithNavigation
        headerTitle={t('settings.header')}
        hideMenu
        headerRight={
          <Pressable onPress={() => navigate(-1)}>
            <CloseIcon color="lightText" />
          </Pressable>
        }
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
          <ProfileSettingRow
            title={t('settings.general.title')}
            isSpace={false}>
            <Column mb={tabspace}>
              <EditDataRow
                label={t('settings.general.profile')}
                onPress={() => navigate('/profile')}
              />
            </Column>
            <Column mb={tabspace}>
              <EditDataRow
                label={'Bescheinigung beantragen'}
                onPress={() => setShowCertificateOptions(true)}
              />
            </Column>
            <Column mb={tabspace}>
              <EditDataRow
                label={t('settings.account.changePassword')}
                onPress={() => navigate('/reset-password')}
              />
            </Column>

            <Column mb={tabspace}>
              <EditDataRow
                label={t('settings.account.deactivateAccount')}
                onPress={() => setShowDeactivate(true)}
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
                  logout()
                }}
              />
            </Column>
          </ProfileSettingRow>
          <ProfileSettingRow title={t('settings.legal.title')} isSpace={false}>
            <Column mb={tabspace}>
              <EditDataRow
                label={t('settings.legal.imprint')}
                onPress={() => navigate('/impressum')}
              />
            </Column>
            <Column mb={tabspace}>
              <EditDataRow
                label={t('settings.legal.datapolicy')}
                onPress={() => navigate('/datenschutz')}
              />
            </Column>
          </ProfileSettingRow>
        </VStack>
      </WithNavigation>
      <DeactivateAccountModal
        isOpen={showDeactivate}
        onCloseModal={() => setShowDeactivate(false)}
      />
      <Modal
        isOpen={showCertificateOptions}
        onClose={() => setShowCertificateOptions(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Bescheinigung beantragen</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Button
                onPress={() => {
                  setShowCertificateOptions(false)
                  navigate('/request-certificate', {
                    state: { type: 'matching' }
                  })
                }}>
                1:1 Lernunterstützung
              </Button>
              <Button
                onPress={() => {
                  setShowCertificateOptions(false)
                  navigate('/request-certificate', { state: { type: 'group' } })
                }}>
                Gruppenkurs
              </Button>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default Settings
