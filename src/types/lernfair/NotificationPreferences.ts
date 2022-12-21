export type NotificationPreferences = {
  [category: string]: PreferencesType
}

export type PreferencesType = {
  [channel: string]: boolean
}
