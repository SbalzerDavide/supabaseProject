<template>
  <div id="app">
    <!-- questa pagina funge da middleware per fare il redirect a seconda che si ao meno loggato -->
    <div v-show="loader" class="loader">
      <div class="spinner"></div>
      <font-awesome-icon icon="fa-solid fa-circle-notch" />

    </div>
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
      loader: false,
    }
  },
  created(){
    // aggiungere logica che calcola il tema rispetto al default di sistema
    document.body.classList.add(`theme-light`);
    window.addEventListener("changeLoader", this.changeLoader)
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
  destroyed(){
    window.removeEventListener("changeLoader",this.changeLoader)
  },
  methods:{
    changeLoader(e){
      this.loader = e.detail.loader;
    },
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
  .loader{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba($color: #000000, $alpha: .3);
    z-index: 5;
    svg{
      width: 40px;
      height: 40px;
      color: var(--primary-color);
      animation: load 1s linear infinite;
    }
  }

  /* The element to apply the animation to */
  @keyframes load{
    0% {transform: rotate(0);}
    50% {transform: rotate(180deg);}
    100% {transform: rotate(360deg);}
  }
</style>
