export type UserNotification = {
  id: number
  message: Message
  sentAt: string
}

type Message = {
  headline: string
  body: string
  messageType: MessageType
  navigateTo?: string
  isUrlExternal?: boolean
  error?: string
}

export enum MessageType {
  MESSAGE = 'message',
  MATCH = 'match',
  COURSE = 'course',
  APPOINTMENT = 'appointment',
  SURVEY = 'survey',
  NEWS = 'news'
}
