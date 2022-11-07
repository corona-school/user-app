import { gql, useMutation, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Button,
  Text,
  Heading,
  useTheme,
  VStack,
  Row,
  Column,
  Input,
  FormControl,
  Stack,
  Alert,
  HStack,
  useBreakpointValue
} from 'native-base'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import WithNavigation from '../../components/WithNavigation'
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

  const location = useLocation()
  const { state } = location as { state: { userType: string } }

  const [showError, setShowError] = useState<boolean>()

  const navigate = useNavigate()

  const { data, loading } = useQuery(gql`
    ${state?.userType === 'student' ? queryStudent : queryPupil}
  `)

  const [updateSchooltype, _updateSchooltype] = useMutation(gql`
    ${state?.userType === 'student' ? mutStudent : mutPupil}
  `)

  const [selections, setSelections] = useState<string>('')

  useEffect(() => {
    setSelections(data?.me[state?.userType].schooltype)
  }, [data?.me, state?.userType])

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

  if (loading) return <CenterLoadingSpinner />

  return (
    <WithNavigation
      headerTitle={t('profile.SchoolType.single.header')}
      showBack>
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
                iconPath={`schooltypes/icon_${
                  selections === 'hauptschule' ? 'realschule' : selections
                }.svg`}
                text={t(`lernfair.schooltypes.${selections}`)}
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
                          iconPath={`schooltypes/icon_${
                            schooltype.key === 'hauptschule'
                              ? 'realschule'
                              : schooltype.key
                          }.svg`}
                          text={schooltype.label}
                          onPress={() => setSelections(schooltype.key)}
                        />
                      </Column>
                    )
                )}
              </Row>
              {selections === 'andere' && (
                <Row>
                  <FormControl>
                    <Stack>
                      <FormControl.Label>
                        <Text bold>
                          {t('profile.SchoolType.single.optional.label')}
                        </Text>
                      </FormControl.Label>
                      <Input
                        type="text"
                        multiline
                        numberOfLines={3}
                        h={70}
                        placeholder={t(
                          'profile.SchoolType.single.optional.placeholder'
                        )}
                      />
                    </Stack>
                  </FormControl>
                </Row>
              )}
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
        {/* {userSettingChanged && (
          <Alert marginY={3} colorScheme="success" status="success">
            <VStack space={2} flexShrink={1} w="100%">
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between">
                <HStack space={2} flexShrink={1} alignItems="center">
                  <Alert.Icon />
                  <Text>{t('profile.successmessage')}</Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        )} */}
        {showError && <AlertMessage content={t('profile.errormessage')} />}
        <Button
          width={ButtonContainer}
          onPress={() => {
            updateSchooltype({ variables: { schooltype: selections } })
          }}>
          {t('profile.SchoolType.single.button')}
        </Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSettingSchoolType
