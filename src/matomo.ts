import { createInstance } from '@jonkoops/matomo-tracker-react'

export default createInstance({
  urlBase: process.env.REACT_APP_MATOMO_URL,
  siteId: 3,
  disabled:
    process.env.NODE_ENV === 'test' // optional, false by default. Makes all tracking calls no-ops if set to true.
})
