<template>
  <div class="app-bar">
    <div class="container d-flex">
      <h1>sono app bar</h1>

      <button class="btn logout" @click="logout">Logout</button>


    </div>
    <ThemeSwitch />
  </div>
</template>

<script>
import { supabase } from "../supabase.js";
import ThemeSwitch from "../components/ThemeSwitch.vue";



export default {
  name: 'AppBar',
  components: {
    ThemeSwitch
  },
  props: {
  },
  data(){
    return{
    }
  },
  created(){
  },
  methods:{
    logout(){
      let vue = this;
      supabase.auth.signOut()
        .then(()=>{
          vue.$router.push({ name: 'App', params: {} })
        })
        .catch((error)=>{
          console.log(error);
        })
    },
  }
}
</script>

<style lang="scss">
  .app-bar{
    position: fixed;
    top: 0;
    width: 100vw;
    height: 80px;
    background-color: var(--background-primary);
    .container{
      max-width: 1200px;
      height: 100%;
      margin: 0 auto;
      // display: flex;
      align-items: center;
    }
  }

</style>
