import { useEffect, useContext, FC } from "react"
import { NotificationsContext } from "./NotificationsProvider"
import { useConcreteNotification } from "../hooks/useConcreteNotification"

  
export const NotificationsData: FC = () => {
  const {concreteNotificationId, setMessage} = useContext(NotificationsContext)
  const {data, error} = useConcreteNotification(concreteNotificationId)

  useEffect(() => {
    if (!error && data) {
      setMessage(data.concrete_notification)
    }
  }, [data, error])
  
  return null
}
