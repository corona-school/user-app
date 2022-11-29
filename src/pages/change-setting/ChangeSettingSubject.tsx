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
  Modal,
  useBreakpointValue,
  Box
} from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import WithNavigation from '../../components/WithNavigation'
import useLernfair from '../../hooks/useLernfair'
import {
  LFSubject,
  subjects,
  getSubjectKey
} from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'
import { Slider } from '@miblanchard/react-native-slider'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import { useNavigate } from 'react-router-dom'
import AlertMessage from '../../widgets/AlertMessage'

const queryPupil = `query {
  me {
    pupil {
      subjectsFormatted {
        name
      }
    }
  }
}`
const queryStudent = `query {
  me {
    student {
      subjectsFormatted {
        name
        grade {
          min
          max
        }
      }
    }
  }
}`
const mutPupil = `mutation updateSubjects($subjects: [SubjectInput!]) {
  meUpdate(update: { pupil: { subjects: $subjects } })
}`
const mutStudent = `mutation updateSubjects($subjects: [SubjectInput!]) {
  meUpdate(update: { student: { subjects: $subjects } })
}`

type Props = {}

const ChangeSettingSubject: React.FC<Props> = () => {
  const { space, sizes, colors } = useTheme()
  const { t } = useTranslation()
  const { userType = '' } = useLernfair()
  const { trackPageView } = useMatomo()
  const navigate = useNavigate()

  const [focusedSelection, setFocusedSelection] = useState<LFSubject>()
  const [showFocusSelection, setShowFocusSelection] = useState<boolean>()
  const [selections, setSelections] = useState<LFSubject[]>([])

  const [showError, setShowError] = useState<boolean>()
  const [selectedClassRange, setSelectedClassRange] = useState<number[]>([
    1, 13
  ])

  const { data, loading } = useQuery(gql`
    ${userType === 'student' ? queryStudent : queryPupil}
  `)

  const [updateSubjects, _updateSubjects] = useMutation(gql`
    ${userType === 'student' ? mutStudent : mutPupil}
  `)

  /**
   * remove unused / unwanted data
   * like TS __typename
   */
  const cleanupSubjects: (data: LFSubject[]) => LFSubject[] = useCallback(
    (data: LFSubject[]) => {
      const arr: LFSubject[] = []

      for (const sub of data) {
        delete sub['__typename']

        if (sub.grade) {
          delete sub.grade['__typename']
        }

        arr.push(sub)
      }

      return arr
    },
    []
  )

  useEffect(() => {
    if (!data) return
    if (userType && data.me && data?.me[userType].subjectsFormatted) {
      const s = cleanupSubjects(data?.me[userType].subjectsFormatted)
      setSelections(s)
    }
  }, [cleanupSubjects, data, userType])

  useEffect(() => {
    if (_updateSubjects.data && !_updateSubjects.error) {
      navigate('/profile', { state: { showSuccessfulChangeAlert: true } })
    }
  }, [_updateSubjects.data, _updateSubjects.error, navigate])

  useEffect(() => {
    if (_updateSubjects.error) {
      setShowError(true)
    }
  }, [_updateSubjects.error])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  useEffect(() => {
    trackPageView({
      documentTitle: 'Profil Einstellungen – Fächer'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <WithNavigation
        headerTitle={t('profile.NeedHelpIn.single.header')}
        showBack
        isLoading={loading}>
        <VStack
          paddingX={space['1.5']}
          space={space['1']}
          marginX="auto"
          width="100%"
          maxWidth={ContainerWidth}>
          <Heading>
            {userType === 'student'
              ? t('profile.subjects.single.title')
              : t('profile.NeedHelpIn.single.title')}
          </Heading>
          <ProfileSettingItem
            border={false}
            isIcon={false}
            isHeaderspace={false}>
            <Row flexWrap="wrap" width="100%">
              {selections.map((subject, index) => (
                <Column
                  marginRight={3}
                  marginBottom={3}
                  key={`selection-${index}`}>
                  <Row alignItems="center" justifyContent="center">
                    <TouchableOpacity
                      onPress={() => {
                        if (userType === 'student') {
                          setSelectedClassRange([
                            subject?.grade?.min || 1,
                            subject?.grade?.max || 13
                          ])
                          setFocusedSelection({ name: subject.name })
                          setShowFocusSelection(true)
                        } else {
                          if (!selections.find(s => s.name === subject.name)) {
                            setSelections(prev => [
                              ...prev,
                              { name: subject.name }
                            ])
                          }
                        }
                      }}>
                      <IconTagList
                        isDisabled
                        initial={false}
                        iconPath={`subjects/icon_${getSubjectKey(
                          subject?.name
                        )}.svg`}
                        text={
                          t(
                            `lernfair.subjects.${getSubjectKey(subject?.name)}`
                          ) +
                          ` ${
                            (userType === 'student' &&
                              `${subject?.grade?.min}. - ${subject?.grade?.max}. Klasse`) ||
                            ''
                          }`
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        setSelections(prev => {
                          const res = [...prev]
                          res.splice(index, 1)
                          return res
                        })
                      }>
                      <Box ml="2">
                        <Text color={'danger.500'} fontSize="xl" ml="1" bold>
                          x
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  </Row>
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
          <ProfileSettingRow title={t('profile.NeedHelpIn.single.others')}>
            <ProfileSettingItem
              border={false}
              isIcon={false}
              isHeaderspace={false}>
              <VStack w="100%">
                <Row flexWrap="wrap" width="100%">
                  {subjects.map(
                    (subject, index) =>
                      !selections.find(sel => sel.name === subject.label) && (
                        <Column
                          marginRight={3}
                          marginBottom={3}
                          key={`offers-${index}`}>
                          <IconTagList
                            initial={false}
                            iconPath={`subjects/icon_${subject.key}.svg`}
                            text={t(`lernfair.subjects.${subject.key}`)}
                            onPress={() => {
                              if (userType === 'student') {
                                setFocusedSelection({ name: subject.label })
                                setShowFocusSelection(true)
                              } else {
                                if (
                                  !selections.find(
                                    s => s.name === subject.label
                                  )
                                ) {
                                  setSelections(prev => [
                                    ...prev,
                                    { name: subject.label }
                                  ])
                                }
                              }
                            }}
                          />
                        </Column>
                      )
                  )}
                </Row>
                {selections.find(sel => sel.name === 'andere') && (
                  <Row>
                    <FormControl>
                      <Stack>
                        <FormControl.Label>
                          <Text bold>
                            {t('profile.NeedHelpIn.single.optional.label')}
                          </Text>
                        </FormControl.Label>
                        <Input
                          type="text"
                          multiline
                          numberOfLines={3}
                          h={70}
                          placeholder={t(
                            'profile.NeedHelpIn.single.optional.placeholder'
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
          width="100%"
          marginX="auto"
          maxWidth={ContainerWidth}>
          {showError && <AlertMessage content={t('profile.errormessage')} />}

          <Button
            width={ButtonContainer}
            onPress={() => {
              updateSubjects({
                variables: {
                  subjects: selections
                }
              })
            }}>
            {t('profile.NeedHelpIn.single.button')}
          </Button>
        </VStack>
      </WithNavigation>
      <Modal
        isOpen={showFocusSelection}
        onClose={() => setShowFocusSelection(false)}>
        <Modal.Content>
          <Modal.Header>
            <Heading>
              {t('registration.student.classSelection.title')}
              <Modal.CloseButton />
            </Heading>
          </Modal.Header>
          <Modal.Body>
            <Heading fontSize="md">
              Klassen {selectedClassRange[0] || 1} -{' '}
              {selectedClassRange[1] || 13}
            </Heading>
            <Slider
              animateTransitions
              minimumValue={1}
              maximumValue={13}
              minimumTrackTintColor={colors['primary']['500']}
              thumbTintColor={colors['primary']['900']}
              value={selectedClassRange}
              step={1}
              onValueChange={(value: number | number[]) => {
                Array.isArray(value) && setSelectedClassRange(value)
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                const item = (focusedSelection && { ...focusedSelection }) || {
                  name: ''
                }

                item.grade = {
                  min: selectedClassRange[0],
                  max: selectedClassRange[1]
                }

                const find = selections.findIndex(
                  sel => sel.name === focusedSelection?.name
                )

                if (find > -1) {
                  const sel = [...selections]
                  sel[find] = item
                  setSelections(sel)
                } else {
                  item.name && setSelections(prev => [...prev, item])
                }

                setFocusedSelection({ name: '' })
                setShowFocusSelection(false)
              }}>
              {t('registration.student.classSelection.btn')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default ChangeSettingSubject
