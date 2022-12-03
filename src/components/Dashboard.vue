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
  <!-- <b-button v-b-modal.modal-1>Launch demo modal</b-button> -->
  <button @click="showModal" class="btn">apri modal</button>
  <b-modal ref="my-modal" id="modal" title="BootstrapVue">
    <p class="my-4">Hello from modal!</p>
  </b-modal>
  </div>
</template>

<script>
// import { supabase } from "../supabase.js";
// import { ModalPlugin } from 'bootstrap-vue'
import { BModal } from 'bootstrap-vue'



export default {
  name: 'App',
  components: {
    BModal,
  },
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
    showModal(){
      console.log("modal");
      this.$refs['my-modal'].show()
    },
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
