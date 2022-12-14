<template>
  <div class="shopping-list d-flex flex-direction-column flex-grow">
    <div class="header d-flex">
      <div class="d-flex">
        <h1>Garbage list</h1>
      </div>
    </div>
    <div class="filter d-flex">
      <div class="active-filter unselectable">
        <font-awesome-icon @click="comeBack" icon="fa-solid fa-chevron-left" />
        <span>
          {{ period }}
        </span>
        <font-awesome-icon @click="goOn" icon="fa-solid fa-chevron-right" />
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
      activeFilter: "",
      period: "",
      activePeriod: {},
      today: Date
    }
  },
  created(){
    this.today = new Date();

    let stringUserData = window.sessionStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    let vue = this;
    this.changeLoader(true);
    this.activeFilter = this.filterTypes[0];

    this.changeFilter(this.activeFilter)
    this.activePeriod.date = this.today;
    this.getGarbageList().then((data)=>{
      this.changeLoader(false);
      console.log(data);
      if(data != null && data.length > 0){
        vue.garbageList = data;
        vue.garbageList.forEach(el=>{
          el.selected = false;
        })
      }
    })
  },
  methods:{
    comeBack(){
      let vue = this;

      if(this.activeFilter == "Anno"){
        this.activePeriod.year--;
        this.period = this.activePeriod.year;
        this.activePeriod.date = new Date(this.activePeriod.year, 0)

      } else if(this.activeFilter == "Mese"){
        if(this.activePeriod.month > 0){
          this.activePeriod.month--;
        } else{
          this.activePeriod.month = 11;
          this.activePeriod.year--;
        }
        this.period = `${this.activePeriod.month + 1} / ${this.activePeriod.year}`
        this.activePeriod.date = new Date(this.activePeriod.year, this.activePeriod.month)
      }
      console.log(this.activePeriod.date);
      this.getGarbageList().then((data)=>{
      this.changeLoader(false);
      console.log(data);
      if(data != null && data.length > 0){
        vue.garbageList = data;
        vue.garbageList.forEach(el=>{
          el.selected = false;
        })
      }
    })
    },
    goOn(){
      let vue = this;
      if(this.activeFilter == "Anno"){
        this.activePeriod.year++;
        this.period = this.activePeriod.year;
      } else if(this.activeFilter == "Mese"){
        if(this.activePeriod.month > 10){
          this.activePeriod.month = 0;
          this.activePeriod.year++;
        } else{
          this.activePeriod.month++;
        }
        this.period = `${this.activePeriod.month + 1} / ${this.activePeriod.year}`;
        this.getGarbageList().then((data)=>{
        this.changeLoader(false);
          console.log(data);
          if(data != null && data.length > 0){
            vue.garbageList = data;
            vue.garbageList.forEach(el=>{
              el.selected = false;
            })
          }
        })

      }
    },
    changeFilter(filter){
      this.activeFilter = filter;
      this.showOptions = false;
      this.activePeriod.year = this.today.getFullYear(); 
      this.activePeriod.month = this.today.getMonth(); 
      let year = this.today.getFullYear();
      let month = this.today.getMonth() +1;
      if(filter == "Anno"){
        this.period = year;
      } else if(filter == "Mese"){
        this.period = `${month} / ${year}`;
      }
    } , 
    getGarbageList(){
      return new Promise((resolve, reject)=>{
        let vue = this;
        let from;
        let to;
        if(this.activeFilter === "Anno"){
          from = `${this.activePeriod.year}-01-01`;
          to = `${this.activePeriod.year + 1}-01-01`;
        } else if(this.activeFilter === "Mese"){
          let month = this.activePeriod.month;
          from = `${this.activePeriod.year}-${this.activePeriod.month + 1}-01`;
          if(month > 10){
            to = `${this.activePeriod.year + 1}-01-01`;
          } else{            
            to = `${this.activePeriod.year}-${this.activePeriod.month + 2}-01`;
          }
        }
        supabase
          .from("food")
          .select()
          .eq('user_id', vue.user.id)
          .eq('garbage', true)
          // .rangeAdjacent('garbageDate', '[2022-01-01, 2022-01-01 )')
          // .lt('garbageDate', "2022-12-01")
          .lt('garbageDate', to)
          // .gt('garbageDate', "2022-11-01")
          .gt('garbageDate', from)
          .order("garbageDate", {ascending: false})
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
    align-items: center;
    padding: 0 12px;
    position: relative;
    .active-filter{
      display: flex;
      justify-content: space-between;
      width: 140px;
      span{
        flex-grow: 1;
        text-align: center;
        // width: 80px;
      }
    }
    .background-options{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 8;
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
      background-color: var(--background-component);
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
