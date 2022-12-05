export type NotificationPreference = {
  [category: string]: {
    [channel: string]: boolean
  }
}
