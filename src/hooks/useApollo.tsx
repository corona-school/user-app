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
import { log } from '../log'

interface UserType {
  userID: string;
  firstname: string;
  lastname: string;
  email: string;
  pupil: {
    id: number;
    verifiedAt: Date | null;
  },
  student: {
    id: number;
    verifiedAt: Date | null;
  }
}

export type LFApollo = {
  client: ApolloClient<NormalizedCacheObject>
  
  logout: () => Promise<void>

  onLogin: (result: FetchResult) => void;

  sessionState: 'unknown' | 'logged-out' | 'logged-in'
  user: UserType | null
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
    console.log('GraphQL', 'Query started', operation);
    return new Observable<SomeFetchResult>(observer => {
      const nextChain = forward!(operation)

      return nextChain.subscribe(it => {
        log('GraphQL', 'chain event', it);
        if (it.errors?.length) {
          const isAuthError = it.errors!.some(
            it => it.extensions.code === 'UNAUTHENTICATED'
          )
          if (isAuthError && !!getDeviceToken()) {
            log('GraphQL', 'authentication failure and device token present, try to login');
            // We might recover by starting a new session with the device token?
            this.loginWithDeviceToken(forward!, observer).then(succeeded => {
              if (succeeded) {
                // Retry exactly once, piping in the original request
                log('GraphQL', 'login with device token succeeded, retrying query', operation);
                forward!(operation).subscribe(observer)
                return
              } else {
                // Failed to log in the user, redirecting to login:
                log('GraphQL', 'login with device token failed, going to login page');
                clearDeviceToken();
                this.onMissingAuth()
                return
              }
            })

            return // deferred execution to loginWithDeviceToken
          }
        }
        // By default, pipe back to parent link:
        log('GraphQL', 'pipe next')
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
  const [user, setUser] = useState<UserType | null>(null);

  log("GraphQL", "Refresh", { sessionState, user });

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
        // new RetryOnUnauthorizedLink(onMissingAuth),
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
    if (getDeviceToken()) return;

    log('GraphQL', 'Creating device token with description: ' + describeDevice());
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
    log('GraphQL', 'created device token')
    return deviceToken
  }, [client])

  // ------------ Session Initialization ------------------
  // When the user opens the app via email,
  // the URL might contain a query parameter with which
  // the user can be logged in automatically:
  //  ?token=... is a legacy token where each user has exactly one
  useEffect(() => {
    log("GraphQL", "Determining Session")

    ;(async function () {
      const { searchParams } = new URL(window.location.href)
      const legacyToken = searchParams.get('token')

      if (getDeviceToken()) {
        log('GraphQL', 'device token present, trying to log in')
        try {
          const result = await client.mutate({
            mutation: gql`
              mutation LoginWithDeviceToken($deviceToken: String!) {
                loginToken(token: $deviceToken)
              }
            `,
            variables: { deviceToken: getDeviceToken() },
          }); 

        } catch(error) {
          log("GraphQL", "Failed to log in with device token", error);
          clearDeviceToken()
          setSessionState('logged-out');
          return;
        }

        log('GraphQL', 'successfully logged in with device token')
        setSessionState('logged-in')

      } else if(legacyToken) {
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

        log("GraphQL", `Successfully logged in with a legacy token`)
        await createDeviceToken()
        setSessionState('logged-in')
      } else {
        setSessionState('logged-out');
        log("GraphQL", "No Device Token present, need to log in again");
      }
    })()
  }, [client, createDeviceToken])

  // ------------ Login & Logout --------------------------

  const logout = useCallback(async () => {
    if (getDeviceToken()) {
      log("GraphQL", "Revoking device token for logout")
      await client.mutate({
        mutation: gql`
          mutation RevokeToken($deviceToken: String!) {
            tokenRevoke(token: $deviceToken)
          }
        `,
        variables: { deviceToken: getDeviceToken() }
      });
      clearDeviceToken()
      log("GraphQL", "Revoked device token")
    }

    log("GraphQL", "Logging out")
    await client.mutate({
      mutation: gql`
        mutation Logout {
          logout
        }
      `
    })
    setSessionState('logged-out')
    log("GraphQL", "Logged out")
  }, [client])

  // Determine User
  useEffect(() => {
    if (sessionState !== "logged-in") return;

    (async function () {
      log('GraphQL', 'Begin Determining User');
      
      const { data: { me }, error } = await client.query({
        query: gql`
          query {
            me {
              userID
              firstname
              lastname
              email
              pupil { id verifiedAt }
              student { id verifiedAt }
            }
          }
        `
      });
      log('GraphQL', 'Determined User', me);

      if (error) throw new Error(`Failed to determine user: ${error.message}`);
      setUser(me);
    })();
  }, [client, sessionState, setUser]);

  const onLogin = useCallback((query: FetchResult) => {
    if (query.data) {
      log('GraphQL', 'Logged in successfully');
      setSessionState("logged-in");
      createDeviceToken(); // fire and forget
    }
  }, []);

  return useMemo(
    () => ({ client, logout, sessionState, user, onLogin }),
    [client, logout, user, sessionState, onLogin]
  )
}

const useApollo = () => useContext(ExtendedApolloContext)!
export const useUser = () => useContext(ExtendedApolloContext)!.user!;
export const useUserType = () => {
  const { user } = useContext(ExtendedApolloContext)!;
  if (user?.pupil) return "pupil";
  if (user?.student) return "student";
  throw new Error(`useUserType cannot determine user`);
};

export default useApollo
