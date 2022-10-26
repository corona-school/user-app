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
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import WithNavigation from '../../components/WithNavigation'
import useLernfair from '../../hooks/useLernfair'
import { states } from '../../types/lernfair/State'
import IconTagList from '../../widgets/IconTagList'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

const queryPupil = `query {
  me {
    pupil {
      state
    }
  }
}`
const queryStudent = `query {
  me {
    student {
      state
    }
  }
}`

const mutStudent = `mutation updateState($state: StudentState!) {
  meUpdate(update: { student: { state: $state } })
}`
const mutPupil = `mutation updateState($state: State!) {
  meUpdate(update: { pupil: { state: $state } })
}`

type Props = {}

const ChangeSettingState: React.FC<Props> = () => {
  const { space, sizes } = useTheme()

  const [userState, setUserState] = useState<string>('')
  const { t } = useTranslation()

  const [userSettingChanged, setUserSettingChanged] = useState<boolean>()
  const [showError, setShowError] = useState<boolean>()

  const { userType } = useLernfair()
  const { data, loading, error } = useQuery(gql`
    ${userType === 'student' ? queryStudent : queryPupil}
  `)

  const [updateState, _updateState] = useMutation(gql`
    ${userType === 'student' ? mutStudent : mutPupil}
  `)

  useEffect(() => {
    if (userType && data?.me[userType].state) {
      setUserState(data?.me[userType].state)
    }
  }, [data?.me, userType])

  const state = useMemo(
    () =>
      states.find(state => state.key === userState) || {
        key: '',
        label: ''
      },
    [userState]
  )

  useEffect(() => {
    if (_updateState.data && !_updateState.error) {
      setUserSettingChanged(true)
    }
  }, [_updateState.data, _updateState.error])

  useEffect(() => {
    if (_updateState.error) {
      setShowError(true)
    }
  }, [_updateState.error])

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
  }, [])
  console.log({ userState })
  if (loading) <></>

  return (
    <WithNavigation
      headerTitle={t('profile.State.single.header')}
      headerLeft={<BackButton />}>
      <VStack paddingX={space['1.5']} space={space['1']} width={ContainerWidth}>
        <Heading>{t('profile.State.single.title')}</Heading>
        <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
          <Row flexWrap="wrap" width="100%">
            {userState && (
              <Column marginRight={3} marginBottom={3}>
                <IconTagList
                  isDisabled
                  iconPath={`states/icon_${state.key}.svg`}
                  text={state?.label}
                />
              </Column>
            )}
          </Row>
        </ProfileSettingItem>
      </VStack>
      <VStack paddingX={space['1.5']} space={space['1']} width={ContainerWidth}>
        <ProfileSettingRow title={t('profile.State.single.others')}>
          <ProfileSettingItem
            border={false}
            isIcon={false}
            isHeaderspace={false}>
            <VStack w="100%">
              <Row flexWrap="wrap" width="100%">
                {states.map(
                  (s, index) =>
                    state.key !== s.key && (
                      <Column
                        marginRight={3}
                        marginBottom={3}
                        key={`offers-${index}`}>
                        <IconTagList
                          iconPath={`states/icon_${s.key}.svg`}
                          text={s.label}
                          onPress={() => setUserState(s.key)}
                        />
                      </Column>
                    )
                )}
              </Row>
              {userState === 'andere' && (
                <Row>
                  <FormControl>
                    <Stack>
                      <FormControl.Label>
                        <Text bold>
                          {t('profile.State.single.option.label')}
                        </Text>
                      </FormControl.Label>
                      <Input
                        type="text"
                        multiline
                        numberOfLines={3}
                        h={70}
                        placeholder={t(
                          'profile.State.single.optional.placeholder'
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
        width={ContainerWidth}>
        {userSettingChanged && (
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
        )}
        {showError && (
          <Alert marginY={3} bgColor="danger.500">
            <VStack space={2} flexShrink={1} w="100%">
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between">
                <HStack space={2} flexShrink={1} alignItems="center">
                  <Alert.Icon color={'lightText'} />
                  <Text color="lightText">{t('profile.errormessage')}</Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        )}
        <Button
          width={ButtonContainer}
          onPress={() => {
            updateState({ variables: { state: state.key } })
          }}>
          {t('profile.State.single.button')}
        </Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSettingState
