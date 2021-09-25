import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/common/stylus/reset.styl'

createApp(App).use(store).use(router).mount('#app')
