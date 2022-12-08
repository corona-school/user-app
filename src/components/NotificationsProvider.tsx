import { createContext, FC, ReactNode } from 'react'
import { UserNotification } from '../types/lernfair/Notification'
import { useIncomingWSConcreteNotificationId } from '../hooks/useIncomingWSConcreteNotificationId'
import { useConcreteNotification } from '../hooks/useConcreteNotification'

export const NotificationsContext = createContext<UserNotification | null>(null)

export const NotificationsProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const concreteNotificationId = useIncomingWSConcreteNotificationId()
  const message = useConcreteNotification(concreteNotificationId)
  console.log('Provider id', concreteNotificationId)
  console.log('Provider message', message)
  return (
    <NotificationsContext.Provider value={message}>
      {children}
    </NotificationsContext.Provider>
  )
}
