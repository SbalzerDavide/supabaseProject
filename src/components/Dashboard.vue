<template>
  <div id="dashboard">
    <div class="container d-flex">
      <div 
        class="app" 
        v-for="(app, index) in appList" 
        :key="index"
        @click="goTo(app.value)"
      >
      <div class="icon">
        <font-awesome-icon :icon="app.icon" />
      </div>
      <div class="title">
        {{ app.title }}
      </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { supabase } from "../supabase.js";



export default {
  name: 'App',
  data(){
    return{
      appList: [
        {
          title: "note",
          value: "notes/list",
          icon: "fa-solid fa-clipboard"
        },
        {
          title: "organizza cibo",
          value: "manageFood",
          icon: "fa-solid fa-burger"
        },
        {
          title: "turni",
          value: "manageShift",
          icon: "fa-solid fa-calendar"
        },
      ],
    }
  },
  mounted(){
  },
  methods:{
    goTo(name){
      this.$emit("firstPageEvent", false);
      this.$router.push({ path: `/home/${name}` });
    },
  }
}
</script>

<style lang="scss">
  #dashboard{
    .container{
      flex-wrap: wrap;
    }
    .app{
      display: flex;
      width: 100%;
      height: 60px;
      border-radius: var(--border-radius);
      border-radius: 10px;
      background-color: var(--background-hover);
      margin: 8px;
      overflow: hidden;
      cursor: pointer;
      .icon{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70px;
        // background-color: var(--color-3);
        background-color: var(--primary-color);
        svg{
          height: 28px;
          & *{
            // color: #222 !important;
            color: #eee !important;
          }
        }
      }
      .title{
        padding: 0 10px;
        display: flex;
        align-items: center;
      }
    }
  }

</style>
