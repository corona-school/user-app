import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import de from './lang/de'

console.log({ de })

i18next.use(initReactI18next).init({
  debug: process.env.NODE_ENV === 'development',
  resources: {
    de: {
      translation: de
    }
  },
  fallbackLng: 'de',
  detection: {
    order: [
      'localStorage',
      'navigator',
      'cookie',
      'sessionStorage',
      'localStorage',
      'htmlTag',
      'querystring',
      'subdomain',
      'path'
    ]
  }
})
