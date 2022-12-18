<template>
  <div id="home">
    <AppBar />

    <div class="work-area d-flex flex-direction-column">
      <!-- fare componente che gestisca l'aggiunta di questi dati mostrati all'occorrenza, quidi solo se non sono ancora stati impostati -->

      <AccountMoreInfo v-if="showMoreInfo" @closeMoreInfo="closeMoreInfo"/>

      <div v-if="firstPage">
        <Dashboard @firstPageEvent="firstPageEvent"/>
      </div>
      <div class="router-content d-flex flex-direction-column flex-grow" v-else>
        <router-view></router-view>
      </div>

    </div>

  </div>
</template>

<script>
import { supabase } from "../supabase.js";
import AccountMoreInfo from "../components/AccountMoreInfo.vue";
import AppBar from "../components/AppBar.vue";
import Dashboard from "../components/Dashboard.vue";



export default {
  name: 'App',
  components: {
    AccountMoreInfo,
    AppBar,
    Dashboard,
  },
  props: {
    session: Object
  },
  data(){
    return{
      firstPage: true,
      showMoreInfo: false,
    }
  },
  mounted(){
    this.getProfiles();
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  },
  methods:{
    getProfiles(){
      if(this.session){
        try {
          const { user } = this.session;
          let vue = this;
          supabase
            .from("profiles")
            .select(`username, website, avatar_url`)
            .eq('id', user.id)
            .single()
            .then((data)=>{
              let userData = data.data;
              userData.id = vue.session.user.id;
              userData.email = vue.session.user.email;
  
              window.sessionStorage.setItem("userData", JSON.stringify(userData));
            })
        } catch (error) {
          alert(error.message)
        }
      }
    },
    firstPageEvent(e){
      this.firstPage = e;
    },
    closeMoreInfo(e){
      console.log(e);
      if(e){
        this.showMoreInfo = false; 
      }
    }
  }
}
</script>

<style lang="scss">
  #app{
    background-color: var(--background);
    .work-area{
      margin: 80px auto 0 auto;
      max-width: 1200px;
      height: calc((var(--vh, 1vh) * 100) - 80px);
      // display: flex;
      // flex-direction: column;
      overflow: auto;
    }
    .account-more-info{
      margin: 12px;
    }
    .logout{
      width: 100px;
    }
    .router-content{
      // display: flex;
      // flex-direction: column;
      // flex-grow: 1;
    }
  }
</style>
