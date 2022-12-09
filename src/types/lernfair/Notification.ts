export type UserNotification = {
  id: number
  headline: string
  body: string
  createdAt: string
  notification: Notification
}

export type Notification = {
  messageType: string
}

export enum MessageType {
  MESSAGE = 'message',
  MATCH = 'match',
  COURSE = 'course',
  APPOINTMENT = 'appointment',
  SURVEY = 'survey',
  NEWS = 'news',
  CHAT = 'chat'
}

export enum MarketingMessageType {
  NEWSLETTER = 'newsletter',
  TRAINING = 'training',
  EVENTS = 'events',
  NEWSOFFER = 'newsoffer',
  REQUEST = 'request',
  LEARNOFFER = 'learnoffer',
  ALTERNATIVEOFFER = 'alternativeoffer',
  FEEDBACK = 'feedback'
}
