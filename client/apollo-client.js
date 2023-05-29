import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { getStoredCookie } from "./utils/manageCookie";

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:56895/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = getStoredCookie("token") || null

  return {
    headers: {
      ...headers,
      authorization: token,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),

});

export default client;
