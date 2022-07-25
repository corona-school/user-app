import { Box, Row, Text, useTheme } from 'native-base'
import Tag from '../components/Tag'
import LeftImageCard from './LeftImageCard'
import RatingTag from './RatingTag'

type Props = {
  tags: string[]
  name: string
}

const TeacherCard: React.FC<Props> = ({ tags, name }) => {
  const { space } = useTheme()

  return (
    <LeftImageCard>
      <Box alignSelf="flex-start">
        <RatingTag rating="4,1" />
      </Box>
      <Text fontSize="md" bold>
        {name}
      </Text>
      <Row space={space['0.5']}>
        {tags.map(t => (
          <Tag text={t} />
        ))}
      </Row>
    </LeftImageCard>
  )
}
export default TeacherCard
