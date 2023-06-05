import { createApp } from 'vue'
import App from './App.vue'
import router from './routers.js'
import store from './store/index.js'
import httpInterceptor from './interceptor/interceptor.js'
// Vuetify
import vuetify1 from './plugins/vuetify.js'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives
})

const app = createApp(App)

app.use(vuetify)
app.use(vuetify1)

app.use(router)

app.use(store)

httpInterceptor()

app.mount('#app')
