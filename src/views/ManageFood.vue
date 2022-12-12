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
        :class="activePanel == 'new' ? 'active' : ''"
        @click="goTo('new')"
      >
        <font-awesome-icon icon="fa-solid fa-plus" />
      </div>
      <div 
        class="app-navigazione-element d-flex"
        :class="activePanel == 'storagelist' ? 'active' : ''"
        @click="goTo('storagelist')"
      >
        <font-awesome-icon icon="fa-solid fa-box" />
      </div>
      <div 
        class="app-navigazione-element d-flex"
        :class="activePanel == 'shoppinglist' ? 'active' : ''"
        @click="goTo('shoppinglist')"
      >
        <font-awesome-icon icon="fa-solid fa-cart-shopping" />
      </div>
      <div 
        class="app-navigazione-element d-flex"
        :class="activePanel == 'garbagelist' ? 'active' : ''"
        @click="goTo('garbagelist')"
      >
        <font-awesome-icon icon="fa-solid fa-trash" />
      </div>
      <div class="app-navigazione-element d-flex">
        <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />      
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
      default: "storagelist",
      activePanel: ""
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
      this.activePanel = this.default;
      this.goTo(this.default)
    }

  },
  updated(){
    console.log("updated");
    let path = window.location.href;
    this.activePanel = path.split("/")[path.split("/").length - 1];
  },  
  methods:{
    goTo(name){
      if(!window.location.href.endsWith(name)){
        this.$router.push({ path: `/home/manageFood/${name}` });
      }
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
      left: 0;
      width: 100%;
      height: 60px;
      padding: 0 12px;
      background-color: var(--background-primary);
      align-self: flex-end;
      justify-content: space-between;
      .app-navigazione-element{
        justify-content: center;
        align-items: center;
        color: var(--opacity-text);
        cursor: pointer;
        transition: all .2s;
        &.active{
          color: var(--text-color);
          transform: scale(1.1);
        }
        svg{
          font-size: 28px;
          padding: 0 8px;
        }
      }
    }
  }
</style>
