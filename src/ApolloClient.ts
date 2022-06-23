import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
  uri: process.env.REACT_APP_APOLLO_CLIENT_URI,
  cache: new InMemoryCache()
})

export const GET_ME = client.query({
  query: gql`
    query /me {
      firstname
      lastname
    }
  `
})

export default client
