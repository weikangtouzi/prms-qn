import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'
import '@/common/stylus/reset.styl'

// 与 API 的 HTTP 连接
const httpLink = createHttpLink({
  // 你需要在这里使用绝对路径
  uri: 'http://dev.chenzaozhao.com:4000/'
})

// 缓存实现
const cache = new InMemoryCache()

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
  link: httpLink,
  cache
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient
})

createApp(App).use(store).use(router).use(apolloProvider).mount('#app')
