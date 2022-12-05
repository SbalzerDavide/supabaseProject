<template>
  <div class="notes d-flex flex-direction-column flex-grow">
    <div class="title">
      <h2>notes</h2>
    </div>
    <div class="navigation-button d-flex">
      <button @click="goto('list')" class="btn">
        List
      </button>
      <button @click="goto('new')" class="btn btn-primary">
        <font-awesome-icon icon="fa-solid fa-plus" />
          Nuova nota
        </button>
    </div>
    <router-view></router-view>

  </div>
</template>

<script>
// import { supabase } from "../supabase.js";


export default {
  name: 'Notes',
  components: {
  },
  props: {
  },
  data(){
    return{
      user: {},
      notes: []
    }
  },
  created(){
    // let vue = this;
    let stringUserData = window.sessionStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
  },
  methods:{
    newNote(){
      this.$router.push({
        path:"/home/notes/new"
      })
    },
    goto(name){
      this.$router.push({ path: `/home/notes/${name}` });
    }

  }
}
</script>

<style lang="scss">
  .notes{
    padding: 12px;
    h2{
      padding: 10px 0;
      text-align: center;
    }
    .note{
      padding: 10px;
      cursor: pointer;
      &:hover{
        background-color: var(--background-hover);
      }
    }
    .navigation-button{
      justify-content: flex-end;
      button{
        margin-left: 10px;
        width: 150px;
        height: 50px;
      }
    }
  }

</style>
