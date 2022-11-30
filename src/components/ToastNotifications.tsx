import { useEffect, useContext, FC } from "react"
import { useBreakpointValue } from "native-base"
import { NotificationsContext } from "../hooks/NotificationsProvider"
import { showInAppMessage } from "../widgets/InAppMessage"

export const ToastNotifications: FC = () => {
  const {message} = useContext(NotificationsContext)
  
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  useEffect(() => {
    if (typeof message === 'object') showInAppMessage(message, isMobile)
  }, [message, isMobile])
  
  return null
}