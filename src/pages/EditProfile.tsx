import { View, Text, VStack, Heading, Avatar, useTheme, Box } from 'native-base'
import EditDataRow from '../widgets/EditDataRow'

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
        <EditDataRow
          label="Namen ändern"
          value="Rainer Zufall"
          onPress={() => alert('test')}
        />
        <EditDataRow label="Schulform ändern" />
        <EditDataRow label="Klasse ändern" value="6, 7, 8" />
        <EditDataRow label="Geburtsdatum ändern" />
        <EditDataRow label="Fächer ändern" value="Englisch, Informatik" />
        <EditDataRow label="Art der Unterstützung:" value="1:1, Gruppe" />
        <EditDataRow label="Verfügbarkeit verwalten" />
      </VStack>
    </VStack>
  )
}
export default EditProfile
