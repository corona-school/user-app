import { View, Progress, Heading } from 'native-base'

type Props = {
  procent: number
}

const UserProgress: React.FC<Props> = ({ procent }) => {
  return (
    <View>
      <Progress
        marginY={2}
        size="md"
        bg="primary.300"
        _filledTrack={{
          bg: 'primary.900'
        }}
        value={procent}
      />
      <Heading fontSize="sm">{procent} %</Heading>
    </View>
  )
}
export default UserProgress
