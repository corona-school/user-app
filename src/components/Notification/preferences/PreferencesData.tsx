export const preferencesData = [
  {
    id: 'chat',
    activatedChannels: ['email']
  },
  {
    id: 'match',
    activatedChannels: ['email']
  },
  {
    id: 'course',
    activatedChannels: ['email']
  },
  {
    id: 'appointment',
    activatedChannels: ['email']
  },
  {
    id: 'survey',
    activatedChannels: ['email']
  },
  {
    id: 'news',
    activatedChannels: []
  }
]

export type NotificationPreference = {
  [category: string]: {
    [channel: string]: boolean
  }
}
export const notificationPreferences: NotificationPreference = {
  chat: {
    email: false,
    chat: true,
    whatsapp: false
  },
  match: {
    email: false,
    chat: true,
    whatsapp: false
  },
  course: {
    email: true,
    chat: true,
    whatsapp: false
  },
  appointment: {
    email: true,
    chat: true,
    whatsapp: false
  },
  survey: {
    email: true,
    chat: true,
    whatsapp: false
  },
  news: {
    email: true,
    chat: true,
    whatsapp: false
  }
}
