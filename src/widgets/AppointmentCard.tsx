import { View, Text, Row, useTheme, Box, Avatar } from 'native-base'
import Card from '../components/Card'
import Tag from '../components/Tag'
import CommunityUser from './CommunityUser'

type Props = {
  tags: string[]
  date: Date
  title: string
  child: string
}

const AppointmentCard: React.FC<Props> = ({ tags, date, title, child }) => {
  const { space } = useTheme()

  return (
    <Card>
      <Box bg="gray.500" h="120" padding={space['0.5']}>
        <Row space={space['0.5']}>
          {tags.map(t => (
            <Tag text={t} />
          ))}
        </Row>
      </Box>
      <Box padding={space['0.5']}>
        <Row paddingTop={space['1']} space={1}>
          <Text>{date.toLocaleDateString()}</Text>
          <Text>•</Text>
          <Text>{date.toLocaleTimeString().slice(0, -3)}</Text>
        </Row>
        <Text bold fontSize={'md'}>
          {title}
        </Text>
        {child && <CommunityUser name={child} />}
      </Box>
    </Card>
  )
}
export default AppointmentCard
