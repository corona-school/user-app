import { createInstance } from '@jonkoops/matomo-tracker-react'

export default createInstance({
  urlBase: process.env.REACT_APP_MATOMO_URL,
  siteId: 3,
  disabled:
    true ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test' ||
    process.env.REACT_APP_DISABLE_MATOMO // optional, false by default. Makes all tracking calls no-ops if set to true.
})
