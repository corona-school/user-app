import { View, Progress, Heading } from 'native-base'

type Props = {
  percent: number
}

const UserProgress: React.FC<Props> = ({ percent }) => {
  return (
    <View>
      <Progress
        marginY={2}
        size="md"
        bg="primary.300"
        _filledTrack={{
          bg: 'primary.900'
        }}
        value={percent}
      />
      <Heading fontSize="sm">{percent} %</Heading>
    </View>
  )
}
export default UserProgress
