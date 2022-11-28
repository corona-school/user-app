import { useState } from 'react'
import { Box, Text } from 'native-base'
import useInterval from '../../hooks/useInterval'
import { useTranslation } from 'react-i18next'
import { getTimeText } from '../../helper/notification-helper'

type TimeIndicatorProps = {
  sentAt: string
}

const TimeIndicator: React.FC<TimeIndicatorProps> = ({ sentAt }) => {
  const { t } = useTranslation()
  const [toggleRerender, setToggleRerender] = useState<boolean>(false)
  const time = getTimeText(sentAt)

  const boxPropsAllDevices = {
    maxW: 80,
    pr: 3
  }

  useInterval(() => {
    setToggleRerender(!toggleRerender)
  }, 60_000)

  return (
    <Box maxW={boxPropsAllDevices.maxW} pr={boxPropsAllDevices.pr}>
      {typeof time === 'string' ? (
        <Text fontSize="xs">{time}</Text>
      ) : (
        <Text fontSize="xs">{t(time.text, time?.options)}</Text>
      )}
    </Box>
  )
}

export default TimeIndicator
