import { useEffect, useContext, FC } from "react"
import { useBreakpointValue } from "native-base"
import { NotificationsContext } from "../hooks/NotificationsProvider"
import { showInAppMessage } from "../widgets/InAppMessage"
  
export const ToastNotifications: FC<{}> = () => {
  const {notifications} = useContext(NotificationsContext)
  
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  useEffect(() => {
    notifications.forEach(notification => showInAppMessage(notification, isMobile))
  }, [notifications])
  
  return null
}