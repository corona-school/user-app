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
import { TouchableOpacity } from 'react-native'
import BackButton from '../components/BackButton'
import NotificationAlert from '../components/NotificationAlert'
import WithNavigation from '../components/WithNavigation'
import IconTagList from '../widgets/IconTagList'
import ProfileSettingItem from '../widgets/ProfileSettingItem'
import ProfileSettingRow from '../widgets/ProfileSettingRow'

type Props = {}

const ChangeSettingSubject: React.FC<Props> = () => {
  const { space } = useTheme()

  const subjects = [
    'Mathematik',
    'Deutsch',
    'Englisch',
    'Biologie',
    'Chemie',
    'Physik',
    'Informatik',
    'Sachkunde',
    'Geschichte',
    'Erdkunde',
    'Wirtschaft',
    'Politik',
    'Philosophie',
    'Kunst',
    'Musik',
    'Pädagogik',
    'Französisch',
    'Latein',
    'Altgriechisch',
    'Spanisch',
    'Italienisch',
    'Russisch',
    'Niederländisch',
    'Deutsch als Zweitsprache',
    'Andere'
  ]

  const [selections, setSelections] = useState<string[]>([])

  return (
    <WithNavigation
      headerTitle="Fächer ändern"
      headerLeft={<BackButton />}
      headerRight={<NotificationAlert />}>
      <VStack
        paddingTop={space['4']}
        paddingX={space['1.5']}
        space={space['1']}>
        <Heading>Fächer, in denen ich mir Hilfe wünsche</Heading>
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
                    <IconTagList icon="h" text={subject} />
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
        <ProfileSettingRow title="Weitere Fächer wählen">
          <ProfileSettingItem
            border={false}
            isIcon={false}
            isHeaderspace={false}>
            <VStack w="100%">
              <Row flexWrap="wrap" width="100%">
                {subjects.map(
                  (subject, index) =>
                    !selections.includes(subject) && (
                      <Column
                        marginRight={3}
                        marginBottom={3}
                        key={`offers-${index}`}>
                        <IconTagList
                          icon="h"
                          text={subject}
                          onPress={() =>
                            setSelections(prev => [...prev, subject])
                          }
                        />
                      </Column>
                    )
                )}
              </Row>
              {selections.includes('Andere') && (
                <Row>
                  <FormControl>
                    <Stack>
                      <FormControl.Label>
                        <Text bold>Anderes Fach</Text>
                      </FormControl.Label>
                      <Input
                        type="text"
                        multiline
                        numberOfLines={3}
                        h={70}
                        placeholder="Welche Fächer möchtest du wählen?"
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
        <Button>Speichern</Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSettingSubject
