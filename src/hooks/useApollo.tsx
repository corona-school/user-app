import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  FetchResult,
  from,
  gql,
  HttpLink,
  InMemoryCache,
  NextLink,
  NormalizedCacheObject,
  Observable,
  Operation
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import {
  ReactNode,
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect
} from 'react'
import Utility from '../Utility'
import { createOperation } from '@apollo/client/link/utils'
import { SubscriptionObserver } from 'zen-observable-ts'
import userAgentParser from 'ua-parser-js'
import { BACKEND_URL } from '../config'

export type LFApollo = {
  client: ApolloClient<NormalizedCacheObject>
  logout: () => Promise<void>
  createDeviceToken: () => Promise<string>
  sessionState: 'unknown' | 'logged-out' | 'logged-in'
}

// Unlike the standard ApolloProvider, this context carries additional properties
//  for managing the session
const ExtendedApolloContext = createContext<LFApollo | null>(null)

export const LFApolloProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const context = useApolloInternal()

  return (
    <ExtendedApolloContext.Provider value={context}>
      <ApolloProvider client={context.client}>{children}</ApolloProvider>
    </ExtendedApolloContext.Provider>
  )
}

// -------------- Global User State -------------------
// ----- Session Token ---------------------
//  Authenticates the user during a session
const getSessionToken = () => {
  const token = localStorage.getItem('lernfair:token')
  if (token) return token

  return refreshSessionToken()
}

const refreshSessionToken = () => {
  let tok = Utility.createToken()
  localStorage.setItem('lernfair:token', tok)
  return tok
}

const clearSessionToken = () => {
  localStorage.removeItem('lernfair:token')
}

// ----- Device Token -----------------------
// The session token stored in lernfair:token is short lived (a day or so)
//  and might be invalidated when the backend restarts. To maintain permanent
//  user sessions, users can create long lived tokens with which they can log in
// Users can create and delete these tokens as they want (e.g. logout from a certain device)

const getDeviceToken = () => localStorage.getItem('lernfair:device-token')
const setDeviceToken = (token: string) =>
  localStorage.setItem('lernfair:device-token', token)
const clearDeviceToken = () => localStorage.removeItem('lernfair:device-token')

// ---------------- Custom ApolloLink Error Handling with Retry -------
// When a query fails because it is UNAUTHORIZED,
//  try to log in with the device token, then retry the query
type SomeFetchResult = FetchResult<
  Record<string, any>,
  Record<string, any>,
  Record<string, any>
>

class RetryOnUnauthorizedLink extends ApolloLink {
  constructor(public readonly onMissingAuth: () => void) {
    super()
  }

  request(operation: Operation, forward?: NextLink | undefined) {
    return new Observable<SomeFetchResult>(observer => {
      const nextChain = forward!(operation)

      nextChain.subscribe(it => {
        if (it.errors?.length) {
          const isAuthError = it.errors!.some(
            it => it.extensions.code === 'UNAUTHENTICATED'
          )
          if (isAuthError && !!getDeviceToken()) {
            // We might recover by starting a new session with the device token?
            this.loginWithDeviceToken(forward!, observer).then(succeeded => {
              if (succeeded) {
                // Retry exactly once, piping in the original request
                forward!(operation).subscribe(observer)
                return
              } else {
                // Failed to log in the user, redirecting to login:
                this.onMissingAuth()
                return
              }
            })

            return // deferred execution to loginWithDeviceToken
          }
        }
        // By default, pipe back to parent link:
        observer.next(it)
      })
    })
  }

  async loginWithDeviceToken(
    forward: NextLink,
    observer: SubscriptionObserver<SomeFetchResult>
  ): Promise<boolean> {
    const login = forward!(
      createOperation(
        {},
        {
          query: gql`
            mutation LoginWithDeviceToken($deviceToken: String!) {
              loginToken(token: $deviceToken)
            }
          `,
          variables: { deviceToken: getDeviceToken() }
        }
      )
    )

    const firstResult = await new Promise<SomeFetchResult>(res =>
      login.subscribe(res)
    )

    if (!firstResult.errors?.length) {
      // Login was successful
      return true
    }

    // Pipe the login error back to the original query
    observer.next(firstResult)
    return false
  }
}

function describeDevice() {
  const parsed = userAgentParser(window.navigator.userAgent)
  return `${parsed.browser.name ?? 'Unbekannter Browser'} auf einem ${
    parsed.device.model ?? 'Unbekannten Gerät'
  }`
}

const useApolloInternal = () => {
  const [sessionState, setSessionState] =
    useState<LFApollo['sessionState']>('unknown')

  const onMissingAuth = useCallback(() => setSessionState('logged-out'), [])

  // -------------- Apollo Client -------------------------

  const client = useMemo(() => {
    const tokenLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${getSessionToken()}`
      }
    }))

    const uriLink = new HttpLink({
      uri: BACKEND_URL + '/apollo'
    })

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: from([
        new RetryOnUnauthorizedLink(onMissingAuth),
        tokenLink,
        uriLink
      ])
    })
  }, [onMissingAuth])

  // ------------ Device Token ----------------------------
  // The device token is used by the RetryOnUnauthorizedLink
  //  if authentication fails. If we have a valid user session
  //  and no device token, then it makes sense to create one,
  //  so that when the session is invalidated, we can log in
  //  again using the device token
  const createDeviceToken = useCallback(async () => {
    const result = await client.mutate({
      mutation: gql`
        mutation CreateDeviceToken($description: String!) {
          tokenCreate(description: $description)
        }
      `,
      variables: { description: describeDevice() }
    })

    if (result.errors?.length) {
      throw new Error(`Errors during device token creation`)
    }

    const deviceToken = result.data.tokenCreate
    setDeviceToken(deviceToken)
    setSessionState('logged-in')
    return deviceToken
  }, [client])

  // ------------ Session Initialization ------------------
  // When the user opens the app via email,
  // the URL might contain a query parameter with which
  // the user can be logged in automatically:
  //  ?token=... is a legacy token where each user has exactly one
  //  ?secret_token=... is a new token, based on 'secrets'
  useEffect(() => {
    (async function () {
      const { searchParams } = new URL(window.location.href)
      const legacyToken = searchParams.get('token')
      if (legacyToken) {
        if (getDeviceToken()) {
          console.log(
            `Legacy Token present in URL, but as a device token is already present it is not used`
          )
          return
        }

        const result = await client.mutate({
          mutation: gql`
            mutation LoginTokenLegacy($legacyToken: String!) {
              loginLegacy(authToken: $legacyToken)
            }
          `
        })

        if (result.errors?.length) {
          console.warn(
            `Failed to log in with a legacy token, token is probably invalid`
          )
          return // Silently failing, maybe the user knows his password instead?
        }

        console.log(`Successfully logged in with a legacy token`)
        await createDeviceToken()
        setSessionState('logged-in')
      }

      const secretToken = searchParams.get('secret_token')
      if (secretToken) {
        if (getDeviceToken()) {
          console.log(
            `Secret Token present in URL, but as a device token is already present it is not used`
          )
          return
        }

        const result = await client.mutate({
          mutation: gql`
            mutation LoginToken($token: String!) {
              loginToken(token: $token)
            }
          `
        })

        if (result.errors?.length) {
          console.warn(
            `Failed to log in with a secret token, token is probably invalid`
          )
          return // Silently failing, maybe the user knows his password instead?
        }

        console.log(`Successfully logged in with a secret token`)
        await createDeviceToken()
        setSessionState('logged-in')
      }
    })()
  }, [client, createDeviceToken])

  // ------------ Login & Logout --------------------------

  const logout = useCallback(async () => {
    // TODO: Revoke device token in backend?

    await client.mutate({
      mutation: gql`
        mutation Logout {
          logout
        }
      `
    })
    clearDeviceToken()
    setSessionState('logged-out')
  }, [client])
  return useMemo(
    () => ({ client, logout, createDeviceToken, sessionState }),
    [client, logout, createDeviceToken, sessionState]
  )
}

const useApollo = () => useContext(ExtendedApolloContext)!
export default useApollo
