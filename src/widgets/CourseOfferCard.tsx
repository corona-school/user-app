import { View, Text, Row, Box, VStack, useTheme } from 'native-base'
import Card from '../components/Card'
import Tag from '../components/Tag'

type Props = {
  title: string
  tags: string[]
  date: Date
}

const CourseOfferCard: React.FC<Props> = ({ title, tags, date }) => {
  const { space } = useTheme()

  return (
    <Card flexibleWidth>
      <Row>
        <Box w={100} bg={'primary.100'}></Box>
        <VStack
          paddingX={space['0.5']}
          paddingY={space['1']}
          flex="1"
          space={space['0.5']}>
          <Row space={space['0.5']}>
            {tags.map(t => (
              <Tag text={t} />
            ))}
          </Row>
          <Row space={1}>
            <Text>{date.toLocaleDateString()}</Text>
            <Text>•</Text>
            <Text>{date.toLocaleTimeString().slice(0, -3)}</Text>
          </Row>
          <Text bold fontSize="md">
            {title}
          </Text>
        </VStack>
      </Row>
    </Card>
  )
}
export default CourseOfferCard
