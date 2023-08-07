<template>
  <div class="app-bar">
    <div class="container d-flex">
      <div class="left d-flex">
        <!-- <font-awesome-icon @click="goHome" icon="fa-solid fa-house" />
        <ThemeSwitch /> -->
        <div class="title">
          {{ title }}
        </div>
      </div>

      <div class="right">
        <!-- <font-awesome-icon @click="logout" icon="fa-solid fa-right-from-bracket" /> -->
        <font-awesome-icon @click="goToSettings" icon="fa-solid fa-cog" />
        
      </div>


    </div>
  </div>
</template>

<script>
import { supabase } from "../supabase.js";
// import ThemeSwitch from "../components/ThemeSwitch.vue";



export default {
  name: 'AppBar',
  components: {
    // ThemeSwitch
  },
  props: {
  },
  data(){
    return{
      title: ""
    }
  },
  created(){
    window.addEventListener("setAppbarTitle", this.setAppbarTitle)
  },
  methods:{
    setAppbarTitle(e){
      if("title" in e.detail){
        this.title = e.detail.title
      }
    },
    goToSettings(){
      this.$router.push({name: "Settings"});
    },
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
    z-index: 3;
    top: 0;
    width: 100vw;
    height: 60px;
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
      .change-theme{
        margin-left: 16px;
      }
    }
  }

</style>
