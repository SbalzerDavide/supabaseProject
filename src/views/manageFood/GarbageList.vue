<template>
  <div class="shopping-list d-flex flex-direction-column flex-grow">
    <div class="header d-flex">
      <div class="d-flex">
        <h1>Garbage list</h1>
      </div>
    </div>
    <div class="filter d-flex">
      <div class="active-filter">
      </div>
      <div class="change-filter">
        <div class="selected" @click="showOptions = true">
          {{ activeFilter }}
        </div>
        <div class="background-options"></div>
        <div v-show="showOptions" class="options">
          <div 
            class="option"
            v-for="(filter, index) in filterTypes"
            :key="index"
          >
            {{ index }}
          </div>
        </div>
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
      garbageList: [],
      filterTypes: [
        "Settimana",
        "Mese",
        "Anno"
      ],
      activeFilter: ""
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
    this.activeFilter = this.filterTypes[0];
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
  .filter{
    justify-content: space-between;
    padding: 0 12px;
  }
</style>
