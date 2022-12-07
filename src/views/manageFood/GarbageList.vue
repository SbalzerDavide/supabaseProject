<template>
  <div class="shopping-list d-flex flex-direction-column flex-grow">
    <div class="header d-flex">
      <div class="d-flex">
        <h1>Garbage list</h1>
      </div>
    </div>
    <ul>
      <li 
        v-for="(food, index) in garbageList"
        :key="index"
        class="d-flex"
      >
      <div class="d-flex">
        <div class="number">
          {{ index }}
        </div>
        <div class="name">
          {{ food.name }}
        </div>
      </div>
      <div class="date">
        {{ food.garbageDate }}
      </div>      
      </li>
    </ul>
  </div>
</template>

<script>
import { supabase } from '../../supabase';
import loaderMixin from "../../mixins/loaderMixin.js"

export default {
  name: 'ShoppingList',
  mixins: [loaderMixin],
  components: {
  },
  props: {
  },
  data(){
    return{
      user: {},
      garbageList: []
    }
  },
  created(){
    let stringUserData = window.sessionStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    let vue = this;
    this.changeLoader(true);
    this.getGarbageList().then((data)=>{
      this.changeLoader(false);
      vue.garbageList = data;
      vue.garbageList.forEach(el=>{
        el.selected = false;
      })
    })
  },
  methods:{
    getGarbageList(){
      return new Promise((resolve, reject)=>{
        let vue = this;
        supabase
          .from("food")
          .select()
          .eq('user_id', vue.user.id)
          .eq('garbage', true)
          .order("garbageDate")
          .then((data)=>{
            resolve(data.data);
          })
          .catch((err)=>{
            reject(err);
          })
      })
    },

  }
}
</script>

<style lang="scss">
  .shopping-list{
    .header{
      justify-content: space-between;
      padding: 0 12px;
    }
    li{
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      div{
        align-items: center;
      }
      .number{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        margin-right: 8px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: var(--color-3);
        color: black;
        // color: var(--contrast-primary);
      }
    }
  }
</style>
