//TO DO: adjust in-app-model
export type InAppNotification = {
  _typename: string
  id: number
  description: string
  category: NotificationType[]
  active: boolean
  mailjetTemplate: number
}

//TO DO: adjust notification types
export enum NotificationType {
  SURVEY = 'survey',
  TRANSACTION = 'transaction'
}
