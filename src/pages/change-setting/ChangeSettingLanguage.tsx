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
import IconTagList from '../../widgets/IconTagList'
import ProfileSettingItem from '../../widgets/ProfileSettingItem'
import ProfileSettingRow from '../../widgets/ProfileSettingRow'

type Props = {}

type Language = {
  key: string
  label: string
}

const ChangeSettingLanguage: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()

  const languages: Language[] = [
    {
      key: 'albanisch',
      label: 'Albanisch'
    },
    {
      key: 'arabisch',
      label: 'Arabisch'
    },
    {
      key: 'armenisch',
      label: 'Armenisch'
    },
    {
      key: 'aserbaidschanisch',
      label: 'Aserbaidschanisch'
    },
    {
      key: 'bosnisch',
      label: 'Bosnisch'
    },
    {
      key: 'bulgarisch',
      label: 'Bulgarisch'
    },
    {
      key: 'chinesisch',
      label: 'Chinesisch'
    },
    {
      key: 'deutsch',
      label: 'Deutsch'
    },
    {
      key: 'englisch',
      label: 'Englisch'
    },
    {
      key: 'franzoesisch',
      label: 'Französisch'
    },
    {
      key: 'italienisch',
      label: 'Italienisch'
    },
    {
      key: 'kasachisch',
      label: 'Kasachisch'
    },
    {
      key: 'kurdisch',
      label: 'Kurdisch'
    },
    {
      key: 'polnisch',
      label: 'Polnisch'
    },
    {
      key: 'portugiesisch',
      label: 'Portugiesisch'
    },
    {
      key: 'russisch',
      label: 'Russisch'
    },
    {
      key: 'spanisch',
      label: 'Spanisch'
    },
    {
      key: 'tuerkisch',
      label: 'Türkisch'
    },
    {
      key: 'ukrainisch',
      label: 'Ukrainisch'
    },
    {
      key: 'vietnamesisch',
      label: 'Vietnamesisch'
    },
    {
      key: 'andere',
      label: 'Andere'
    }
  ]

  const [selections, setSelections] = useState<Language[]>([])

  return (
    <WithNavigation
      headerTitle={t('profile.FluentLanguagenalData.single.header')}
      headerLeft={<BackButton />}
      headerRight={<NotificationAlert />}>
      <VStack
        paddingTop={space['4']}
        paddingX={space['1.5']}
        space={space['1']}>
        <Heading>{t('profile.FluentLanguagenalData.single.title')}</Heading>
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
                      iconPath={`languages/icon_${subject.key}.svg`}
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
                    !selections.find(sel => sel.key === subject.key) && (
                      <Column
                        marginRight={3}
                        marginBottom={3}
                        key={`offers-${index}`}>
                        <IconTagList
                          iconPath={`languages/icon_${subject.key}.svg`}
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
        <Button>{t('profile.FluentLanguagenalData.single.button')}</Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSettingLanguage
