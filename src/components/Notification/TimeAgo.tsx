import { useState } from 'react'
import { Box, Text } from 'native-base'

import { useTimeDifference } from '../../hooks/useNotificationPanel'
import useInterval from '../../hooks/useInterval'

type TimeAgoProps = {
  createdAt: string
}

const TimeAgo: React.FC<TimeAgoProps> = ({ createdAt }) => {
  const [toggleRerender, setToggleRerender] = useState<boolean>(false)

  const time = useTimeDifference(createdAt)

  useInterval(() => {
    setToggleRerender(!toggleRerender)
  }, 60_000)

  return (
    <Box pr={3} mt={-3}>
      <Text fontSize="12px">{time}</Text>
    </Box>
  )
}

export default TimeAgo
