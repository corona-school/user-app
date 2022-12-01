import { useEffect, FC } from "react"
import { useBreakpointValue } from "native-base"
import { showInAppMessage } from "../widgets/InAppMessage"
import { useConcreteNotificationMessage } from "../hooks/useConcreteNotificationMessage"
import { useIncomingWSConcreteNotificationId } from "./useIncomingWSConcreteNotificationId"

export const ToastNotifications: FC = () => {
  const concreteNotificationId = useIncomingWSConcreteNotificationId()
  const message = useConcreteNotificationMessage(concreteNotificationId)
  
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  useEffect(() => {
    if (message !== null) showInAppMessage(message, isMobile)
  }, [message, isMobile])
  
  return null
}
