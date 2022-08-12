import { View, Text, Box, Row, useTheme, Button } from 'native-base'
import Card from '../components/Card'
import Tag from '../components/Tag'

type Props = {
  tags: string[]
  date: Date
  numAppointments: number
  title: string
  onClickSignIn?: () => any
}

const SignInCard: React.FC<Props> = ({
  tags,
  date,
  numAppointments,
  title,
  onClickSignIn
}) => {
  const { space } = useTheme()
  return (
    <Card>
      <Box bg="primary.500" h="120" padding={space['0.5']}></Box>
      <Box padding={space['0.5']}>
        <Row space={space['0.5']} paddingY={space['0.5']}>
          {tags.map((t, i) => (
            <Tag key={`tag-${i}`} text={t} />
          ))}
        </Row>
        <Row space={1}>
          <Text>Ab {date.toLocaleDateString()}</Text>
          <Text>•</Text>
          <Text>{numAppointments} Termine</Text>
        </Row>
        <Text bold fontSize={'md'}>
          {title}
        </Text>
        <Button marginTop={space['1']} onPress={onClickSignIn}>
          Anmelden
        </Button>
      </Box>
    </Card>
  )
}
export default SignInCard
