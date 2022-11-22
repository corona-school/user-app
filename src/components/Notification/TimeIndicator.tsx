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
    <Box>
      {typeof time === 'string' ? (
        <Text fontSize="sm">{time}</Text>
      ) : (
        <Text fontSize="sm">{t(time.text, time?.options)}</Text>
      )}
    </Box>
  )
}

export default TimeIndicator
