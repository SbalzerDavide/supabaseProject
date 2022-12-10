<template>
  <div class="notes d-flex flex-direction-column flex-grow">
    <!-- <div class="title">
      <h2>notes</h2>
    </div> -->
    <!-- <div class="navigation-button d-flex">
      <button @click="goto('list')" class="btn">
        List
      </button>
      <button @click="goto('new')" class="btn btn-primary add-new-note float">
        <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
    </div> -->
    <transition name="slide">
      <router-view class="view"/>
    </transition>

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
    if(window.location.href.endsWith("list")){
      this.showFloatNew = true;
    }
  },
  methods:{
    newNote(){
      this.$router.push({
        path:"/home/notes/new"
      })
    },
    goto(name){
      if(!window.location.href.endsWith(name)){
        this.$router.push({ path: `/home/notes/${name}` });
      }
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
      cursor: pointer;
      &:hover{
        background-color: var(--background-hover);
      }
    }
    .navigation-button{
      justify-content: space-between;
      button{
        margin-left: 10px;
        width: 44%;
        height: 50px;
      }
    }
  }
  .view{
    min-height: calc(100vh - 104px);
  }
  .slide-enter-active {
    transition: all .5s;
  }
  .slide-leave-active {
    transition: all .5s;
  }
  .slide-fade-enter, .slide-fade-leave-to{
    transform: translateX(100vw);
    // opacity: 0;
  }
</style>
