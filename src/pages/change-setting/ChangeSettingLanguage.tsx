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
  useBreakpointValue
} from 'native-base'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { useNavigate } from 'react-router-dom'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import WithNavigation from '../../components/WithNavigation'
import useLernfair from '../../hooks/useLernfair'
import { languages } from '../../types/lernfair/Language'
import AlertMessage from '../../widgets/AlertMessage'
import IconTagList from '../../widgets/IconTagList'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

const queryStudent = `query {
  me {
    student {
      languages
    }
  }
}`
const queryPupil = `query {
  me {
    pupil {
      languages
    }
  }
}`
const mutStudent = `mutation updateLanguage($languages: [Language!]) {
  meUpdate(update: { student: { languages: $languages } })
}`
const mutPupil = `mutation updateLanguage($languages: [Language!]) {
  meUpdate(update: { pupil: { languages: $languages } })
}`

type Props = {}

const ChangeSettingLanguage: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()

  const [selections, setSelections] = useState<string[]>([])

  const [showError, setShowError] = useState<boolean>()
  const { userType = 'pupil' } = useLernfair()

  const navigate = useNavigate()

  const { data, loading } = useQuery(gql`
    ${userType === 'student' ? queryStudent : queryPupil}
  `)

  const [updateLanguage, _updateLanguage] = useMutation(gql`
    ${userType === 'student' ? mutStudent : mutPupil}
  `)

  useEffect(() => {
    if (
      data?.me[userType || 'pupil'] &&
      data?.me[userType || 'pupil'].languages
    ) {
      setSelections(data?.me[userType || 'pupil'].languages)
    }
  }, [data?.me, userType])

  useEffect(() => {
    if (_updateLanguage.data && !_updateLanguage.error) {
      // setUserSettingChanged(true)
      navigate('/profile', { state: { showSuccessfulChangeAlert: true } })
    }
  }, [_updateLanguage.data, _updateLanguage.error, navigate])

  useEffect(() => {
    if (_updateLanguage.error) {
      setShowError(true)
    }
  }, [_updateLanguage.error])

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
      documentTitle: 'Profil Einstellungen – Sprache'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <CenterLoadingSpinner />

  return (
    <WithNavigation
      headerTitle={t('profile.FluentLanguagenalData.single.header')}
      showBack>
      <VStack
        paddingX={space['1.5']}
        space={space['1']}
        marginX="auto"
        width="100%"
        maxWidth={ContainerWidth}>
        <Heading>{t('profile.FluentLanguagenalData.single.title')}</Heading>
        <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
          <Row flexWrap="wrap" width="100%">
            {selections.map((language, index) => (
              <Column
                marginRight={3}
                marginBottom={3}
                key={`selection-${index}`}>
                <TouchableOpacity
                  onPress={() =>
                    setSelections(prev => {
                      const res = [...prev]
                      res.splice(index, 1)
                      return res
                    })
                  }>
                  <Row alignItems="center" justifyContent="center">
                    <IconTagList
                      isDisabled
                      iconPath={`languages/icon_${language.toLowerCase()}.svg`}
                      text={t(`lernfair.languages.${language.toLowerCase()}`)}
                    />
                    <Text color={'danger.500'} fontSize="xl" ml="1" bold>
                      x
                    </Text>
                  </Row>
                </TouchableOpacity>
              </Column>
            ))}
          </Row>
        </ProfileSettingItem>
      </VStack>
      <VStack
        paddingX={space['1.5']}
        space={space['1']}
        marginX="auto"
        width="100%"
        maxWidth={ContainerWidth}>
        <ProfileSettingRow
          title={t('profile.FluentLanguagenalData.single.others')}>
          <ProfileSettingItem
            border={false}
            isIcon={false}
            isHeaderspace={false}>
            <VStack w="100%">
              <Row flexWrap="wrap" width="100%">
                {languages.map(
                  (subject, index) =>
                    !selections.find(sel => sel === subject.key) && (
                      <Column
                        marginRight={3}
                        marginBottom={3}
                        key={`offers-${index}`}>
                        <IconTagList
                          iconPath={`languages/icon_${subject.key.toLowerCase()}.svg`}
                          text={subject.label}
                          onPress={() =>
                            setSelections(prev => [...prev, subject.key])
                          }
                        />
                      </Column>
                    )
                )}
              </Row>
              {selections.find(sel => sel === 'andere') && (
                <Row>
                  <FormControl>
                    <Stack>
                      <FormControl.Label>
                        <Text bold>
                          {t(
                            'profile.FluentLanguagenalData.single.optional.label'
                          )}
                        </Text>
                      </FormControl.Label>
                      <Input
                        type="text"
                        multiline
                        numberOfLines={3}
                        h={70}
                        placeholder={t(
                          'profile.FluentLanguagenalData.single.optional.placeholder'
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
            updateLanguage({ variables: { languages: selections } })
          }}>
          {t('profile.FluentLanguagenalData.single.button')}
        </Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSettingLanguage
