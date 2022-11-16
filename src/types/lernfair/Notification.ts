export type _UserNotification = {
  headline: String
  createdAt?: String
  notification: Notification
}

export type _Notification = {
  category: String
  description: String
}

export type UserNotification = {
  id: number
  headline: string
  body: string
  notificationClass: string
  createdAt?: string
}

//TO DO: adjust notification types
export enum NotificationType {
  SURVEY = 'survey',
  TRANSACTION = 'transaction'
}
