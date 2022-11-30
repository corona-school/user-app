import { createContext, FC, ReactNode, useState } from "react"
import { UserNotification } from "../types/lernfair/Notification"

type State = { message?: UserNotification, concreteNotificationId?: number }

type NotificationsContextValue = {
  setConcreteNotificationId: (arg0: number) => void, setMessage: (arg0: UserNotification) => void
} & State;

export const NotificationsContext = createContext<NotificationsContextValue>(
  { setConcreteNotificationId: () => null, setMessage: () => null })

export const NotificationsProvider: FC<{ children: ReactNode }> =
  ({ children }) => {
    const [state, setState] = useState<State>(
      {})
    const setConcreteNotificationId = (id: number) => {
      setState({ ...state, concreteNotificationId: id })
    }

    const isMessageValid = (message: UserNotification | unknown): boolean => {
      if (typeof message !== 'object') return false
      
      const requiredFields = ["id", "headline", "body", "notification"]
      const fields = Object.keys(message as UserNotification)

      for (const requiredField in requiredFields) {
        if (!fields.includes(requiredField)) return false
      }

      return true
    }

    const setMessage = (message: UserNotification | unknown) => {
      if (isMessageValid(message)) {
        setState({ ...state, message: message as UserNotification })
      }
    }

    const { message, concreteNotificationId } = state
    return (
      <NotificationsContext.Provider value={{
        message,
        concreteNotificationId,
        setConcreteNotificationId,
        setMessage,
      }}>
        {children}
      </NotificationsContext.Provider>
    )
  }
