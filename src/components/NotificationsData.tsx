import { useEffect, useContext, FC } from "react"
import { NotificationsContext } from "../hooks/NotificationsProvider"
import { useConcreteNotification } from "../hooks/useConcreteNotification"

  
export const NotificationsData: FC = () => {
  const {concreteNotificationId, setMessage} = useContext(NotificationsContext)
  const {data, error} = useConcreteNotification(concreteNotificationId)

  useEffect(() => {
    if (!error) {
      setMessage(data)
    }
  }, [data, error])
  
  return null
}