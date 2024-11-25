import 'virtual:windi.css'
import { createApp } from 'vue'
import App from './App'
import router from './router'
import './styles/index.css'

createApp(App).use(router).mount('#app')
