import { useEffect, useState } from "react"
import { useConcreteNotification } from "./useConcreteNotification"
import { UserNotification } from "../types/lernfair/Notification"

const isMessageValid = (message: UserNotification | unknown): boolean => {
  if (typeof message !== 'object') return false

  const requiredFields = ["id", "headline", "body", "notification"]
  const fields = Object.keys(message as UserNotification)

  for (const requiredField of requiredFields) {
    if (!fields.includes(requiredField)) return false
  }

  return true
}

export const useConcreteNotificationMessage = (concreteNotificationId: number | null): UserNotification | null => {
  const {data, error} = useConcreteNotification(concreteNotificationId)
  const [message, setMessage] = useState<UserNotification | null>(null)

  useEffect(() => {
    if (!error && data && isMessageValid(data.concrete_notification)) {
      setMessage(data.concrete_notification)
    }
  }, [data, error])
  
  return message
}
