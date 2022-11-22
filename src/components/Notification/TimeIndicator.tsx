import { useState } from 'react'
import { Box, Text } from 'native-base'
import useInterval from '../../hooks/useInterval'
import { useTranslation } from 'react-i18next'
import { getTimeText } from '../../helper/notification-helper'

type TimeIndicatorProps = {
  createdAt: string
}

const TimeIndicator: React.FC<TimeIndicatorProps> = ({ createdAt }) => {
  const { t } = useTranslation()
  const [toggleRerender, setToggleRerender] = useState<boolean>(false)

  const time = getTimeText(createdAt)

  useInterval(() => {
    setToggleRerender(!toggleRerender)
  }, 60_000)

  return (
    <Box maxW={80} pr={3}>
      {typeof time === 'string' ? (
        <Text fontSize="xs">{time}</Text>
      ) : (
        <Text fontSize="xs">{t(time.text, time?.options)}</Text>
      )}
    </Box>
  )
}

export default TimeIndicator
