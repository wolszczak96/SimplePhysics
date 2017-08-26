import { ApolloClient, createNetworkInterface } from 'react-apollo'
import fetch from 'isomorphic-fetch'

let apolloClient = null

// don't really understend why do I have to do this
if (!process.browser) {
  global.fetch = fetch
}

const create = initialState => (
  new ApolloClient({
    initialState,
    ssrMode: !process.browser,
    networkInterface: createNetworkInterface({
      uri: 'https://api.graph.cool/simple/v1/cj3u3v4pwe96301544olfyfx5',
      opts: {
        credentials: 'same-origin' //what does it mean?
      }
    })
  })
)

export default initialState => {
  // why do I have to create new client every server-side request?
  if (!process.browser) {
    return create(initialState)
  }

  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}