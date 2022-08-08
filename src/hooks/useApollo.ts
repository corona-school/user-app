import { ApolloClient, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useMemo, useState } from 'react'
import Utility from '../Utility'

const useApollo = () => {
  const [token, setToken] = useState(localStorage.getItem('lernfair:token'))

  const tokenLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('lernfair:token')
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const client = useMemo(
    () =>
      new ApolloClient({
        uri: process.env.REACT_APP_APOLLO_CLIENT_URI + '/apollo',
        cache: new InMemoryCache(),
        link: tokenLink
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const createToken = () => {
    let tok = Utility.createToken()
    setToken(tok)
    localStorage.setItem('lernfair:token', tok)
  }

  return { client, createToken, token }
}
export default useApollo
