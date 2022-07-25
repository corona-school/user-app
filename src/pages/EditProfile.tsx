import { View, Text, VStack, Heading, Avatar, useTheme, Box } from 'native-base'
import NavigationDataRow from '../widgets/NavigationDataRow'

type Props = {}

const EditProfile: React.FC<Props> = () => {
  const { colors, space } = useTheme()

  return (
    <VStack space={space['2']}>
      <VStack
        space={space['1']}
        bg={'gray.500'}
        alignItems="center"
        paddingY={space['2']}
        borderBottomRadius={16}>
        <Avatar size="xl" />
        <Text color={colors.white} fontWeight={'thin'}>
          Profilbild ändern
        </Text>
      </VStack>
      <VStack space={space['0.5']} paddingX={space['1']}>
        <NavigationDataRow
          label="Namen ändern"
          value="Rainer Zufall"
          onPress={() => alert('test')}
        />
        <NavigationDataRow label="Schulform ändern" />
        <NavigationDataRow label="Klasse ändern" value="6, 7, 8" />
        <NavigationDataRow label="Geburtsdatum ändern" />
        <NavigationDataRow label="Fächer ändern" value="Englisch, Informatik" />
        <NavigationDataRow label="Art der Unterstützung:" value="1:1, Gruppe" />
        <NavigationDataRow label="Verfügbarkeit verwalten" />
      </VStack>
    </VStack>
  )
}
export default EditProfile
