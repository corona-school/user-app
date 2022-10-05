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
import { languages } from '../../types/lernfair/Language'
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
const mutStudent = `mutation updateLanguage($languages: [String!]) {
  meUpdate(update: { student: { languages: $languages } })
}`
const mutPupil = `mutation updateLanguage($languages: [String!]) {
  meUpdate(update: { pupil: { languages: $languages } })
}`

type Props = {}

const ChangeSettingLanguage: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()

  const location = useLocation()
  const { state } = location as { state: { userType: string } }

  const [selections, setSelections] = useState<string[]>([])

  const { data, error, loading } = useQuery(gql`
    ${state?.userType === ' student' ? queryStudent : queryPupil}
  `)

  const [updateLanguage, _updateLanguage] = useMutation(gql`
    ${state?.userType === ' student' ? mutStudent : mutPupil}
  `)

  useEffect(() => {
    if (data?.me?.pupil?.languages) {
      setSelections(data?.me?.pupil?.languages)
    }
  }, [data?.me?.pupil?.languages])

  if (loading) return <></>
  return (
    <WithNavigation
      headerTitle={t('profile.FluentLanguagenalData.single.header')}
      headerLeft={<BackButton />}>
      <VStack paddingX={space['1.5']} space={space['1']}>
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
                      iconPath={`languages/icon_${language}.svg`}
                      text={t(`lernfair.languages.${language}`)}
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
                          iconPath={`languages/icon_${subject.key}.svg`}
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
      <VStack paddingX={space['1.5']} paddingBottom={space['1.5']}>
        <Button
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
