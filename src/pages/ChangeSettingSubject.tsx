import {
  Button,
  Box,
  Text,
  Heading,
  useTheme,
  VStack,
  Row,
  ThreeDotsIcon,
  Link,
  Column,
  AddIcon,
  ArrowBackIcon,
  Badge,
  DeleteIcon
} from 'native-base'
import { useState } from 'react'
import WithNavigation from '../components/WithNavigation'
import CTACard from '../widgets/CTACard'
import IconTagList from '../widgets/IconTagList'
import ProfilAvatar from '../widgets/ProfilAvatar'
import ProfileSettingItem from '../widgets/ProfileSettingItem'
import ProfileSettingRow from '../widgets/ProfileSettingRow'
import SimpleDataRow from '../widgets/SimpleDataRow'
import SubjectTag from '../widgets/SubjectTag'
import UserAchievements from '../widgets/UserAchievements'
import UserProgress from '../widgets/UserProgress'

type Props = {}

const ChangeSetting: React.FC<Props> = () => {
  const { colors, space } = useTheme()

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
    'Deutsch als Zweitsprache'
  ]

  const [selections, setSelections] = useState<string[]>([])

  return (
    <WithNavigation
      headerTitle="Fächer ändern"
      headerLeft={<ArrowBackIcon size="xl" color="lightText" />}
      headerRight={
        <Box>
          <Badge
            bgColor={'danger.500'}
            rounded="3xl"
            zIndex={1}
            variant="solid"
            alignSelf="flex-end"
            top="2"
            right="-5">
            {' '}
          </Badge>
          <DeleteIcon color="lightText" size="xl" />
        </Box>
      }>
      <VStack
        paddingTop={space['4']}
        paddingX={space['1.5']}
        space={space['1']}>
        <Heading>Fächer, in denen ich mir Hilfe wünsche</Heading>
        <ProfileSettingItem border={false} isIcon={false} isHeaderspace={false}>
          <Row flexWrap="wrap" width="100%">
            {selections.map((subject, index) => (
              <Column marginRight={3} marginBottom={3}>
                <IconTagList
                  icon="h"
                  text={subject}
                  onPress={() =>
                    setSelections(prev => {
                      const res = [...prev]
                      res.splice(index, 1)
                      return res
                    })
                  }
                />
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
            <Row flexWrap="wrap" width="100%">
              {subjects.map(
                subject =>
                  !selections.includes(subject) && (
                    <Column marginRight={3} marginBottom={3}>
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
          </ProfileSettingItem>
        </ProfileSettingRow>
      </VStack>
      <VStack paddingX={space['1.5']} paddingBottom={space['1.5']}>
        <Button>Speichern</Button>
      </VStack>
    </WithNavigation>
  )
}
export default ChangeSetting
