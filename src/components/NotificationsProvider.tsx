import { createContext, FC, ReactNode, useState } from "react"
import { UserNotification } from "../types/lernfair/Notification"

type NotificationsContextValue = {
  setMessage: (arg0: UserNotification) => void
  message: UserNotification | null
}

export const NotificationsContext = createContext<NotificationsContextValue>(
  { setMessage: () => null, message: null })

export const NotificationsProvider: FC<{ children: ReactNode }> =
  ({ children }) => {
    const [message, setMessage] = useState<UserNotification|null>(null)
    
    return (
      <NotificationsContext.Provider value={{
        message,
        setMessage,
      }}>
        {children}
      </NotificationsContext.Provider>
    )
  }
