import { View, Text, Row, Box, Avatar, useTheme } from 'native-base'
import { ReactNode } from 'react'
import Card from '../components/Card'
import ProfilAvatar from './ProfilAvatar'

type Props = {
  avatar?: string
  name: string
  fach: string[]
  schulform: string
  klasse: number
  isDark?: boolean
  button?: ReactNode
}

const LearningPartner: React.FC<Props> = ({
  avatar,
  name,
  fach,
  schulform,
  klasse,
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

            {fach && (
              <Text color={isDark ? 'lightText' : 'primary.900'}>
                Fach: {fach.join(', ')}
              </Text>
            )}

            {schulform && (
              <Text color={isDark ? 'lightText' : 'primary.900'}>
                Schulform: {schulform}
              </Text>
            )}

            {klasse && (
              <Text color={isDark ? 'lightText' : 'primary.900'}>
                Klasse: {klasse}
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
