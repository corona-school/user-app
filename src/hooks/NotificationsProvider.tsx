import { createContext, FC, ReactNode, useState } from "react"
import { UserNotification } from "../types/lernfair/Notification"

type Notification = Partial<UserNotification>

type NotificationContextValue = {notifications: Notification[], dispatchNewNotificationIds: Function};
export const NotificationsContext = createContext<NotificationContextValue>({notifications: [], dispatchNewNotificationIds: () => null})

type State = { notifications: Notification[] }

export const NotificationsProvider: FC<{ children: ReactNode }> =
  ({ children })=> {
    const [{notifications}, setState] = useState<State>({notifications: []})
    const dispatchNewNotificationIds = async (notificationIds: Array<string | number>) => {
      // fetch notification from graphql
      // replace this with real notification
      const timestamp = Date.now()
      setState({notifications: [{id: timestamp, headline: `Dummy Notification ${timestamp}`, body: `Dummy Text ${timestamp}`}]})
    }

    return (
      <NotificationsContext.Provider value={{notifications, dispatchNewNotificationIds}}>
        {children}
      </NotificationsContext.Provider>
    )
  }
