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
          <button class="btn">
            Annulla
          </button>
          <button @click="manageMultipleDelete" class="btn btn-primary">
            Conferma
          </button>

        </div>
      </div>
    </div>
    <div 
      class="panel-store d-flex flex-direction-column" 
      :class="panelStore ? 'show' : 'hide'"
    >
      <div class="close" @click="closePanelStore">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </div>
        <h2>
          {{ actualEl.name }}
        </h2>
        <div class="content flex-grow">
          <div class="deadline d-flex flex-direction-column">
            <h4>Scadenza</h4>
            <span>{{ deadlineValueFormat }}</span>
            <div class="single-radio">
              <input type="radio" id="3days" name="deadline" value="3" @change="modifyDeadline(false, 3)">
              <label for="3days">3 days</label>
            </div>
            <div class="single-radio">
              <input type="radio" id="week" name="deadline" value="7" @change="modifyDeadline(false, 7)">
              <label for="week">One week</label>
            </div>
            <!-- Inserrimento dinamico numero di giorni -->
            <div class="single-radio input-radio">
              <input type="radio" id="input" name="deadline" :value="inputDays" @change="modifyDeadline(false, inputDays)">
              <label ref="radioInput" for="input">Tra quanti giorni?
                <input @change="modifyDeadline(false, inputDays, 'radioInput')" type="number" v-model="inputDays">
              </label>
            </div>
            <!-- inserimento dinamico da calendario -->
            <div class="single-radio calendar-radio">
              <input type="radio" id="calendar" name="deadline" :value="calendarDate" @change="modifyDeadline(true)">
              <label ref="radioCalendar" for="calendar">Seleziona una data
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
          <button @click="cancelMoveToStore" class="btn">
            Annulla
          </button>
          <button @click="moveToStoreNew" class="btn btn-primary">
            Move to store
          </button>
        </div>
    </div>
    <div class="header d-flex">
      <h1>shopping list</h1>
      <!-- <button @click="multipleStore" class="btn btn-primary">
        Store
        <font-awesome-icon icon="fa-solid fa-box" />
      </button> -->
    </div>
    <ul>
      <li 
        class="d-flex"
        v-for="(el, index) in shoppingList" 
        :key="index"
      >
        <div class="d-flex">
          <input v-model="el.selected" @change="changeCheckbox" :name="el.name" :index="index" :id="el.name" type="checkbox">
          <label :for="el.name">{{ el.name }}</label>
        </div>
        <div class="operation d-flex">
          <div class="edit">
            <font-awesome-icon icon="fa-solid fa-pen" />
          </div>
          <!-- <div @click="deleteEl(index)" class="delete">
            <font-awesome-icon icon="fa-solid fa-trash" />      
          </div> -->
          <!-- <div @click="storePanel(index)" class="toStorage">
            <font-awesome-icon icon="fa-solid fa-box" />
          </div> -->
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { supabase } from '../../supabase';
import PopupMessage from "../../components/PopupMessage.vue";


export default {
  name: 'ShoppingList',
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
  created(){
    let stringUserData = window.sessionStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    let vue = this;
    this.getShoppingList().then((data)=>{
      vue.shoppingList = data;
      vue.shoppingList.forEach(el=>{
        el.selected = false;
      })
    })
  },
  methods:{
    deleteEl(index){
      let vue = this;
      supabase
        .from('food')
        .delete()
        .eq('id', this.shoppingList[index].id)
        .then((data)=>{
          console.log(data);
          vue.shoppingList.splice(index, 1);
        })
        .catch((err)=>{
          console.log(err);
        })
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
    multipleDelete(){
      console.log("multiple delete");
      let tempShoppingList = JSON.parse(JSON.stringify(this.shoppingList));
      tempShoppingList.forEach((el, index)=>{
        if(this.selectedList.includes(index.toString())){
          console.log(this.shoppingList[index]);
          this.shoppingList.splice(index, 1);
          console.log(el);
          console.log(this.shoppingList[index]);
        }
      })
      this.panelDelete = false;
      console.log(this.shoppingList);
    },
    multipleStore(){
      if(this.selectedList.length > 0){
        this.panelStore = true;
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
      console.log(this.deadlineValue);
      let saved = false;
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
      
            this.managePanel();
          }
        })
        .catch((error)=>{
          // sono sicuro che non sia stato salvato se passa dalla catch e saved è rimasto === false
          if(!saved){
            console.log(error);
            vue.popupMessage = `Attensione, errore nello spostemento`;
            vue.popupType = "error";
            vue.triggerPopup = true;
          }
        })
    },
    storePanel(index){
      this.selectedIndex = index;
      this.panelStore = true;
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
        // this.selected++;
        this.selectedList.push(index);
      } else if(!e.target.checked){
        if(this.selectedList.indexOf(index)>= 0){
          this.selectedList.splice(this.selectedList.indexOf(index), 1)
        }
        // this.selected--;
      }
      console.log(this.selectedList);
    },
    getShoppingList(){
      return new Promise((resolve, reject)=>{
        let vue = this;
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
      })
    },

  }
}
</script>

<style lang="scss">
  .shopping-list-appbar{
    position: fixed;
    top: 0;
    width: 100%;
    height: 80px;
    background-color: var(--background-primary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
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
      height: 45px;
      width: 120px;
      font-size: 20px;
    }
  }
  .shopping-list{
    .panel-delete-background{
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      padding: 12px;
      padding-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      .blurred{
        height: 100%;
        position: absolute;
        top: 0;
        backdrop-filter: blur(0px);
      }
      &.show{
        z-index: 1;
        .blurred{
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          backdrop-filter: blur(5px);
        }
        .panel-delete{
          width: 80%;
          height: 200px;
          padding: 30px;
        }
      }
      &.hide{
        z-index: -1;
        .blurred{
          top: 50%;
          bottom: 50%;
          left: 50%;
          right: 50%;
          overflow: hidden;
        }
        .panel-delete{
          width: 0%;
          height: 0;
        }
      }
      .panel-delete{
        position: absolute;
        background-color: var(--background-component);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        justify-content: space-between;
        transition: all .2s;
        overflow: hidden;
        button{
          height: 50px;
        }
      }
    }
    .header{
      justify-content: space-between;
      padding: 0 12px;
      button{
        width: 80px;
      }
    }
    li{
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      input[type=checkbox]{
        margin-right: 8px;
        width: 20px;
        height: 20px;
      }
      .operation{
        cursor: pointer;
        svg{
          font-size: 20px;
          margin: 0 8px;
        }
      }
    }
    .panel-delete{
      padding: 20px;
      .action{
        justify-content: space-between;
        button{
          width: 40%;
        }
      }
    }
    .panel-store{
      position: fixed;
      padding-top: 20px;
      background-color: var(--background);
      // transition: all .2s;
      &.show{
        top: 80px;
        bottom: 60px;
        right: 0;
        left: 0;
        padding: 12px;
      }
      &.hide{
        top: 50%;
        bottom: 50%;
        left: 50%;
        right: 50%;
        overflow: hidden;
      }
      h2{
        text-align: center;
        padding: 8px;
        color: var(--primary-color);
        font-size: 25px;
      }
      .close{
        position: absolute;
        top: 6px;
        right: 6px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        svg{
          height: 30px;
        }
        // font-size: 25px;
      }
      .deadline{
        margin: 8px 0;
      }
      .single-radio{
        position: relative;
        height: 50px;
        display: flex;
        align-items: center;
        label{
          input{
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 150px;
          }
        }
        input[type=radio]{
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
      }
      .storage{
        div{
          height: 50px;
          display: flex;
          margin-top: 8px;
          align-items: center;
        }
        select{
          width: 100%;
        }
      }

      .action{
        justify-content: flex-end;
        button{
          width: 150px;
          height: 50px;
          margin-left: 20px;
        }
      }
    }
  }
</style>
