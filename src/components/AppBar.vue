<template>
  <div class="app-bar">
    <div class="container d-flex">
      <!-- <h1 @click="goHome">sono app bar</h1> -->
      <font-awesome-icon @click="goHome" icon="fa-solid fa-house" />

      <!-- <button class="btn logout" @click="logout">Logout</button> -->
      <font-awesome-icon @click="logout" icon="fa-solid fa-right-from-bracket" />


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
    goHome(){
      this.$router.push({name: "App"})
    },
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
      justify-content: space-between;
      max-width: 1200px;
      height: 100%;
      margin: 0 auto;
      padding: 0 20px;
      // display: flex;
      align-items: center;
      svg{
        height: 35px;
        cursor: pointer;
      }
      button{
        margin-left: 20px;
      }
    }
  }

</style>
