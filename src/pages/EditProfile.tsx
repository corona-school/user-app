import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Text, VStack, Avatar, useTheme } from 'native-base'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import EditDataRow from '../widgets/EditDataRow'

type Props = {}

const EditProfile: React.FC<Props> = () => {
  const { colors, space } = useTheme()
  const { t } = useTranslation()
  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Profil bearbeiten',
      href: '/edit-profile'
    })
  }, [])

  return (
    <VStack space={space['2']}>
      <VStack
        space={space['1']}
        bg={'primary.100'}
        alignItems="center"
        paddingY={space['2']}
        borderBottomRadius={16}>
        <Avatar size="xl" />
        <Text color={colors.white} fontWeight={'thin'}>
          {t('profile.editprofile')}
        </Text>
      </VStack>
      <VStack space={space['0.5']} paddingX={space['1']}>
        <EditDataRow
          label={t('profile.UserName.popup.header')}
          value="Rainer Zufall"
          onPress={() => alert('test')}
        />
        <EditDataRow label={t('profile.SchoolType.single.header')} />
        <EditDataRow
          label={t('profile.SchoolClass.single.header')}
          value="6, 7, 8"
        />
        <EditDataRow label={t('profile.birthday')} />
        <EditDataRow
          label={t('profile.NeedHelpIn.single.header')}
          value="Englisch, Informatik"
        />
        <EditDataRow label={t('profile.type')} value="1:1, Gruppe" />
        <EditDataRow label={t('profile.availability')} />
      </VStack>
    </VStack>
  )
}
export default EditProfile
