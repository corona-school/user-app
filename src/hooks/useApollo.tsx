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
import { debug, log } from '../log'

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
  // The Apollo Client to make requests with to the backend:
  client: ApolloClient<NormalizedCacheObject>
  // Invalidated the device token, destroys the session and goes back to the start page
  logout: () => Promise<void>
  // Call in case a mutation was run that associates the session with a user
  onLogin: (result: FetchResult) => void;

  sessionState: 'unknown' | 'logged-out' | 'logged-in'
  // Once the session is 'logged-in', a query will be issued to determine the user session
  // When the query is finished, the user will be available:
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

// ---------------- Custom ApolloLink For Request Logging -------
class RequestLoggerLink extends ApolloLink {
  request(operation: Operation, forward?: NextLink | undefined) {
    log('GraphQL Query', `running operation: ${operation.query.loc?.source.body}`, operation);
    const chain = forward!(operation);

    return chain.map((response: FetchResult) => {
        log('GraphQL Query', `operation finished: `, response);
        return response;
    });
  }
}

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
    if (operation.getContext().skipAuthRetry) {
      debug('GraphQL AuthRetry', 'skipped operation', operation);
      return forward!(operation);
    }

    return new Observable<SomeFetchResult>(observer => {
      const nextChain = forward!(operation)
      let deferred = false;

      nextChain.subscribe(it => {
        if (it.errors?.length) {
          const isAuthError = it.errors!.some(
            it => it.extensions.code === 'UNAUTHENTICATED'
          )
          if (isAuthError) {
            if (!getDeviceToken()) {
              log('GraphQL AuthRetry', 'authentication failure, no device token present')
              this.onMissingAuth();
              observer.next(it);
              return;
            }

            log('GraphQL AuthRetry', 'authentication failure and device token present, try to login');
            // We might recover by starting a new session with the device token?
            const loginObserver = new Observable<SomeFetchResult>(it =>
              { this.loginWithDeviceToken(forward!, it) });

            loginObserver.subscribe(
              result => {
                if (result.errors) {
                  log('GraphQL AuthRetry', 'Login with device token in retry failed, passing original error', result.errors)
                  clearDeviceToken();
                  this.onMissingAuth();
                  observer.next(it);
                  return
                }
                log('GraphQL AuthRetry', 'Recovered session with device token, retrying query', operation)
                forward!(operation).subscribe(observer)
              },
              error => {
                log('GraphQL AuthRetry', 'Login with device token in retry failed, passing original error', error)
                clearDeviceToken();
                this.onMissingAuth();
                observer.next(it);
              }
            );

            deferred = true;
            return // deferred execution to loginWithDeviceToken
          }
        }
        // By default, pipe back to parent link:
        observer.next(it)
      }, error => {
        if (!deferred) observer.error(it);
      }, () => {
        if (!deferred) observer.complete();
      })
    })
  }

  async loginWithDeviceToken(
    forward: NextLink,
    observer: SubscriptionObserver<SomeFetchResult>
  ) {
    debug('GraphQL AuthRetry', 'Login started')
    forward!(
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
    ).subscribe(observer);
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
        new RequestLoggerLink(),
        new RetryOnUnauthorizedLink(onMissingAuth),
        tokenLink,
        uriLink
      ]),
      
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

    const { searchParams } = new URL(window.location.href);
    if (searchParams.has('temporary')) {
      log('GraphQL', 'Device token was not created as disabled via query parameter')
      return
    }

    log('GraphQL', 'Creating device token with description: ' + describeDevice());
    const result = await client.mutate({
      mutation: gql`
        mutation CreateDeviceToken($description: String!) {
          tokenCreate(description: $description)
        }
      `,
      variables: { description: describeDevice() },
      context: { skipAuthRetry: true }
    })

    if (result.errors?.length) {
      throw new Error(`Errors during device token creation`)
    }

    const deviceToken = result.data.tokenCreate
    setDeviceToken(deviceToken)
    log('GraphQL', 'created device token')
    return deviceToken
  }, [client])

  const loginWithDeviceToken = useCallback(async (deviceToken: string) => {
    log('GraphQL', 'device token present, trying to log in')
    try {
      await client.mutate({
        mutation: gql`
          mutation LoginWithDeviceToken($deviceToken: String!) {
            loginToken(token: $deviceToken)
          }
        `,
        variables: { deviceToken },
        context: { skipAuthRetry: true }
      });

      log('GraphQL', 'successfully logged in with device token')
      setSessionState('logged-in')
      setUser(null); // refresh user information
    } catch(error) {
      log("GraphQL", "Failed to log in with device token", error);
      clearDeviceToken()
      setSessionState('logged-out');
      return;
    }
  }, [client, setSessionState]);

  // ---------- Legacy Token --------------------
  // In the old frontend, the token is passed to all pages via ?token= query parameter
  // For backwards compatibility the new user app also supports this for now
  const loginWithLegacyToken = useCallback(async (legacyToken: string) => {
    try {
      await client.mutate({
        mutation: gql`
          mutation LoginTokenLegacy($legacyToken: String!) {
            loginLegacy(authToken: $legacyToken)
          }
        `,
        variables: { legacyToken },
        context: { skipAuthRetry: true }
      })
      log("GraphQL", `Successfully logged in with a legacy token`)
      await createDeviceToken()
      setSessionState('logged-in')
      setUser(null); // refresh user information
    } catch(error) {
      log('GraphQL', 'Failed to login with legacy token', error)
      setSessionState('logged-out')
    }
  }, [client, setSessionState, createDeviceToken]);

  // ----------- Determine User --------------------------
  const determineUser = useCallback(async () => {
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
      `,
      context: { skipAuthRetry: true }
    });
    log('GraphQL', 'Determined User', me);

    if (error) throw new Error(`Failed to determine user: ${error.message}`);
    setUser(me);
  }, [client, setUser]);

  // If the session is present and the user is not yet determined
  // Trigger the user query
  useEffect(() => {
    if (sessionState !== "logged-in") return;
    if (user) return;
    determineUser(); // fire and forget
  }, [sessionState, user, determineUser]);
  
  // ----------- Session Initialization ------------------
  useEffect(() => {
    log("GraphQL", "Determining Session")

    ;(async function () {
      const { searchParams, pathname } = new URL(window.location.href)
      const legacyToken = searchParams.get('token')
      const deviceToken = getDeviceToken()

      if (pathname === '/login-token' || pathname === '/login') {
        log('GraphQL', 'User opened log in page, do not determine session');
        return
      }

      // Maybe the session already works?
      try {
        await determineUser();
        setSessionState('logged-in');
        return;
      } catch(error) {
        log('GraphQL', 'Could not query user, need to log in')
      }

      // If not, log in using the various methods
      if (deviceToken) {
        await loginWithDeviceToken(deviceToken);
        return;
      }

      if(legacyToken) {
        await loginWithLegacyToken(legacyToken);
        return;
      } 
      
      setSessionState('logged-out');
      log("GraphQL", "No Device Token present, need to log in again");
    })()
  }, [client, loginWithDeviceToken, loginWithLegacyToken, determineUser])

  // ------------ Logout --------------------------

  const logout = useCallback(async () => {
    if (getDeviceToken()) {
      log("GraphQL", "Revoking device token for logout")
      try {
      await client.mutate({
        mutation: gql`
          mutation RevokeToken($deviceToken: String!) {
            tokenRevoke(token: $deviceToken)
          }
        `,
        variables: { deviceToken: getDeviceToken() },
        context: { skipAuthRetry: true }
      });
      } catch(error) {
        log('GraphQL', 'Failed to revoke device token, probably it was already revoked', error);
      }
      clearDeviceToken()
      log("GraphQL", "Revoked device token")
    }

    log("GraphQL", "Logging out")
    try {
      await client.mutate({
        mutation: gql`
          mutation Logout {
            logout
          }
        `,
        context: { skipAuthRetry: true }
      })
    } catch(error) {
      log('GraphQL', 'Failed to log out, probably the session already expired', error);
    }
    refreshSessionToken();
    setSessionState('logged-out')
    log("GraphQL", "Logged out")
  }, [client])

  // Logins outside this hook can call onLogin to update this state
  const onLogin = useCallback((query: FetchResult) => {
    if (query.data) {
      log('GraphQL', 'Logged in successfully');
      setSessionState("logged-in");
      setUser(null); // refresh user information
      createDeviceToken(); // fire and forget
    }
  }, [createDeviceToken, setSessionState]);

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
