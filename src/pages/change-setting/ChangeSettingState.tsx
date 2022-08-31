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
type State = {
  key: string
  label: string
}
const ChangeSettingState: React.FC<Props> = () => {
  const { space } = useTheme()

  const states: State[] = [
    { key: 'baden-wuerttemberg', label: 'Baden-Württemberg' },
    { key: 'bayern', label: 'Bayern' },
    { key: 'berlin', label: 'Berlin' },
    { key: 'brandenburg', label: 'Brandenburg' },
    { key: 'bremen', label: 'Bremen' },
    { key: 'hamburg', label: 'Hamburg' },
    { key: 'hessen', label: 'Hessen' },
    { key: 'mecklenburg-vorpommern', label: 'Mecklenburg-Vorpommern' },
    { key: 'niedersachsen', label: 'Niedersachsen' },
    { key: 'nordrhein-westfalen', label: 'Nordrhein-Westfalen' },
    { key: 'rheinland-pfalz', label: 'Rheinland-Pfalz' },
    { key: 'saarland', label: 'Saarland' },
    { key: 'sachsen', label: 'Sachsen' },
    { key: 'sachsen-anhalt', label: 'Sachsen-Anhalt' },
    { key: 'schleswig-holstein', label: 'Schleswig-Holstein' },
    { key: 'thueringen', label: 'Thüringen' }
  ]

  const [selections, setSelections] = useState<State[]>([])
  const { t } = useTranslation()

  return (
    <WithNavigation
      headerTitle={t('profile.State.single.header')}
      headerLeft={<BackButton />}
      headerRight={<NotificationAlert />}>
      <VStack
        paddingTop={space['4']}
        paddingX={space['1.5']}
        space={space['1']}>
        <Heading>{t('profile.State.single.title')}</Heading>
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
                      iconPath={`states/icon_bundesland_${subject.key}.svg`}
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
        <ProfileSettingRow title={t('profile.State.single.others')}>
          <ProfileSettingItem
            border={false}
            isIcon={false}
            isHeaderspace={false}>
            <VStack w="100%">
              <Row flexWrap="wrap" width="100%">
                {states.map(
                  (subject, index) =>
                    !selections.find(sel => sel.key === subject.key) && (
                      <Column
                        marginRight={3}
                        marginBottom={3}
                        key={`offers-${index}`}>
                        <IconTagList
                          iconPath={`states/icon_bundesland_${subject.key}.svg`}
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
      <VStack paddingX={space['1.5']} paddingBottom={space['1.5']}>
        <Button>{t('profile.State.single.button')}</Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSettingState
