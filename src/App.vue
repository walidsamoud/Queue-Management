<template>
  <div id="app">
    <Loader />
    <router-view></router-view>
  </div>
</template>

<script>
import themeConfig from '@/../themeConfig.js'
import Loader from './components/Loader/Loader.vue'

export default {
  name: 'app',
  components: {
    Loader
  },
  data:()=>({
    ip: ""
  }),
  methods: {
        toggleBodyClass(className) {
            if (className == 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
                
            }
        },
    },
  
mounted() {
  this.toggleBodyClass(themeConfig.theme)
},



}
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #555;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--primary);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}
.spin-icon{
  animation: spinner 1s linear infinite;
}
</style>