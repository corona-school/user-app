import { gql, useMutation, useQuery } from '@apollo/client'
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
  Stack
} from 'native-base'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { useLocation } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import WithNavigation from '../../components/WithNavigation'
import { subjects } from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

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
      }
    }
  }
}`
const mutPupil = `mutation updateSubjects($subjects: [String!]) {
  meUpdate(update: { pupil: { subjects: $subjects } })
}`
const mutStudent = `mutation updateSubjects($subjects: [String!]) {
  meUpdate(update: { student: { subjects: $subjects } })
}`

type Props = {}

const ChangeSettingSubject: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const location = useLocation()
  const { state } = location as { state: { userType: string } }

  const [selections, setSelections] = useState<string[]>([])

  const { data, error, loading } = useQuery(gql`
    ${state?.userType === ' student' ? queryStudent : queryPupil}
  `)

  const [updateSubjects, _updateSubjects] = useMutation(gql`
    ${state?.userType === ' student' ? mutStudent : mutPupil}
  `)

  useEffect(() => {
    if (data?.me?.pupil?.subjectsFormatted) {
      const s = data?.me?.pupil?.subjectsFormatted.map(
        (s: { name: string }) => s.name
      )
      setSelections(s)
    }
  }, [data?.me?.pupil?.subjectsFormatted])

  if (loading) return <></>

  return (
    <WithNavigation
      headerTitle={t('profile.NeedHelpIn.single.header')}
      headerLeft={<BackButton />}>
      <VStack
        paddingTop={space['4']}
        paddingX={space['1.5']}
        space={space['1']}>
        <Heading>{t('profile.NeedHelpIn.single.title')}</Heading>
        <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
          <Row flexWrap="wrap" width="100%">
            {selections.map((subject, index) => (
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
                      iconPath={`subjects/icon_${subject.toLowerCase()}.svg`}
                      text={t(`lernfair.subjects.${subject.toLowerCase()}`)}
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
      <VStack paddingX={space['1.5']} space={space['1']}>
        <ProfileSettingRow title={t('profile.NeedHelpIn.single.others')}>
          <ProfileSettingItem
            border={false}
            isIcon={false}
            isHeaderspace={false}>
            <VStack w="100%">
              <Row flexWrap="wrap" width="100%">
                {subjects.map(
                  (subject, index) =>
                    !selections.find(sel => sel === subject.key) && (
                      <Column
                        marginRight={3}
                        marginBottom={3}
                        key={`offers-${index}`}>
                        <IconTagList
                          iconPath={`subjects/icon_${subject.key}.svg`}
                          text={t(`lernfair.subjects.${subject.key}`)}
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
      <VStack paddingX={space['1.5']} paddingBottom={space['1.5']}>
        <Button
          onPress={() => {
            updateSubjects({
              variables: {
                selections
              }
            })
          }}>
          {t('profile.NeedHelpIn.single.button')}
        </Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSettingSubject
