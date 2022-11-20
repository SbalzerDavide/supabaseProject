<template>
  <div id="app">
    <!-- questa pagina funge da middleware per fare il redirect a seconda che si ao meno loggato -->
    <router-view></router-view>
  </div>
</template>

<script>
import { supabase } from "./supabase.js";


export default {
  name: 'App',
  components: {
  },
  data(){
    return {
      session: null,
    }
  },
  created(){
    // aggiungere logica che calcola il tema rispetto al default di sistema
    document.body.classList.add(`theme-light`);
  },
  mounted(){
    console.log("fatto mounted");
    let vue = this;
    supabase.auth.getSession()
      .then(({ data }) => {
        console.log(data);
        vue.session = data.session;
      })
      .catch((err)=>{
        console.log(err);
      })
      .finally(()=>{
        console.log("finally");
        if(vue.session != null){
          vue.$router.push({ name: 'Home', params: {
            session: vue.session
          } })
        } else{
          // la soluzione è veramente quella di non mostrare l'errore?
          // vue.$router.push({ name: 'Login', params: {} }).catch(() => {});
          vue.$router.push({ name: 'Login', params: {} })
        }
      })
  },
  methods:{
    login(e){
      let vue = this;
      console.log("sono nell apgina home dopo login");
      if(e){
        console.log("sto effettuando get session");
        supabase.auth.getSession()
          .then(({ data }) => {
            console.log(data);
            vue.session = data.session;
          })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "./assets/main.scss";
  
</style>
