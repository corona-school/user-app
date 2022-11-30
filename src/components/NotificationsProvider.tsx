import { createContext, FC, ReactNode, useState } from "react"
import { UserNotification } from "../types/lernfair/Notification"

type State = { message?: UserNotification, concreteNotificationId?: number }

type NotificationsContextValue = {
  setConcreteNotificationId: (arg0: number) => void, setMessage: (arg0: UserNotification) => void
} & State;

export const NotificationsContext = createContext<NotificationsContextValue>(
  { setConcreteNotificationId: () => null, setMessage: () => null })

const isMessageValid = (message: UserNotification | unknown): boolean => {
  if (typeof message !== 'object') return false

  const requiredFields = ["id", "headline", "body", "notification"]
  const fields = Object.keys(message as UserNotification)

  for (const requiredField of requiredFields) {
    if (!fields.includes(requiredField)) return false
  }

  return true
}

export const NotificationsProvider: FC<{ children: ReactNode }> =
  ({ children }) => {
    const [concreteNotificationId, setConcreteNotificationId] = useState<number>()
    const [message, setMessage] = useState<UserNotification>()

    const setValidatedMessage = (message: UserNotification | unknown) => {
      if (isMessageValid(message)) {
        setMessage(message as UserNotification)
      }
    }
    
    return (
      <NotificationsContext.Provider value={{
        message,
        concreteNotificationId,
        setConcreteNotificationId,
        setMessage: setValidatedMessage,
      }}>
        {children}
      </NotificationsContext.Provider>
    )
  }
