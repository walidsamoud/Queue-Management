import Vue from 'vue'
import Vuesax from 'vuesax'
import Vuex from 'vuex'
import {ApiConfigs, authHeader} from './_helpers'
import JsonCSV from 'vue-json-csv'
import App from './App.vue'

// import Bugsnag from '@bugsnag/js'
// import BugsnagPluginVue from '@bugsnag/plugin-vue'
// Vue.prototype.$bugsnag = Bugsnag;
// Bugsnag.start({
//     apiKey: '603d8c3fed628eae61e68ec99ac95719',
//     plugins: [new BugsnagPluginVue()]
// });
// Bugsnag.getPlugin('vue')
//     .installVueErrorHandler(Vue)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faUser, faCaretDown, faBuilding, faCaretRight, faChevronLeft, faChevronRight, faClock, faMapMarker, faPhone, faSearch, faStar, faArrowLeft, faSpinner, faArrowRight, faBars, faMapMarkerAlt, faSignOutAlt, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faBuilding)
library.add(faPhone)
library.add(faMapMarker)
library.add(faSearch)
library.add(faChevronRight)
library.add(faChevronLeft)
library.add(faCaretRight)
library.add(faMapMarkerAlt)
library.add(faClock)
library.add(faStar)
library.add(faUser)
library.add(faArrowLeft)
library.add(faSearch)
library.add(faSpinner)
library.add(faCaretDown)
library.add(faCaretUp)
library.add(faArrowRight)
library.add(faBars)
library.add(faTimes)
library.add(faSignOutAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import 'vuesax/dist/vuesax.css' //Vuesax styles
import 'material-icons/iconfont/material-icons.css';
// Theme Configurations
import '../themeConfig.js'
// Perfectscrollbar
// import PerfectScrollbar from "vue2-perfect-scrollbar";
// import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
// Vue.use(PerfectScrollbar);
import Vuebar from 'vuebar';

//import promise
import 'es6-promise/auto';

import VueStepWizard from 'vue-step-wizard'
import 'vue-step-wizard/dist/vue-step-wizard.css'
Vue.use(VueStepWizard);
Vue.config.productionTip = false;

Vue.use(Vuesax);
Vue.use(Vuebar);
Vue.use(Vuex)
Vue.component('downloadCsv', JsonCSV)

// Theme Configurations
import 'prismjs'
import 'prismjs/themes/prism.css'
// i18n
import i18n from './i18n/i18n.js'
if(!localStorage.getItem('Language')) { localStorage.setItem('Language', 'fr') }
// Vue Router
import { router } from './_helpers';
Vue.config.productionTip = true;
//Vue.config.silent = true;

import VueTelInput from 'vue-tel-input'
 
Vue.use(VueTelInput)

// import * as VueGoogleMaps from 'vue2-google-maps'

const VueInputMask = require('vue-inputmask').default
Vue.use(VueInputMask)

import Multiselect from 'vue-multiselect'
Vue.component('multiselect', Multiselect)
require('vue-multiselect/dist/vue-multiselect.min.css')


import VueTour from 'vue-tour'
Vue.use(VueTour)
require('vue-tour/dist/vue-tour.css')

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
Vue.component("v-select", vSelect);


import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCCu5z_wOjyw1iBONIykXU8dms7RfOKwCQ",
    libraries: 'places',
  },
})

import CircularCountDownTimer from 'vue-circular-count-down-timer';
Vue.use(CircularCountDownTimer);

//Import config
// import Config from "./_configs/sodexo.json";
var Config = require("@config");

Vue.mixin({
  data:  function() {
    return {
      mixin: null,
      get Config() {
        this.mixin= Config;
        return this.mixin;
      }
    }
  }
});

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
import '@/assets/scss/style.scss'
if(i18n.locale=='ar'){
  require ('@/assets/scss/ar.scss');
}
// Moment
import moment from 'moment';
import 'moment-timezone';
moment.locale(i18n.locale == 'ar' ? 'ar-tn' : i18n.locale);
Vue.prototype.$moment = moment;

// import Pusher from 'pusher-js' // import Pusher
// Vue.prototype.$pusher = new Pusher(process.env.VUE_APP_PUSHER_ID, {
//         cluster: 'eu',
//         encrypted: true,
//         authEndpoint: ApiConfigs.broadcast_url+ApiConfigs.pusher.auth,
//         auth: {
//             headers: { ...authHeader() }
//         }
//     });

import VueFlags from "@growthbunker/vueflags";
Vue.use(VueFlags, {
    iconPath: '/images/flags/',
});

//Override Style Colors
let bodyStyles = document.body.style;
bodyStyles.setProperty('--special-font', Config.colors.special_font);

bodyStyles.setProperty('--primary', Config.colors.primary.default);
bodyStyles.setProperty('--primary-hover', Config.colors.primary.hover);
bodyStyles.setProperty('--primary-font', Config.colors.primary.font);

bodyStyles.setProperty('--secondary', Config.colors.secondary.default);
bodyStyles.setProperty('--secondary-hover', Config.colors.secondary.hover);
bodyStyles.setProperty('--secondary-font', Config.colors.secondary.font);

bodyStyles.setProperty('--success', Config.colors.success.default);
bodyStyles.setProperty('--success-hover', Config.colors.success.hover);
bodyStyles.setProperty('--success-font', Config.colors.success.font);

bodyStyles.setProperty('--danger', Config.colors.danger.default);
bodyStyles.setProperty('--danger-hover', Config.colors.danger.hover);
bodyStyles.setProperty('--danger-font', Config.colors.danger.font);

bodyStyles.setProperty('--info', Config.colors.info.default);
bodyStyles.setProperty('--info-hover', Config.colors.info.hover);
bodyStyles.setProperty('--info-font', Config.colors.info.font);

bodyStyles.setProperty('background', '#fff');
bodyStyles.setProperty('overflow', 'hidden');
bodyStyles.setProperty('position', 'relative');

//Load Favicon From Config
var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
}
link.href = Config.logo.favicon;

//Change Title From Config
document.title = Config.organization_name;