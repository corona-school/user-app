import { gql, useMutation, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Button,
  Heading,
  useTheme,
  VStack,
  Row,
  Column,
  useBreakpointValue
} from 'native-base'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import WithNavigation from '../../components/WithNavigation'
import useLernfair from '../../hooks/useLernfair'
import { schooltypes } from '../../types/lernfair/SchoolType'
import AlertMessage from '../../widgets/AlertMessage'
import IconTagList from '../../widgets/IconTagList'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

const queryStudent = `query {
  me {
    student {
      schooltype
    }
  }
}`
const queryPupil = `query {
  me {
    pupil {
      schooltype
    }
  }
}`
const mutStudent = `mutation updateSchooltype($schooltype: SchoolType!) {
  meUpdate(update: { student: { schooltype: $schooltype } })
}`
const mutPupil = `mutation updateSchooltype($schooltype: SchoolType!) {
  meUpdate(update: { pupil: { schooltype: $schooltype } })
}`

type Props = {}

const ChangeSettingSchoolType: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()

  const { userType } = useLernfair()

  const [showError, setShowError] = useState<boolean>()

  const navigate = useNavigate()

  const { data, loading } = useQuery(
    gql`
      ${userType === 'student' ? queryStudent : queryPupil}
    `,
    {
      fetchPolicy: 'no-cache'
    }
  )

  const [updateSchooltype, _updateSchooltype] = useMutation(gql`
    ${userType === 'student' ? mutStudent : mutPupil}
  `)

  const [selections, setSelections] = useState<string>('')

  useEffect(() => {
    if (loading || !userType) return
    setSelections(data?.me[userType].schooltype)
  }, [loading, data?.me, userType])

  useEffect(() => {
    if (_updateSchooltype.data && !_updateSchooltype.error) {
      // setUserSettingChanged(true)
      navigate('/profile', { state: { showSuccessfulChangeAlert: true } })
    }
  }, [_updateSchooltype.data, _updateSchooltype.error, navigate])

  useEffect(() => {
    if (_updateSchooltype.error) {
      setShowError(true)
    }
  }, [_updateSchooltype.error])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Profil Einstellungen – Bundesland'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <WithNavigation
      headerTitle={t('profile.SchoolType.single.header')}
      showBack
      isLoading={loading}>
      <VStack
        paddingX={space['1.5']}
        space={space['1']}
        marginX="auto"
        width="100%"
        maxWidth={ContainerWidth}>
        <Heading>{t('profile.SchoolType.single.title')}</Heading>
        <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
          <Row flexWrap="wrap" width="100%">
            <Column marginRight={3} marginBottom={3}>
              <IconTagList
                isDisabled
                initial={false}
                iconPath={`schooltypes/icon_${selections.toLowerCase()}.svg`}
                text={t(`lernfair.schooltypes.${selections.toLowerCase()}`)}
              />
            </Column>
          </Row>
        </ProfileSettingItem>
      </VStack>
      <VStack
        paddingX={space['1.5']}
        space={space['1']}
        marginX="auto"
        width="100%"
        maxWidth={ContainerWidth}>
        <ProfileSettingRow title={t('profile.SchoolType.single.others')}>
          <ProfileSettingItem
            border={false}
            isIcon={false}
            isHeaderspace={false}>
            <VStack w="100%">
              <Row flexWrap="wrap" width="100%">
                {schooltypes.map(
                  (schooltype, index) =>
                    selections !== schooltype.key && (
                      <Column
                        marginRight={3}
                        marginBottom={3}
                        key={`offers-${index}`}>
                        <IconTagList
                          initial={false}
                          iconPath={`schooltypes/icon_${schooltype.key}.svg`}
                          text={schooltype.label}
                          onPress={() => setSelections(schooltype.label)}
                        />
                      </Column>
                    )
                )}
              </Row>
            </VStack>
          </ProfileSettingItem>
        </ProfileSettingRow>
      </VStack>
      <VStack
        paddingX={space['1.5']}
        paddingBottom={space['1.5']}
        marginX="auto"
        width="100%"
        maxWidth={ContainerWidth}>
        {showError && <AlertMessage content={t('profile.errormessage')} />}
        <Button
          width={ButtonContainer}
          onPress={() => {
            updateSchooltype({
              variables: { schooltype: selections.toLowerCase() }
            })
          }}>
          {t('profile.SchoolType.single.button')}
        </Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSettingSchoolType
