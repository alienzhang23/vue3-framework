import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import API from '@/api/index' 
const app=createApp(App)
app.config.globalProperties.$API = API
app.use(store).use(router).use(ElementPlus).mount('#app')