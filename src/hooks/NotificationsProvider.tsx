import { createContext, FC, ReactNode, useState } from "react"
import { UserNotification } from "../types/lernfair/Notification"

type Notification = UserNotification
type State = { notifications: Notification[], notificationIds: number[] }

type NotificationContextValue = {
  setNotificationIds: Function, setNotifications: Function
} & State;

export const NotificationsContext = createContext<NotificationContextValue>(
  { notifications: [], notificationIds: [], setNotificationIds: () => null, setNotifications: () => null })

export const NotificationsProvider: FC<{ children: ReactNode }> =
  ({ children }) => {
    const [state, setState] = useState<State>(
      { notifications: [], notificationIds: [] })
    const setNotificationIds = (notificationIds: number[]) => {
      setState({ ...state, notificationIds })
    }
    const setNotifications = (notifications: Notification[]) => {
      setState({ ...state, notifications })
    }

    const { notifications, notificationIds } = state
    return (
      <NotificationsContext.Provider value={{
        notifications,
        notificationIds,
        setNotificationIds,
        setNotifications,
      }}>
        {children}
      </NotificationsContext.Provider>
    )
  }
