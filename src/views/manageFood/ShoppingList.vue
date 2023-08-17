<template>
  <div class="shopping-list d-flex flex-direction-column flex-grow">
    <PopupMessage 
      :content="popupMessage" 
      position="bottom"
      :type="popupType" 
      :show="triggerPopup" 
      @showBack="triggerPopup=false"
    />

    <!-- <div v-show="panelStore" class="panel-store d-flex flex-direction-column"> -->
    <div v-show="selectedList.length > 0" class="shopping-list-appbar">
      <div @click="removeSelection" class="back">
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
      </div>
      <div class="action">
        <button @click="panelDelete = true" class="btn btn-primary">
          Delete
          <font-awesome-icon icon="fa-solid fa-trash" />
        </button>

        <button @click="multipleStore" class="btn btn-primary">
          Store
          <font-awesome-icon icon="fa-solid fa-box" />
        </button>
      </div>
    </div>

    <div 
      class="panel-delete-background"
      :class="panelDelete ? 'show' : 'hide'"
    >
      <div class="blurred" @click="panelDelete = false"></div>
      <div class="panel-delete d-flex flex-direction-column">
        <h4>Sei sicuro di voler eliminare gli elementi selezionati?</h4>
        <div class="action d-flex">
          <!-- <button @click="cancelDelete" class="btn">
            Annulla
          </button> -->
          <button @click="manageMultipleDelete" class="btn btn-primary">
            Conferma
          </button>

        </div>
      </div>
    </div>
    <div 
      class="panel-store-background" 
      :class="panelStore ? 'show' : 'hide'"
    >
      <div class="blurred" @click="panelStore = false"></div>
      <div class="panel-store d-flex flex-direction-column">
        <!-- <div class="close" @click="closePanelStore">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </div> -->
        <div class="panel-store-title d-flex">
          <h2>
            {{ actualEl.name }}
          </h2>
        </div>
        <div class="content flex-grow">
          <div class="deadline d-flex flex-direction-column">
            <h4>Scadenza - {{ deadlineValueFormat }}</h4>
              <div class="single-radio">
              <input type="radio" id="3days" name="deadline" value="3" @change="modifyDeadline(false, 3)">
              <label for="3days">3 giorni</label>
            </div>
            <div class="single-radio">
              <input type="radio" id="week" name="deadline" value="7" checked @change="modifyDeadline(false, 7)">
              <label for="week">1 settimana</label>
            </div>
            <!-- Inserrimento dinamico numero di giorni -->
            <div class="single-radio input-radio">
              <input type="radio" id="input" name="deadline" :value="inputDays" @change="modifyDeadline(false, inputDays)">
              <label ref="radioInput" for="input">Giorni
                <input @change="modifyDeadline(false, inputDays, 'radioInput')" type="number" v-model="inputDays">
              </label>
            </div>
            <!-- inserimento dinamico da calendario -->
            <div class="single-radio calendar-radio">
              <input type="radio" id="calendar" name="deadline" :value="calendarDate" @change="modifyDeadline(true)">
              <label ref="radioCalendar" for="calendar">Data
                <input @change="modifyDeadline(true, null, 'radioCalendar')" type="date" v-model="calendarDate">
              </label>
            </div>
          </div>
          <div class="storage">
            <h4>Storage</h4>
            <div>
              <select v-model="actualEl.storage">
                <option 
                  v-for="(storage, index) in storages" 
                  :key="index" 
                  :value="storage"
                >
                  {{ storage }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="action d-flex">
          <!-- <button @click="cancelMoveToStore" class="btn">
            Annulla
          </button> -->
          <button @click="moveToStoreNew" class="btn btn-primary">
            Move to store
          </button>
        </div>
      </div>
    </div>
    <div class="header d-flex">
      <h1>shopping list</h1>
      <!-- <button @click="multipleStore" class="btn btn-primary">
        Store
        <font-awesome-icon icon="fa-solid fa-box" />
      </button> -->
    </div>
    <ul :class="selectedList.length > 0 ? 'anable-select' : ''">
      <li 
        class="d-flex"
        v-for="(el, index) in shoppingList" 
        :key="index"
      >
        <div class="content d-flex">
          <input v-model="el.selected" @change="changeCheckbox" :name="el.name" :index="index" :id="index" type="checkbox">
          <label :for="index">{{ el.name }}</label>
        </div>
        <div class="operation d-flex">
          <!-- <div class="edit">
            <font-awesome-icon icon="fa-solid fa-pen" />
          </div> -->
          <div @click="deleteEl(index)" class="delete">
            <font-awesome-icon icon="fa-solid fa-trash" />      
          </div>
          <div @click="storePanel(index)" class="toStorage">
            <font-awesome-icon icon="fa-solid fa-box" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { supabase } from '../../supabase';
import PopupMessage from "../../components/PopupMessage.vue";
import loaderMixin from "../../mixins/loaderMixin.js";
import setAppbarTitle from "../../mixins/setAppbarTitle.js"


export default {
  name: 'ShoppingList',
  mixins: [loaderMixin, setAppbarTitle],
  components: {
    PopupMessage
  },
  props: {
  },
  data(){
    return{
      user: {},
      shoppingList: [],
      actualEl: Object,
      selectedList: [],
      panelStore: false,
      panelDelete: false,
      storages: [
        "Frigorifero",
        "Freezer",
        "Dispensa"
      ],
      deadlineValue: "",
      calendarDate: Object,
      deadlineValueFormat: "",
      inputDays: 0,
      selectedIndex: Number,
      popupMessage: "",
      popupType: "",
      triggerPopup: false 
    }
  },
  watch:{
    panelStore(newVal){
      // quando chiudo pannello azzero valori data di scadenza
      if(!newVal){
        this.deadlineValue = "";
        this.deadlineValueFormat = "";
      }
    }
  },
  created(){
    this.setAppbarTitle("Shopping List");
    let stringUserData = window.localStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    let vue = this;
    this.changeLoader(true);
    this.getShoppingList().then((data)=>{
      this.changeLoader(false);
      vue.shoppingList = data;
      vue.shoppingList.forEach(el=>{
        el.selected = false;
      })
    })
  },
  methods:{
    deleteEl(index){
      this.selectedList = [index.toString()];
      this.panelDelete = true;
      this.shoppingList[index].selected = true;
    },
    removeSelection(){
      this.selectedList = [];
      this.shoppingList.forEach(el => {
        el.selected = false;
      });
    },
    deleteOne(){
      let tempShoppingList = JSON.parse(JSON.stringify(this.shoppingList));
      let promises = [];
      tempShoppingList.forEach((el, index)=>{
        if(this.selectedList.includes(index.toString())){
          const p = new Promise((resolve, reject) => {
            if(window.foodManagerDemo === true){
              let shoppingList = localStorage.getItem("shoppingList");
              if(shoppingList){
                shoppingList = JSON.parse(shoppingList);
                shoppingList.splice(index, 1)
                localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
                this.shoppingList = shoppingList
                resolve()
              }
            } else{
              supabase
                .from('food')
                .delete()
                .eq('id', this.shoppingList[index].id)
                .then((data)=>{
                  console.log(data);
                  resolve()
                })
                .catch((err)=>{
                  console.log(err);
                  reject()
                })
            }

          })
          promises.push(p);
        }
      })
      return Promise.all(promises);
    },
    manageMultipleDelete(){
      let vue = this;
      this.deleteOne().then(()=>{
        vue.panelDelete = false;
        vue.popupMessage = `${vue.selectedList.length} elementi eliminati correttamente`;
        vue.popupType = "success";
        vue.triggerPopup = true;

        vue.selectedList = [];

        this.getShoppingList().then((data)=>{
          vue.shoppingList = data;
          vue.shoppingList.forEach(el=>{
            el.selected = false;
          })
        })
      });
    },
    // multipleDelete(){
    //   let tempShoppingList = JSON.parse(JSON.stringify(this.shoppingList));
    //   tempShoppingList.forEach((el, index)=>{
    //     if(this.selectedList.includes(index.toString())){
    //       this.shoppingList.splice(index, 1);
    //       console.log(el);
    //     }
    //   })
    //   this.panelDelete = false;
    // },
    multipleStore(){
      if(this.selectedList.length > 0){
        this.panelStore = true;
        this.modifyDeadline(false, 7)
        this.managePanel();
      }
    },
    managePanel(){
      let vue = this;
      if(this.selectedList.length > 0){
        // quello visualizzato è sempre il primo quindi piano piano li tolgo 
        this.actualEl = this.shoppingList[this.selectedList[0]];
        this.actualEl.storage = this.storages[0];
      } else{
        this.panelStore = false;
        // faccio  chiamata di rete per sapere cos'è rimasto in shopping list
        vue.getShoppingList().then((data)=>{
          vue.shoppingList = data;
          vue.shoppingList.forEach(el=>{
            el.selected = false;
          })
        })
      }
    },
    cancelMoveToStore(){
      this.selectedList.splice(0, 1);
      this.managePanel();
    },
    moveToStoreNew(){
      let vue = this;
      if(this.deadlineValue === ""){
        vue.popupMessage = `Inserire una data di scadenza`;
        vue.popupType = "error";
        vue.triggerPopup = true;
        return;
      }
      let newStore = {
        storage: this.actualEl.storage,
        deadline: this.deadlineValue,
        shoppingList: false,
      }
      let saved = false;
      if(window.foodManagerDemo === true){
        let storage = localStorage.getItem("storage");
        if(storage){
          storage = JSON.parse(storage);          
        } else{
          storage = []
        }
        // tolgo elemento da shopping list
        let shoppingList = localStorage.getItem("shoppingList");
        if(storage){
          shoppingList = JSON.parse(shoppingList);          
        }
        let toStoreIndex;
        shoppingList.forEach((el, index)=>{
          if(el.id === this.actualEl.id){
            toStoreIndex = index;
          }
        })
        shoppingList.splice(toStoreIndex, 1);
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        let toStore = this.actualEl;
        toStore.deadline= this.deadlineValue
        toStore.getShoppingList = false
        storage.push(toStore);
        localStorage.setItem("storage", JSON.stringify(storage))
        vue.selectedList.splice(0, 1);  
        // messaggi popup per avvenuto salavatggio
        vue.popupMessage = `Alimento correttamente spostato in ${toStore.storage}`;
        vue.popupType = "success";
        vue.triggerPopup = true;

        vue.managePanel();
      } else{
        supabase
          .from("food")
          .update(newStore)
          .eq('id', this.actualEl.id)
          .select()
          .then((data)=>{
            if("data" in data && data.data.length > 0){
              saved = true;
              vue.selectedList.splice(0, 1);
  
              // messaggi popup per avvenuto salavatggio
              vue.popupMessage = `Alimento correttamente spostato in ${data.data[0].storage}`;
              vue.popupType = "success";
              vue.triggerPopup = true;
        
              vue.managePanel();
            }
          })
          .catch((error)=>{
            // sono sicuro che non sia stato salvato se passa dalla catch e saved è rimasto === false
            if(!saved){
              console.log(error);
              vue.popupMessage = `Attenzione, errore nello spostemento`;
              vue.popupType = "error";
              vue.triggerPopup = true;
            }
          })
      }
    },
    cancelDelete(){
      this.panelDelete = false;
      this.selectedList = [];
    },
    storePanel(index){
      this.selectedIndex = index;
      this.panelStore = true;
      this.modifyDeadline(false, 7)
      let obj = this.shoppingList[index];
      this.actualEl = obj;
      this.actualEl.storage = "Frigorifero";
    },
    modifyDeadline(calendar, days, triggerRef){
      if(triggerRef){
        this.$refs[triggerRef].click();
      }
      let date;
      if(calendar){
        date = new Date(this.calendarDate);
      } else{
        date = new Date();
        date.setDate(date.getDate() + parseInt(days));
      }
      this.deadlineValue = date;
      this.deadlineValueFormat = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    },
    closePanelStore(){
      this.panelStore = false;
    },
    changeCheckbox(e){
      let index = e.target.getAttribute("index");
      if(e.target.checked){
        this.selectedList.push(index);
      } else if(!e.target.checked){
        if(this.selectedList.indexOf(index)>= 0){
          this.selectedList.splice(this.selectedList.indexOf(index), 1)
        }
      }
    },
    getShoppingList(){
      return new Promise((resolve, reject)=>{
        let vue = this;
        if(window.foodManagerDemo === true){
          let shoppingList = localStorage.getItem("shoppingList");
          if(shoppingList){
            resolve(JSON.parse(shoppingList));
          } else{
            resolve([])
          }
        } else{
        supabase
          .from("food")
          .select()
          .eq('user_id', vue.user.id)
          .eq('shoppingList', true)
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
  .shopping-list{
    @import "src/assets/partials/panel.scss";
    .shopping-list-appbar{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 60px;
      background-color: var(--background-primary);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      z-index: 4;
      .back{
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        svg{
          height: 40px;
        }
      }
      button{
        margin-left: 20px;
        height: 40px;
        width: 115px;
        font-size: 20px;
      }
    }
    .header{
      justify-content: center;
      padding: 0 12px;
      h1{
        padding-bottom: 3px;
        border-bottom: 3px solid var(--color-3);
      }
      button{
        width: 80px;
      }
    }
    .anable-select{
      input[type='checkbox']{
        opacity: 1;
      }
      li{
        left: 0;
      }
      .operation{
        left: 70px;
        opacity: 0;
      }
    }
    
    li{
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      position: relative;
      left: -30px;
      transition: all .5s;
      input[type=checkbox]{
        margin-right: 8px;
        width: 20px;
        height: 20px;
        opacity: 0;
        transition: all .3s;
      }
      .content{
        flex-grow: 1;
        label{
          flex-grow: 1;
        }
      }
      .operation{
        position: relative;
        opacity: 1;
        left: 30px;
        cursor: pointer;
        transition: all .3s;
        svg{
          font-size: 20px;
          margin: 0 8px;
        }
      }
    }
    .panel-store{
      height: 70%;
    }
  }
</style>
