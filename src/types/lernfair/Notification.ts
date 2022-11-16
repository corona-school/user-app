export type _UserNotification = {
  headline: String
  createdAt?: String
  notification: Notification
}

export type _Notification = {
  category: String
  description: String
}

export type DummyUserNotification = {
  id: number
  description: string
  category: string[]
}

//TO DO: adjust notification types
export enum NotificationType {
  SURVEY = 'survey',
  TRANSACTION = 'transaction'
}
