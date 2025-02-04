import {
    ApolloCache,
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    Cache,
    DataProxy,
    FetchResult,
    from,
    HttpLink,
    InMemoryCache,
    NextLink,
    NormalizedCacheObject,
    Observable,
    Operation,
    Reference,
    Transaction,
    TypedDocumentNode,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Utility from '../Utility';
import { createOperation } from '@apollo/client/link/utils';
import { SubscriptionObserver } from 'zen-observable-ts';
import userAgentParser from 'ua-parser-js';
import { BACKEND_URL, RESULT_CACHE_ACTIVE } from '../config';
import { debug, log } from '../log';
import { gql } from '../gql';
import { Role } from '../types/lernfair/User';
import { datadogRum } from '@datadog/browser-rum';
import { Kind } from 'graphql';

// Utility type to extract the query result:
// const SomeQuery = gql(...);
// type SomeQueryResult = QueryResult<typeof SomeQuery>;
export type QueryResult<Q> = Q extends TypedDocumentNode<infer Data, any> ? Data : never;

// --------------- Caching -------------------------

const LOGIN_WITH_DEVICE_TOKEN_MUTATION = gql(`
    mutation LoginWithDeviceToken($deviceToken: String!, $deviceId: String!) {
      loginToken(token: $deviceToken, deviceId: $deviceId)
    }
  `);

type Watcher = () => void;

interface FullResult {
    data: any;
    variables: string;
}

// The Apollo InMemory cache is way too complex for our purpose
// Thus we have our own cache implementation, that caches the full result of each query
// When the query is executed a second time, we first serve the result from the cache,
// and then directly fetch the latest state from the server and update both the page and the cache
// with it. That way the App is (nearly) always consistent, but it also works smoothly in poor network conditions
// (and even offline with a limited feature set)
class FullResultCache extends ApolloCache<NormalizedCacheObject> {
    // ----------- Cache -----------------

    private cache: Map</* Query Name */ string, FullResult> = new Map();
    private watchers = new Map</* Query Name */ string, Watcher[]>();

    /* Extracts the name of a Query - query <name> { ... }
     * This should be unique anyways as it is also used to generate typescript types
     */
    private getQueryName(query: DataProxy.Query<any, any>): string | undefined {
        if (!query.query) {
            return undefined;
        }

        if (query.query.definitions.length !== 1) {
            return undefined;
        }

        const definition = query.query.definitions[0];
        if (definition.kind !== Kind.OPERATION_DEFINITION) {
            return undefined;
        }

        const name = definition.name?.value;
        if (name?.includes('NO_CACHE')) {
            return undefined;
        }

        return name;
    }

    /* Reads an entry from the cache */
    private getEntry(query: DataProxy.Query<any, any>) {
        const name = this.getQueryName(query);
        if (!name) return undefined;
        const entry = this.cache.get(name);

        if (!entry) return undefined;

        if (JSON.stringify(query.variables) === entry.variables) {
            log('GraphQL Cache', `Read ${name} from cache`, entry);
            return entry;
        } else {
            this.cache.delete(name);
            log('GraphQL Cache', `Invalidating Cache entry for ${name} as variables changed`, entry);
        }

        return undefined;
    }

    /* Writes an entry to the cache */
    private setEntry(query: DataProxy.Query<any, any>, result: any) {
        const name = this.getQueryName(query);
        if (!name) return;

        const existingEntry = this.getEntry(query);
        if (!existingEntry) {
            this.cache.set(name, {
                data: result,
                variables: JSON.stringify(query.variables ?? {}),
            });
            log('GraphQL Cache', `Write ${name} to new Cache Entry`, result);
        } else {
            existingEntry.data = result;
            log('GraphQL Cache', `Write ${name} to existing Cache Entry`, result);
        }
        this.watchers.get(name)?.forEach((watcher) => watcher());
    }

    // ----------- ApolloCache Interface --------------

    read<TData = any, TVariables = any>(query: Cache.ReadOptions<TVariables, TData>): TData | null {
        const entry = this.getEntry(query);
        return entry?.data;
    }

    write<TData = any, TVariables = any>(write: Cache.WriteOptions<TData, TVariables>): Reference | undefined {
        this.setEntry(write, write.result);
        return undefined;
    }

    diff<T>(query: Cache.DiffOptions<any, any>): DataProxy.DiffResult<T> {
        // As we only cache full results, diffing is easy:
        // Either the full result is in the cache, or it is not

        const entry = this.getEntry(query);
        if (entry) {
            return { complete: true, result: entry.data };
        }

        return {};
    }

    watch<TData = any, TVariables = any>(watch: Cache.WatchOptions<TData, TVariables>): () => void {
        const entry = this.getEntry(watch);
        const name = this.getQueryName(watch);

        const watcher = () => {
            log('GraphQL Cache', 'fire watcher');
            watch.callback(this.diff(watch));
        };

        if (entry) {
            log('GraphQL Cache', 'immediately fire watcher');
            watch.callback(this.diff(watch));
        }

        if (name) {
            log('GraphQL Cache', 'store watcher');
            this.watchers.set(name, this.watchers.get(name)?.concat(watcher) ?? []);
            return () => {
                const updatedWatchers = this.watchers.get(name)?.filter((it) => it !== watcher) ?? [];
                this.watchers.set(name, updatedWatchers);
                log('GraphQL Cache', 'detach watcher');
            };
        }

        return () => {};
    }

    reset(options?: Cache.ResetOptions | undefined): Promise<void> {
        this.cache.clear();
        return Promise.resolve();
    }

    extract(optimistic?: boolean | undefined): NormalizedCacheObject {
        return {
            queries: Object.fromEntries(this.cache.entries()),
        };
    }

    // --------- Not Really Implemented -------

    evict(options: Cache.EvictOptions): boolean {
        this.cache.clear();
        return true;
    }

    // Serialization of the Cache not supported (would be needed for persistence)
    restore(serializedState: NormalizedCacheObject): ApolloCache<NormalizedCacheObject> {
        throw new Error('Method not implemented.');
    }

    removeOptimistic(id: string): void {
        // throw new Error('Method not implemented.');
    }

    performTransaction(transaction: Transaction<NormalizedCacheObject>, optimisticId?: string | null | undefined): void {
        transaction(this);
    }
}

interface UserType {
    userID: string;
    firstname: string;
    lastname: string;
    email: string;
    pupil: {
        id: number;
        verifiedAt: Date | null;
    } | null;
    student: {
        id: number;
        verifiedAt: Date | null;
        hasDoneEthicsOnboarding?: boolean | null;
    } | null;
    screener: {
        id: number;
    } | null;
}

export type LFApollo = {
    // The Apollo Client to make requests with to the backend:
    client: ApolloClient<NormalizedCacheObject>;
    // Invalidated the device token, destroys the session and goes back to the start page
    logout: () => Promise<void>;
    // If we suspect that a backend mutation caused a change in user data or roles, we might want to refresh:
    refreshUser: () => void;

    loginWithPassword: (email: string, password: string, deviceId: string) => Promise<FetchResult>;

    loginWithSSO: (code: string) => Promise<void>;

    refreshSessionState: () => Promise<void>;

    sessionState: 'unknown' | 'logged-out' | 'logged-in' | 'error';
    // Once the session is 'logged-in', a query will be issued to determine the user session
    // When the query is finished, the user will be available:
    user: UserType | null;

    roles: Role[];
};

// Unlike the standard ApolloProvider, this context carries additional properties
//  for managing the session
export const ExtendedApolloContext = createContext<LFApollo | null>(null);

export const LFApolloProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const context = useApolloInternal();

    return (
        <ExtendedApolloContext.Provider value={context}>
            <ApolloProvider client={context.client}>{children}</ApolloProvider>
        </ExtendedApolloContext.Provider>
    );
};

// Sometimes Support / Tech-Team logs in on behalf of other users,
//  in that case we do not want to create persistent sessions but use a temporary session instead
// By storing the credentials in sessionStorage instead, reloading the tab will remove the session,
//  and opening a new page will log in again with the default account
const { searchParams } = new URL(window.location.href);
const TEMPORARY_LOGIN = searchParams.has('temporary');

const STORAGE = TEMPORARY_LOGIN ? sessionStorage : localStorage;

// -------------- Global User State -------------------
// ----- Session Token ---------------------
//  Authenticates the user during a session
export const getSessionToken = () => {
    const token = STORAGE.getItem('lernfair:token');
    if (token) return token;

    return refreshSessionToken();
};

const refreshSessionToken = () => {
    let tok = Utility.createToken();
    STORAGE.setItem('lernfair:token', tok);
    datadogRum.setGlobalContextProperty('sessionToken', tok);
    return tok;
};

const clearSessionToken = () => {
    STORAGE.removeItem('lernfair:token');
};

// ----- Device Token -----------------------
// The session token stored in lernfair:token is short lived (a day or so)
//  and might be invalidated when the backend restarts. To maintain permanent
//  user sessions, users can create long lived tokens with which they can log in
// Users can create and delete these tokens as they want (e.g. logout from a certain device)

const getDeviceToken = () => STORAGE.getItem('lernfair:device-token');
const setDeviceToken = (token: string) => STORAGE.setItem('lernfair:device-token', token);
const clearDeviceToken = () => STORAGE.removeItem('lernfair:device-token');

// ----- Device ID --------------------------
// The device ID is a permanent identifier for a device, it is used to identify
//  the device across sessions and to revoke all sessions created by a device
export const getDeviceId = () => STORAGE.getItem('lernfair:device-id');
const setDeviceId = (id: string) => STORAGE.setItem('lernfair:device-id', id);
export const getOrCreateDeviceId = () => {
    const existing = getDeviceId();
    if (existing) return existing;

    const deviceId = crypto.randomUUID();
    setDeviceId(deviceId);
    log('GraphQL', 'created device id');
    return deviceId;
};

// ---------------- Custom ApolloLink For Request Logging -------
class RequestLoggerLink extends ApolloLink {
    request(operation: Operation, forward?: NextLink | undefined) {
        const queryName = operation.operationName;
        const variableNames = Object.keys(operation.variables);
        let serializedVariables = 'REDACTED';
        if (['token', 'password', 'authToken', 'legacyToken'].every((it) => !variableNames.includes(it))) {
            serializedVariables = JSON.stringify(operation.variables, null, 2);
        }
        log('GraphQL Query', `running operation: ${queryName} variables: ${serializedVariables}`, operation);
        const chain = forward!(operation);

        return chain.map((response: FetchResult) => {
            if (response.errors) {
                log('GraphQL Query', `operation finished with errors: ${queryName}, errors: ${JSON.stringify(response.errors, null, 2)}`, response);
            } else {
                log('GraphQL Query', `operation finished with success: ${queryName}`, response);
            }
            return response;
        });
    }
}

// ---------------- Custom ApolloLink Error Handling with Retry -------
// When a query fails because it is UNAUTHORIZED,
//  try to log in with the device token, then retry the query
type SomeFetchResult = FetchResult<Record<string, any>, Record<string, any>, Record<string, any>>;

class RetryOnUnauthorizedLink extends ApolloLink {
    constructor(public readonly onMissingAuth: () => void) {
        super();
    }

    request(operation: Operation, forward?: NextLink | undefined) {
        if (operation.getContext().skipAuthRetry) {
            debug('GraphQL AuthRetry', 'skipped operation', operation);
            return forward!(operation);
        }

        return new Observable<SomeFetchResult>((observer) => {
            const nextChain = forward!(operation);
            let deferred = false;

            nextChain.subscribe(
                (it) => {
                    if (it.errors?.length) {
                        const isAuthError = it.errors!.some((it) => it.extensions?.code === 'UNAUTHENTICATED');
                        if (isAuthError) {
                            if (!getDeviceToken()) {
                                log('GraphQL AuthRetry', 'authentication failure, no device token present');
                                this.onMissingAuth();
                                observer.next(it);
                                return;
                            }

                            log('GraphQL AuthRetry', 'authentication failure and device token present, try to login');
                            // We might recover by starting a new session with the device token?
                            const loginObserver = new Observable<SomeFetchResult>((it) => {
                                this.loginWithDeviceToken(forward!, it);
                            });

                            loginObserver.subscribe(
                                (result) => {
                                    if (result.errors) {
                                        log('GraphQL AuthRetry', 'Login with device token in retry failed, passing original error', result.errors);
                                        clearDeviceToken();
                                        this.onMissingAuth();
                                        observer.next(it);
                                        return;
                                    }
                                    log('GraphQL AuthRetry', 'Recovered session with device token, retrying query', operation);
                                    forward!(operation).subscribe(observer);
                                },
                                (error) => {
                                    log('GraphQL AuthRetry', 'Login with device token in retry failed, passing original error', error);
                                    clearDeviceToken();
                                    this.onMissingAuth();
                                    observer.next(it);
                                }
                            );

                            deferred = true;
                            return; // deferred execution to loginWithDeviceToken
                        }
                    }
                    // By default, pipe back to parent link:
                    observer.next(it);
                },
                (error) => {
                    if (!deferred) observer.error(error);
                },
                () => {
                    if (!deferred) observer.complete();
                }
            );
        });
    }

    async loginWithDeviceToken(forward: NextLink, observer: SubscriptionObserver<SomeFetchResult>) {
        debug('GraphQL AuthRetry', 'Login started');
        forward!(
            createOperation(
                {},
                {
                    query: LOGIN_WITH_DEVICE_TOKEN_MUTATION,
                    variables: { deviceToken: getDeviceToken(), deviceId: getOrCreateDeviceId() },
                }
            )
        ).subscribe(observer);
    }
}

function describeDevice() {
    const parsed = userAgentParser(window.navigator.userAgent);
    let type = 'desktop';
    if (window.innerWidth <= 768) {
        type = 'mobile';
    } else if (window.innerWidth <= 1024) {
        type = 'tablet';
    }
    return JSON.stringify({ browser: parsed.browser, device: parsed.device, os: parsed.os, type });
}

const useApolloInternal = () => {
    const [sessionState, setSessionState] = useState<LFApollo['sessionState']>('unknown');
    const [user, setUser] = useState<UserType | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);

    log('GraphQL', 'Refresh', { sessionState, user, roles });

    const onMissingAuth = useCallback(() => setSessionState('logged-out'), []);

    // -------------- Apollo Client -------------------------

    const client = useMemo(() => {
        const tokenLink = setContext((_, { headers }) => ({
            headers: {
                ...headers,
                authorization: `Bearer ${getSessionToken()}`,
            },
        }));

        const uriLink = new HttpLink({
            uri: BACKEND_URL + '/apollo',
        });

        const cacheConfig = RESULT_CACHE_ACTIVE
            ? ({
                  cache: new FullResultCache(),
                  defaultOptions: {
                      watchQuery: {
                          // Cache everything locally, when a query is executed,
                          // first serve from cache, then update with live data
                          // This should provide a smoother user experience
                          // while keeping inconsistencies low
                          fetchPolicy: 'cache-and-network',
                      },
                  },
              } as const)
            : { cache: new InMemoryCache() };

        return new ApolloClient({
            // Allow the GraphQL Browser Addon to connect:
            connectToDevTools: true,
            ...cacheConfig,
            link: from([new RequestLoggerLink(), new RetryOnUnauthorizedLink(onMissingAuth), tokenLink, uriLink]),
        });
    }, [onMissingAuth]);

    // ------------ Device Token ----------------------------
    // The device token is used by the RetryOnUnauthorizedLink
    //  if authentication fails. If we have a valid user session
    //  and no device token, then it makes sense to create one,
    //  so that when the session is invalidated, we can log in
    //  again using the device token
    const createDeviceToken = useCallback(
        async (deviceId: string) => {
            if (getDeviceToken()) return;

            const { searchParams } = new URL(window.location.href);
            if (TEMPORARY_LOGIN) {
                log('GraphQL', 'Device token was not created as disabled via query parameter');
                return;
            }

            log('GraphQL', 'Creating device token with description: ' + describeDevice());
            const result = await client.mutate({
                mutation: gql(`
        mutation CreateDeviceToken($description: String!, $deviceId: String!) {
          tokenCreate(description: $description, deviceId: $deviceId)
        }
      `),
                variables: { description: describeDevice(), deviceId },
                context: { skipAuthRetry: true },
            });

            if (result.errors?.length) {
                throw new Error(`Errors during device token creation`);
            }

            const deviceToken = result.data!.tokenCreate;
            setDeviceToken(deviceToken);
            log('GraphQL', 'created device token');
            return deviceToken;
        },
        [client]
    );

    const loginWithDeviceToken = useCallback(
        async (deviceToken: string, deviceId: string) => {
            log('GraphQL', 'device token present, trying to log in');
            try {
                const res = await client.mutate({
                    mutation: LOGIN_WITH_DEVICE_TOKEN_MUTATION,
                    variables: { deviceToken, deviceId },
                    context: { skipAuthRetry: true },
                });

                log('GraphQL', 'successfully logged in with device token');
                setSessionState('logged-in');
                setUser(null); // refresh user information
                return res;
            } catch (error) {
                log('GraphQL', 'Failed to log in with device token', error);
                clearDeviceToken();
                setSessionState('logged-out');
                return;
            }
        },
        [client, setSessionState]
    );

    // ---------- Secret Token --------------------
    const loginWithSecretToken = useCallback(
        async (secretToken: string, deviceId: string) => {
            log('GraphQL', 'secret token present, trying to log in');
            try {
                const res = await client.mutate({
                    mutation: LOGIN_WITH_DEVICE_TOKEN_MUTATION,
                    variables: { deviceToken: secretToken, deviceId },
                    context: { skipAuthRetry: true },
                });

                log('GraphQL', 'successfully logged in with secret token');
                setSessionState('logged-in');
                setUser(null); // refresh user information
                createDeviceToken(deviceId); // fire and forget
                return res;
            } catch (error) {
                log('GraphQL', 'Failed to log in with secret token', error);
                setSessionState('error');
                return;
            }
        },
        [client, setSessionState, createDeviceToken]
    );

    // ----------- Determine User --------------------------
    const determineUser = useCallback(async () => {
        log('GraphQL', 'Begin Determining User');

        const {
            data: { me, myRoles },
            error,
        } = await client.query({
            query: gql(`
        query GetUser {
          me {
            userID
            firstname
            lastname
            email
            pupil { id verifiedAt }
            student { id verifiedAt hasDoneEthicsOnboarding}
            screener { id }
          }
          myRoles
        }
      `),
            context: { skipAuthRetry: true },
            fetchPolicy: 'network-only',
        });
        log('GraphQL', 'Determined User', me);

        if (error) throw new Error(`Failed to determine user: ${error.message}`);
        setUser(me as UserType);
        setRoles(myRoles as Role[]);
        return { user: me as UserType, roles: myRoles as Role[] };
    }, [client, setUser, setRoles]);

    // ----------- Refresh Session State --------------------------
    const refreshSessionState = useCallback(async () => {
        const res = await determineUser();
        if (res.roles.includes('USER')) {
            setSessionState('logged-in');
        }
        if (res.roles.includes('SSO_REGISTERING_USER')) {
            setSessionState('logged-out');
        }
    }, [determineUser]);

    // If the session is present and the user is not yet determined
    // Trigger the user query
    useEffect(() => {
        if (sessionState !== 'logged-in') return;
        if (user) return;
        determineUser(); // fire and forget
    }, [sessionState, user, determineUser]);

    // ----------- Session Initialization ------------------
    useEffect(() => {
        log('GraphQL', 'Determining Session');
        (async function () {
            const { searchParams, pathname } = new URL(window.location.href);
            const deviceToken = getDeviceToken();
            // TODO: remove one option after mailjet templates have been updated
            const secretToken = searchParams.get('secret_token') ?? searchParams.get('token');

            // verify-email and verify-email-change
            if (pathname.includes('verify-email')) {
                // The E-Mail Verification flow is special: The user already has a session with an unverified account,
                //  we MUST reauthenticate to use the secret token that proves that the user has access to the email.
                //   and we also want to refresh the user session
                // Otherwise we redirect them to the next page with an unverified session, and that page tells the user to verify their account (they get stuck in a loop)
                if (!secretToken) {
                    log('GraphQL', 'No Secret Token present on E-Mail Verification Page, that is an error');
                    setSessionState('error');
                    return;
                }

                log('GraphQL', 'User visits email verification, forcing the usage of secret token');
                await loginWithSecretToken(secretToken, getOrCreateDeviceId());
                return;
            }

            // Maybe the session already works?
            try {
                await refreshSessionState();
                return;
            } catch (error) {
                log('GraphQL', 'Could not query user, need to log in');
            }

            // If not, log in using the various methods
            if (deviceToken) {
                await loginWithDeviceToken(deviceToken, getOrCreateDeviceId());
                return;
            }

            if (secretToken) {
                await loginWithSecretToken(secretToken, getOrCreateDeviceId());
                return;
            }

            setSessionState('error');
            log('GraphQL', 'No Device Token present, need to log in again');
        })();
    }, [client, loginWithDeviceToken, determineUser]);

    // ------------ Logout --------------------------

    const logout = useCallback(async () => {
        if (getDeviceToken()) {
            log('GraphQL', 'Revoking device token for logout');
            try {
                await client.mutate({
                    mutation: gql(`
          mutation RevokeToken($deviceToken: String!) {
            tokenRevoke(token: $deviceToken, invalidateSessions: false)
          }
        `),
                    variables: { deviceToken: getDeviceToken()! },
                    context: { skipAuthRetry: true },
                });
            } catch (error) {
                log('GraphQL', 'Failed to revoke device token, probably it was already revoked', error);
            }
            clearDeviceToken();
            log('GraphQL', 'Revoked device token');
        }

        log('GraphQL', 'Logging out');
        try {
            await client.mutate({
                mutation: gql(`
          mutation Logout {
            logout
          }
        `),
                context: { skipAuthRetry: true },
            });
        } catch (error) {
            log('GraphQL', 'Failed to log out, probably the session already expired', error);
        }
        refreshSessionToken();
        setSessionState('logged-out');
        log('GraphQL', 'Logged out');
    }, [client]);

    // ------------ Login with password -------------
    const loginWithPassword = useCallback(
        async (email: string, password: string, deviceId: string): Promise<FetchResult> => {
            log('GraphQL', 'Logging in with email and password');

            const result = await client.mutate({
                mutation: gql(
                    `mutation login($password: String!, $email: String!, $deviceId: String!) { loginPassword(password: $password, email: $email, deviceId: $deviceId) }`
                ),
                variables: {
                    email: email,
                    password: password,
                    deviceId,
                },
                errorPolicy: 'all',
                context: { skipAuthRetry: true },
            });

            // Successful login
            if (result.data) {
                log('GraphQL', 'Logged in successfully');
                setSessionState('logged-in');
                setUser(null); // refresh user information
                createDeviceToken(deviceId); // fire and forget
            }

            return result;
        },
        [client]
    );

    // ------------ Login with SSO -------------
    const loginWithSSO = useCallback(
        async (code: string) => {
            log('GraphQL', 'Logging in with SSO');
            const LOGIN_WITH_SSO_MUTATION = gql(`
            mutation MutationLoginWithSSO($code: String!, $referrer: String!) {
                loginWithSSO(code: $code, referrer: $referrer)
            }
        `);
            const { data } = await client.mutate({ mutation: LOGIN_WITH_SSO_MUTATION, variables: { code, referrer: document.referrer } });
            const result = data?.loginWithSSO;
            if (result && ['register', 'success'].includes(result)) {
                determineUser();
                if (result === 'success') {
                    log('GraphQL', 'Logged in successfully');
                    setSessionState('logged-in');
                }
            }
        },
        [client]
    );

    return useMemo(
        () => ({ client, logout, sessionState, user, loginWithPassword, loginWithSSO, refreshUser: determineUser, refreshSessionState, roles }),
        [client, logout, user, sessionState, loginWithPassword, loginWithSSO, determineUser, refreshSessionState, roles]
    );
};

const useApollo = () => useContext(ExtendedApolloContext)!;
export const useUser = () => useContext(ExtendedApolloContext)!.user!;
export const useRoles = () => useContext(ExtendedApolloContext)!.roles!;
export const useUserType = () => {
    const { user } = useContext(ExtendedApolloContext)!;
    if (user?.pupil) return 'pupil';
    if (user?.student) return 'student';
    if (user?.screener) return 'screener';

    throw new Error(`useUserType cannot determine user`);
};

export const useUserAuth = () => {
    const { sessionState, user } = useContext(ExtendedApolloContext)!;
    return { sessionState, userId: user?.userID, user: user };
};

export default useApollo;
