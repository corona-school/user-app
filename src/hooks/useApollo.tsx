import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
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

  const tokenLink = setContext((_, { headers }) => {
    let token = localStorage.getItem('lernfair:token')
    if (!token) {
      token = createToken()
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const uriLink = new HttpLink({
    uri: process.env.REACT_APP_APOLLO_CLIENT_URI + '/apollo'
  })

  const client = useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        link: from([tokenLink, uriLink])
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
