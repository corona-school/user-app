import { View, Progress, Heading } from 'native-base'

type Props = {
  percent: number
  showPercent?: boolean
}

const UserProgress: React.FC<Props> = ({ percent, showPercent = true }) => {
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
      {showPercent && <Heading fontSize="sm">{percent} %</Heading>}
    </View>
  )
}
export default UserProgress
