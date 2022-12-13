<template>
  <div class="shopping-list d-flex flex-direction-column flex-grow">
    <div class="header d-flex">
      <div class="d-flex">
        <h1>Garbage list</h1>
      </div>
    </div>
    <div class="filter d-flex">
      <div class="active-filter">
        {{ period }}
      </div>
      <div class="change-filter">
        <div class="selected unselectable" @click="showOptions = true">
          {{ activeFilter }}
          <span v-if="!showOptions">
            <font-awesome-icon icon="fa-solid fa-chevron-down" />
          </span>
          <span v-else>
            <font-awesome-icon  icon="fa-solid fa-chevron-up" />
          </span>

        </div>
        <div v-show="showOptions" @click="showOptions = false" class="background-options"></div>
        <div v-show="showOptions" class="options">
          <div 
            class="option"
            v-for="(filter, index) in filterTypes"
            :key="index"
            @click="changeFilter(filter)"
          >
            {{ filter }} 
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
      showOptions: false,
      garbageList: [],
      filterTypes: [
        "Mese",
        // "Settimana",
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
    this.getDate();
  },
  methods:{
    getDate(){
      let today = new Date();
      let month = today.getMonth();
      console.log(month);
      let year = today.getFullYear();
      console.log(year);
      this.period = `${month} / ${year}`
    },
    changeFilter(filter){
      this.activeFilter = filter;
      this.showOptions = false;
    } , 
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
    position: relative;
    .background-options{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .selected{
      padding: 3px 8px;
      width: 150px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid var(--border-color-light);
      border-radius: var(--border-radius);
    }
    .options{
      position: absolute;
      background-color: white;
      border: 1px solid var(--border-color-light);
      border-radius: var(--border-radius);
      top: 120%;
      right: 10px;
      width: 180px;
      .option{
        padding: 5px 10px;
      }
    }
  }
</style>
