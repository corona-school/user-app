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
import { useLocation } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import WithNavigation from '../../components/WithNavigation'
import { schooltypes } from '../../types/lernfair/SchoolType'
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
const mutStudent = `mutation updateSchooltype($schooltype: String!) {
  meUpdate(update: { student: { schooltype: $schooltype } })
}`
const mutPupil = `mutation updateSchooltype($schooltype: String!) {
  meUpdate(update: { pupil: { schooltype: $schooltype } })
}`

type Props = {}

const ChangeSettingSchoolType: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()

  const location = useLocation()
  const { state } = location as { state: { userType: string } }

  const { data, error, loading } = useQuery(gql`
    ${state?.userType === ' student' ? queryStudent : queryPupil}
  `)

  const [updateSchooltype, _updateSchooltype] = useMutation(gql`
    ${state?.userType === ' student' ? mutStudent : mutPupil}
  `)

  const [selections, setSelections] = useState<string>('')

  useEffect(() => {
    setSelections(data?.me?.pupil?.schooltype)
  }, [data?.me?.pupil?.schooltype])

  if (loading) return <></>

  return (
    <WithNavigation
      headerTitle={t('profile.SchoolType.single.header')}
      headerLeft={<BackButton />}>
      <VStack paddingX={space['1.5']} space={space['1']}>
        <Heading>{t('profile.SchoolType.single.title')}</Heading>
        <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
          <Row flexWrap="wrap" width="100%">
            <Column marginRight={3} marginBottom={3}>
              <IconTagList
                isDisabled
                iconPath={`schooltypes/icon_${
                  selections === 'hauptschule' ? 'realschule' : selections
                }.svg`}
                text={t(`lernfair.schooltypes.${data?.me?.pupil?.schooltype}`)}
              />
            </Column>
          </Row>
        </ProfileSettingItem>
      </VStack>
      <VStack paddingX={space['1.5']} space={space['1']}>
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
      <VStack paddingX={space['1.5']} paddingBottom={space['1.5']}>
        <Button
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
