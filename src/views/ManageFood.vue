<template>
  <div class="food-app d-flex flex-direction-column flex-grow">
    <div class="inside-app d-flex flex-direction-column flex-grow">
      <!-- <div class="title">
        <h2>food</h2>
      </div> -->
      <router-view>

      </router-view>

    </div>
    <div class="app-navigation d-flex">
      <div 
        class="app-navigazione-element d-flex"
        @click="goTo('new')"
      >
        <font-awesome-icon icon="fa-solid fa-plus" />
      </div>
      <div 
        class="app-navigazione-element d-flex"
        @click="goTo('refrigerator')"
      >
        <!-- refrigerator per qualche motivo non funziona -->
        <!-- <font-awesome-icon icon="fa-solid fa-refrigerator" /> -->
        <font-awesome-icon icon="fa-solid fa-box" />
      </div>
      <div 
        class="app-navigazione-element d-flex"
        @click="goTo('freezer')"
      >
        <font-awesome-icon icon="fa-solid fa-snowflake" /> 
      </div>
      <div 
        class="app-navigazione-element d-flex"
        @click="goTo('list')"
      >
        <font-awesome-icon icon="fa-solid fa-cart-shopping" />
      </div>
    </div>
  </div>
</template>

<script>
// import { supabase } from "../supabase.js";


export default {
  name: 'ManageFood',
  components: {
  },
  props: {
  },
  data(){
    return{
      user: {},
      main: true,
      default: "new"
    }
  },
  created(){
    let stringUserData = window.sessionStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    if(!window.location.href.endsWith("manageFood")){
      this.main = false;
    }
    if(this.default !==""){
      this.goTo(this.default)
    }

  },
  methods:{
    goTo(name){
      this.$router.push({ path: `/home/manageFood/${name}` });
    },
  }
}
</script>

<style lang="scss">
  .food-app{
    .inside-app{
      margin-bottom: 60px;
    }
    .app-navigation{
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 60px;
      padding: 0 12px;
      background-color: var(--background-primary);
      align-self: flex-end;
      justify-content: space-between;
      .app-navigazione-element{
        justify-content: center;
        align-items: center;
        cursor: pointer;
        svg{
          font-size: 28px;
        }
      }
    }
  }
</style>
