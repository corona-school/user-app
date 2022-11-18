import { createContext, Dispatch, SetStateAction } from 'react'

type NotificationContext = {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
}

// TODO Context for in app notifications in realtime
const NotificationContext = createContext<NotificationContext>({
  show: false,
  setShow: () => null
})

export const NotificationProvider = () => {}

export default NotificationContext
