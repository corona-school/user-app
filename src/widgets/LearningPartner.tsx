import { View, Text, Row, Box, Avatar, useTheme } from 'native-base'
import { ReactNode } from 'react'
import Card from '../components/Card'
import Tag from '../components/Tag'
import { LFSubject } from '../types/lernfair/Subject'
import ProfilAvatar from './ProfilAvatar'

type Props = {
  avatar?: string
  name: string
  subjects: LFSubject[]
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
          {avatar && (
            <Box marginRight={space['1.5']}>
              {/* <ProfilAvatar image={avatar} size="lg" /> */}
            </Box>
          )}
          <Box flex="1">
            {name && (
              <Text
                bold
                fontSize={'md'}
                color={isDark ? 'lightText' : 'primary.900'}>
                {name}
              </Text>
            )}

            {subjects && (
              <Row flexWrap={'wrap'} space="5px" alignItems="center">
                <Text color="lightText" marginBottom={space['0.5']}>
                  Fächer:
                </Text>
                {subjects.map((sub: LFSubject) => (
                  <Tag text={sub.name} variant="secondary" />
                ))}
              </Row>
            )}

            {schooltype && (
              <Text color={isDark ? 'lightText' : 'primary.900'}>
                Schulform: {schooltype}
              </Text>
            )}

            {schoolclass && (
              <Text color={isDark ? 'lightText' : 'primary.900'}>
                Klasse: {(schoolclass as any).UNKNOWN.DEREF}
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
