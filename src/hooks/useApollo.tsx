import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { ReactNode, useMemo, useState } from 'react'
import Utility from '../Utility'

export type LFApollo = {
  client: ApolloClient<NormalizedCacheObject>
  createToken: () => any
  clearToken: () => any
  token: string
}

export const LFApolloProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const { client } = useApollo()

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

const useApollo = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('lernfair:token')
  )

  const tokenLink = useMemo(
    () =>
      setContext((_, { headers }) => ({
        headers: {
          ...headers,
          authorization: `Bearer ${
            token || localStorage.getItem('lernfair:token')
          }`
        }
      })),

    [token]
  )

  const uriLink = new HttpLink({
    uri: process.env.REACT_APP_APOLLO_CLIENT_URI + '/apollo'
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        if (
          message ===
          "Access denied! You don't have permission for this action!"
        ) {
          // if message is basically a 401 Unauthorized then redirect to login
          // window.location.pathname = '/login'
        }
      })

    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const client = useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        link: from([errorLink, tokenLink, uriLink])
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const createToken = () => {
    let tok = Utility.createToken()
    setToken(tok)
    localStorage.setItem('lernfair:token', tok)
    return tok
  }

  const clearToken = () => {
    localStorage.removeItem('lernfair:token')
    setToken(null)
  }

  return { client, createToken, clearToken, token } as LFApollo
}
export default useApollo
