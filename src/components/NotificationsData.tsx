import { useEffect, useContext, FC } from "react"
import { NotificationsContext } from "../hooks/NotificationsProvider"
  
export const NotificationsData: FC<{}> = () => {
  const {notificationIds, setNotifications} = useContext(NotificationsContext)

  useEffect(() => {
    // fetch notifications from backend
    // setNotifications(fetchedData)
  }, [notificationIds])
  
  return null
}