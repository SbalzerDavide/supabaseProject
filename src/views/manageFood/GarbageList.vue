<template>
  <div class="garbage-list d-flex flex-direction-column flex-grow">
    <div class="header d-flex">
      <!-- <div class="d-flex">
        <h1>Garbage list</h1>
      </div> -->
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
import loaderMixin from "../../mixins/loaderMixin.js";
import setAppbarTitle from "../../mixins/setAppbarTitle.js"


export default {
  name: 'ShoppingList',
  mixins: [loaderMixin, setAppbarTitle],
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
    this.setAppbarTitle("Garbage List");
    this.today = new Date();

    let stringUserData = window.localStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    let vue = this;
    this.activeFilter = this.filterTypes[0];

    this.changeFilter(this.activeFilter)
    this.activePeriod.date = this.today;
    this.changeLoader(true);
    this.getGarbageList().then((data)=>{
      this.changeLoader(false);
      if(data != null && data.length > 0){
        vue.garbageList = data;
        vue.garbageList.forEach(el=>{
          el.selected = false;
        })
      } else{
        vue.garbageList = []
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
      this.changeLoader(true);
      this.getGarbageList().then((data)=>{
        this.changeLoader(false);
        if(data != null && data.length > 0){
          vue.garbageList = data;
          vue.garbageList.forEach(el=>{
            el.selected = false;
          })
        } else{
          vue.garbageList = []
        }
      })
    },
    goOn(){
      let vue = this;
      if(this.activeFilter == "Anno"){
        this.activePeriod.year++;
        this.period = this.activePeriod.year;
        this.activePeriod.date = new Date(this.activePeriod.year, 0)
      } else if(this.activeFilter == "Mese"){
        if(this.activePeriod.month > 10){
          this.activePeriod.month = 0;
          this.activePeriod.year++;
        } else{
          this.activePeriod.month++;
        }
        this.period = `${this.activePeriod.month + 1} / ${this.activePeriod.year}`;
        this.activePeriod.date = new Date(this.activePeriod.year, this.activePeriod.month)
      }
      this.changeLoader(true);
      this.getGarbageList().then((data)=>{
        this.changeLoader(false);
        if(data != null && data.length > 0){
          vue.garbageList = data;
          vue.garbageList.forEach(el=>{
            el.selected = false;
          })
        } else{
          vue.garbageList = []
        }
      })
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
      this.getGarbageList().then((data)=>{
        if(data != null && data.length > 0){
          this.garbageList = data;
          this.garbageList.forEach(el=>{
            el.selected = false;
          })
        } else{
          this.garbageList = []
        }
      })
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
        if(window.foodManagerDemo === true){
          let garbage = localStorage.getItem("garbage");
          if(garbage){
            garbage = JSON.parse(garbage);
          } else{
            garbage = []
          }
          // fare qui filtro 
          let filteredGarbage = [];
          garbage.forEach((el, index)=>{
            let date = new Date(el.garbageDate);
            let year = date.getFullYear();
            let month = date.getMonth();
            let day = date.getUTCDate();
            el.garbageDate = `${year} - ${month + 1} - ${day}`
            if(this.activeFilter === "Anno"){
              if(year == this.activePeriod.year){
                filteredGarbage.push(el)
              }
            } else if(this.activeFilter === "Mese"){
              if(year == this.activePeriod.year){
                if(this.activePeriod.month === month){
                  filteredGarbage.push(el)
                }
              }
            }
          })
          resolve(filteredGarbage);
        } else{
          supabase
            .from("food")
            .select()
            .eq('user_id', vue.user.id)
            .eq('garbage', true)
            .lt('garbageDate', to)
            .gt('garbageDate', from)
            .order("garbageDate", {ascending: false})
            .then((data)=>{
              resolve(data.data);
            })
            .catch((err)=>{
              reject(err);
            })
        }
      })
    },

  }
}
</script>

<style lang="scss">
  .garbage-list{
    .header{
      justify-content: space-between;
      padding: 0 12px;
    }
    li{
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      &:first-child{
        padding-top: 0;
      }
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
        border-radius: 10px;
        background-color: var(--color-3);
        color: black;
        // color: var(--contrast-primary);
      }
    }
    .filter{
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      position: relative;
      margin: 10px 0;
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
        z-index: 9;
        .option{
          padding: 5px 10px;
        }
      }
    }
  }
</style>
