import { View, Text, Row, Box, Avatar, useTheme } from 'native-base'
import { ReactNode } from 'react'
import Card from '../components/Card'
import ProfilAvatar from './ProfilAvatar'

type Props = {
  avatar?: string
  name: string
  subjects: string[]
  schooltype: string
  schoolclass: number
  isDark?: boolean
  button?: ReactNode
}

const LearningPartner: React.FC<Props> = ({
  avatar,
  name,
  subjects,
  schooltype,
  schoolclass,
  isDark = false,
  button
}) => {
  const { space } = useTheme()

  return (
    <View marginBottom={space['0.5']}>
      <Card
        flexibleWidth
        variant={isDark ? 'dark' : 'normal'}
        padding={space['0.5']}>
        <Row padding={space['1']}>
          <Box marginRight={space['1.5']}>
            <ProfilAvatar image={avatar} size="lg" />
          </Box>
          <Box>
            {name && (
              <Text
                bold
                fontSize={'md'}
                color={isDark ? 'lightText' : 'primary.900'}>
                {name}
              </Text>
            )}

            {subjects && (
              <Text color={isDark ? 'lightText' : 'primary.900'}>
                Fach: {subjects.join(', ')}
              </Text>
            )}

            {schooltype && (
              <Text color={isDark ? 'lightText' : 'primary.900'}>
                Schulform: {schooltype}
              </Text>
            )}

            {schoolclass && (
              <Text color={isDark ? 'lightText' : 'primary.900'}>
                Klasse: {schoolclass}
              </Text>
            )}
          </Box>
        </Row>
        {button && (
          <Row flexDirection="column" padding={space['1']}>
            {button}
          </Row>
        )}
      </Card>
    </View>
  )
}
export default LearningPartner
