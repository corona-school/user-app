export type UserNotification = {
  id: number
  headline: string
  body: string
  sentAt: string
  notification: Notification
}

export type Notification = {
  messageType: string
}

// TODO delete NotiType
export enum NotiType {
  SURVEY = 'survey',
  TRANSACTION = 'transaction',
  TYP1 = 'Type 1',
  TYP2 = 'Type 2',
  TYP3 = 'Type 3',
  TYP4 = 'Type 4',
  TYP5 = 'Type 5',
  TYP6 = 'Type 6',
  TYP7 = 'Type 7',
  TYP8 = 'Type 8',
  TYP9 = 'Type 9',
  TYP10 = 'Type 10'
}

export enum MessageType {
  MESSAGE = 'message',
  MATCH = 'match',
  COURSE = 'course',
  APPOINTMENT = 'appointment',
  SURVEY = 'survey',
  NEWS = 'news'
}
