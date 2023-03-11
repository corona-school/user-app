import { createInstance } from '@jonkoops/matomo-tracker-react'
import { DISABLE_MATOMO } from './config'

export default createInstance({
  urlBase: process.env.REACT_APP_MATOMO_URL,
  siteId: 3,
  disabled:
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test' ||
    DISABLE_MATOMO === 'true',
    configurations: {
      "setCookieDomain": ["*.lern-fair.de"],
      "setDomains": ["*.lern-fair.de","*.app.lern-fair.de"],
      "enableCrossDomainLinking": [],
      "setExcludedQueryParams": ["token", "secret_token", "legacyToken", "redirectTo"],
      "disableCookies": [],
    },
})
