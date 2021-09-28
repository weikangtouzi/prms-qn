import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from 'apollo-link-context'
import { createApolloProvider } from '@vue/apollo-option'
import '@/common/stylus/reset.styl'

// 与 API 的 HTTP 连接
const httpLink = createHttpLink({
  // 你需要在这里使用绝对路径
  uri: 'http://dev.chenzaozhao.com:4000/graphql'
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('phone')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token || ''
    }
  }
})

// 缓存实现
const cache = new InMemoryCache()

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink as any) as any,
  cache
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient
})

createApp(App).use(store).use(router).use(apolloProvider).mount('#app')
