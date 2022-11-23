import { useState } from 'react'
import { Box, Text, useBreakpointValue } from 'native-base'
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
