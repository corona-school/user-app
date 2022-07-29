import { View, Text, Row, Box, VStack, useTheme } from 'native-base'
import Card from '../components/Card'
import Tag from '../components/Tag'
import LeftImageCard from './LeftImageCard'

type Props = {
  title: string
  tags: string[]
  date: Date
}

const StudyPartnerCard: React.FC<Props> = ({ title, tags, date }) => {
  const { space } = useTheme()
  return (
    <LeftImageCard>
      <Row space={space['0.5']}>
        {tags.map((t, i) => (
          <Tag text={t} key={`tag-${i}`} />
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
    </LeftImageCard>
  )
}
export default StudyPartnerCard
