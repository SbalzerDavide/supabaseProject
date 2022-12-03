<template>
  <div id="dashboard">
    <div class="container d-flex">
      <div 
        class="app" 
        v-for="(app, index) in appList" 
        :key="index"
        @click="goTo(app.value)"
      >
        {{ app.title }}
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
          value: "notes"
        },
        {
          title: "organizza cibo",
          value: "manageFood"
        },
        {
          title: "turni",
          value: "manageShift"
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
      width: 100%;
      padding: 10px;
      cursor: pointer;
      // per adesos gestico colore in questo modo semplificato, ma da rivedere
      &:hover{
        background-color: var(--background-hover);
      }
    }
  }

</style>
