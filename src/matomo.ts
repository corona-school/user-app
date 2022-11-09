import { createInstance } from '@jonkoops/matomo-tracker-react'

export default createInstance({
  urlBase: process.env.REACT_APP_MATOMO_URL,
  siteId: 3,
  disabled:
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test' ||
    process.env.REACT_APP_DISABLE_MATOMO === 'true'
})
