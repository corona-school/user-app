import { useEffect, FC, useContext } from 'react'
import { useBreakpointValue } from 'native-base'
import { showInAppMessage } from '../widgets/InAppMessage'
import { NotificationsContext } from './NotificationsProvider'

export const ToastNotifications: FC = () => {
  const message = useContext(NotificationsContext)

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  useEffect(() => {
    console.log('message for toast', message)
    if (message !== null) showInAppMessage(message, isMobile)
  }, [message, isMobile])

  return null
}
