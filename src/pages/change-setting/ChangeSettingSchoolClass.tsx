import { gql, useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Text,
  Heading,
  useTheme,
  VStack,
  Row,
  Column
} from 'native-base'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import BackButton from '../../components/BackButton'

import WithNavigation from '../../components/WithNavigation'
import IconTagList from '../../widgets/IconTagList'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

type Props = {}

const ChangeSettingSchoolClass: React.FC<Props> = () => {
  const { space } = useTheme()

  const { t } = useTranslation()

  const { data, error, loading } = useQuery(gql`
    query {
      me {
        pupil {
          schooltype
          gradeAsInt
        }
      }
    }
  `)

  const [updateSchoolGrade, _updateSchoolGrade] = useMutation(gql`
    mutation updateSchoolGrade($grade: Int!) {
      meUpdate(update: { pupil: { gradeAsInt: $grade } })
    }
  `)

  const schoolGrades = useMemo(() => {
    if (!data?.me?.pupil?.schooltype) {
      return new Array(8).fill(0).map((_, i) => i + 5)
    }

    if (data?.me?.pupil?.schooltype === 'grundschule') {
      return new Array(4).fill(0).map((_, i) => i + 1)
    } else if (data?.me?.pupil?.schooltype === 'gymnasium') {
      return new Array(8).fill(0).map((_, i) => i + 5)
    } else {
      return new Array(6).fill(0).map((_, i) => i + 5)
    }
  }, [data?.me?.pupil?.schooltype])

  const [selectedGrade, setSelectedGrade] = useState<number>(1)

  useEffect(() => {
    if (data?.me?.pupil?.gradeAsInt) {
      setSelectedGrade(data?.me?.pupil?.gradeAsInt)
    }
  }, [data?.me?.pupil?.gradeAsInt])

  if (loading) return <></>

  return (
    <WithNavigation
      headerTitle={t('profile.SchoolClass.single.header')}
      headerLeft={<BackButton />}>
      <VStack
        paddingTop={space['4']}
        paddingX={space['1.5']}
        space={space['1']}>
        <Heading>{t('profile.SchoolClass.single.title')}</Heading>
        <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
          <Row flexWrap="wrap" width="100%">
            <Column
              marginRight={3}
              marginBottom={3}
              key={`selection-${selectedGrade}`}>
              <IconTagList
                isDisabled
                textIcon={`${selectedGrade}`}
                text={t('lernfair.schoolclass', {
                  class: selectedGrade
                })}
              />
            </Column>
          </Row>
        </ProfileSettingItem>
      </VStack>
      <VStack paddingX={space['1.5']} space={space['1']}>
        <ProfileSettingRow title={t('profile.SchoolClass.single.others')}>
          <ProfileSettingItem
            border={false}
            isIcon={false}
            isHeaderspace={false}>
            <VStack w="100%">
              <Row flexWrap="wrap" width="100%">
                {schoolGrades.map(
                  (subject, index) =>
                    selectedGrade !== subject && (
                      <Column
                        marginRight={3}
                        marginBottom={3}
                        key={`offers-${index}`}>
                        <IconTagList
                          textIcon={`${subject}`}
                          text={t('lernfair.schoolclass', {
                            class: subject
                          })}
                          onPress={() => setSelectedGrade(subject)}
                        />
                      </Column>
                    )
                )}
              </Row>
              {/* {selections.includes('Andere') && (
                <Row>
                  <FormControl>
                    <Stack>
                      <FormControl.Label>
                        <Text bold>
                          {t('profile.SchoolClass.single.optional.label')}
                        </Text>
                      </FormControl.Label>
                      <Input
                        type="text"
                        multiline
                        numberOfLines={3}
                        h={70}
                        placeholder={t(
                          'profile.SchoolClass.single.optional.placeholder'
                        )}
                      />
                    </Stack>
                  </FormControl>
                </Row>
              )} */}
            </VStack>
          </ProfileSettingItem>
        </ProfileSettingRow>
      </VStack>
      <VStack paddingX={space['1.5']} paddingBottom={space['1.5']}>
        <Button
          isDisabled
          onPress={() =>
            updateSchoolGrade({ variables: { grade: selectedGrade } })
          }>
          {t('profile.SchoolClass.single.button')}
        </Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSettingSchoolClass
