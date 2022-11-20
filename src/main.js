import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'

// import { supabase } from "../supabase";

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons'
// import { faEye } from '@fortawesome/free-solid-svg-icons'
// import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'
// import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
// import { faXmark, faTrash } from '@fortawesome/free-solid-svg-icons'
// import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
// import { faRefrigerator } from '@fortawesome/free-solid-svg-icons'
// import { faSnowflake, faCartShopping } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
// library.add(faEye, faEyeSlash, faMoon, faSun, faXmark, faPlus, faMinus, faTrash, faRefrigerator, faSnowflake, faCartShopping)

library.add(fas)
/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)


Vue.config.productionTip = false

new Vue({
  // supabase,
  router,
  render: h => h(App),
}).$mount('#app')
