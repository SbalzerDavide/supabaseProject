<template>
  <div class="settings">
    <div class="app-bar">
      <div class="container d-flex">
        <div class="left d-flex">
          <font-awesome-icon @click="goBack" icon="fa-solid fa-arrow-left" />
          <div class="title">
            Impostazioni
          </div>          
        </div>
        <div class="right">
        </div>
      </div>
    </div>

    <div v-if="!subroute">      
      <div class="theme">
        <ThemeSwitch />
      </div>
      <AccountMoreInfo v-if="showMoreInfo" @closeMoreInfo="closeMoreInfo"/>
      <ul v-if="!demo">
        <li @click="goTo('share')">
          <div class="setting-title">Condividi lista della spesa</div>
          <div class="setting-action"></div>
        </li>
        <li>
          <div class="setting-title">Gestisci applicazioni</div>
          <div class="setting-action"></div>
        </li>
        <li @click="logout">
          <div class="setting-title">Logout</div>
          <div class="setting-action">
            <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { supabase } from "../supabase.js";
import AccountMoreInfo from "../components/AccountMoreInfo.vue";
import ThemeSwitch from "../components/ThemeSwitch.vue";




export default {

  name: 'Settings',
  components: {
    AccountMoreInfo,
    ThemeSwitch
  },
  data(){
    return{
      showMoreInfo: false,
      subroute: false,
      demo: false
    }
  },
  created(){
    if(window.foodManagerDemo){
      this.demo = true;
    }
  },
  updated(){
    if(window.location.href.endsWith("settings")){
      this.subroute = false;
    } else{
      this.subroute = true;
    }
  },
  methods:{
    goTo(path){
      this.subroute = true;
      this.$router.push(`settings/${path}`)
    },
    goBack(){
      this.$router.go(-1)
    },
    closeMoreInfo(e){
      console.log(e);
      if(e){
        this.showMoreInfo = false; 
      }
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
  .settings{
    margin-top: 60px;   
    padding: 10px;
    display: flex;
    flex-direction: column;
    .theme{
      display: flex;
      justify-content: flex-end;
      margin: 10px 0;
    }
    li{
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      background-color: var(--background-hover);
      padding: 10px;
      border-radius: var(--border-radius);
      cursor: pointer;
    }
    .app-bar{
      position: fixed;
      z-index: 3;
      top: 0;
      left: 0;
      width: 100vw;
      height: 60px;
      background-color: var(--background-primary);
      .container{
        justify-content: space-between;
        max-width: 1200px;
        height: 100%;
        margin: 0 auto;
        padding: 0 20px;
        align-items: center;
        .left{
          display: flex;
          align-items: center;
          .title{
            margin-left: 30px;
            font-size: 24px;
          }
        }
        svg{
          height: 35px;
          cursor: pointer;
        }
      }
    }
  }
</style>
