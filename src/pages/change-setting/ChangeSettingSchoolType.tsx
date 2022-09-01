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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import BackButton from '../../components/BackButton'
import NotificationAlert from '../../components/NotificationAlert'
import WithNavigation from '../../components/WithNavigation'
import { SchoolType } from '../../types/lernfair/SchoolType'
import IconTagList from '../../widgets/IconTagList'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

type Props = {}

const ChangeSettingSchoolType: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()

  const schooltypes: SchoolType[] = [
    { label: 'Grundschule', key: 'grundschule' },
    { label: 'Hauptschule', key: 'hauptschule' },
    { label: 'Realschule', key: 'realschule' },
    { label: 'Gymnasium', key: 'gymnasium' },
    { label: 'Andere', key: 'andere' }
  ]

  const [selections, setSelections] = useState<SchoolType[]>([])

  return (
    <WithNavigation
      headerTitle={t('profile.SchoolType.single.header')}
      headerLeft={<BackButton />}
      headerRight={<NotificationAlert />}>
      <VStack
        paddingTop={space['4']}
        paddingX={space['1.5']}
        space={space['1']}>
        <Heading>{t('profile.SchoolType.single.title')}</Heading>
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
                      iconPath={`schooltypes/icon_${
                        subject.key === 'hauptschule'
                          ? 'realschule'
                          : subject.key
                      }.svg`}
                      text={subject.label}
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
        <ProfileSettingRow title={t('profile.SchoolType.single.others')}>
          <ProfileSettingItem
            border={false}
            isIcon={false}
            isHeaderspace={false}>
            <VStack w="100%">
              <Row flexWrap="wrap" width="100%">
                {schooltypes.map(
                  (subject, index) =>
                    !selections.find(sel => sel.key === subject.key) && (
                      <Column
                        marginRight={3}
                        marginBottom={3}
                        key={`offers-${index}`}>
                        <IconTagList
                          iconPath={`schooltypes/icon_${
                            subject.key === 'hauptschule'
                              ? 'realschule'
                              : subject.key
                          }.svg`}
                          text={subject.label}
                          onPress={() =>
                            setSelections(prev => [...prev, subject])
                          }
                        />
                      </Column>
                    )
                )}
              </Row>
              {selections.find(sel => sel.key === 'andere') && (
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
        <Button>{t('profile.SchoolType.single.button')}</Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSettingSchoolType
