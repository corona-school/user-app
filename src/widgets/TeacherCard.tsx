import { ReactNode } from 'react'
import { Box, Row, Text, useTheme } from 'native-base'
import Tag from '../components/Tag'
import LeftImageCard from './LeftImageCard'
import ProfilAvatar from './ProfilAvatar'
import RatingTag from './RatingTag'

type Props = {
  variant?: 'normal' | 'dark'
  tags: string[]
  name: string
  avatar?: string
  button?: ReactNode | ReactNode[]
}

const TeacherCard: React.FC<Props> = ({
  variant = 'normal',
  tags,
  name,
  avatar,
  button
}) => {
  const { space } = useTheme()

  return (
    <LeftImageCard avatar={avatar} button={button} variant={variant}>
      <Box alignSelf="flex-start">
        <RatingTag rating="4,1" />
      </Box>
      <Text fontSize="md" bold color={variant === 'dark' ? 'lightText' : ''}>
        {name}
      </Text>
      <Row space={space['0.5']}>
        {tags.map(t => (
          <Tag variant="rating" text={t} />
        ))}
      </Row>
    </LeftImageCard>
  )
}
export default TeacherCard
