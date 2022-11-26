<template>
  <div class="shopping-list d-flex flex-direction-column flex-grow">
    <PopupMessage 
      :content="popupMessage" 
      position="center"
      :type="popupType" 
      :show="triggerPopup" 
      @showBack="triggerPopup=false"
    />

    <div v-show="panelStore" class="panel-store d-flex flex-direction-column">
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
              <label ref="radioCalendar" for="calendar">Seleziona una data dal calendario
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
          <!-- <p>Qui devo contenere i campi che mi permettano di aggiungere le informazioni minime e necessarie per spostare un elemento da shopping list a storeage</p>
          <p>Una volta dato l'ok passo a quello successivo della lista, se presente, oppure chiudo il pannello</p>
          <p>mi darà anche la possibilità di applicare la stessa scelta a tutti quelli successivi, se fleggato l'appostito chck</p>
          <p>Il salvataggio a db avverrà solo dopo aver accetatto</p> -->
        </div>
        <div class="action d-flex">
          <button class="btn">
            Annulla
          </button>
          <button @click="moveToStore(actualEl)" class="btn btn-primary">
            Move to store
          </button>
        </div>
    </div>
    <div class="header d-flex">
      <h1>shopping list</h1>
      <button @click="multipleStore" class="btn btn-primary">
        Store
        <font-awesome-icon icon="fa-solid fa-box" />
      </button>
    </div>
    <ul>
      <li 
        class="d-flex"
        v-for="(el, index) in shoppingList" 
        :key="index"
      >
        <div class="d-flex">
          <input v-model="el.selected" @change="changeCheckbox" :name="el.name" :id="el.name" type="checkbox">
          <label :for="el.name">{{ el.name }}</label>
          <!-- <div class="list-name">
            {{ el.name }}
          </div> -->
        </div>
        <div class="operation d-flex">
          <div class="edit">
            <font-awesome-icon icon="fa-solid fa-pen" />
          </div>
          <div @click="deleteEl(index)" class="delete">
            <font-awesome-icon icon="fa-solid fa-trash" />      
          </div>
          <div @click="store(index)" class="toStorage">
            <font-awesome-icon icon="fa-solid fa-box" />
            <!-- <font-awesome-icon icon="fa-solid fa-house" /> -->
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { supabase } from '../../supabase';
import PopupMessage from "../../components/PopupMessage.vue";
// import Food from "../../components/food/Food.vue";



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
      selected: 0,
      panelStore: false,
      storages: [
        "Frigorifero",
        "Freezer",
        "Dispensa"
      ],
      deadlineValue: Object,
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
    multipleStore(){
      if(this.selected > 0){
        let selectedEl = this.shoppingList.filter(el=>el.selected);
        console.log(selectedEl);
      }
    },
    moveToStore(el){
      console.log(el);
      let vue = this;
      let newStore = {
        storage: el.storage,
        deadline: this.deadlineValue,
        shoppingList: false,
      }
      supabase
        .from("food")
        .update(newStore)
        .eq('id', el.id)
        .select()
        .then((data)=>{
          if("data" in data && data.data.length > 0){
            // se andata a buon fine aggiorno la listo e chiudo il pannello,
            // a meno che non ci siano altri elemtni nella lista a spostare
            // ma non c'è ancora questa logica
            vue.shoppingList.splice(vue.selectedIndex, 1);
            vue.panelStore = false;

            // messaggi opopup per avvenuto salavatggio
            vue.popupMessage = `Alimento correttamente spostato in ${data.data[0].storage}`;
            vue.popupType = "success";
            vue.triggerPopup = true;
          }
        })
        .catch((error)=>{
          console.log(error);
            vue.popupMessage = `Attensione, errore nello spostemento}`;
            vue.popupType = "error";
            vue.triggerPopup = true;
        })
    },
    store(index){
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
      if(e.target.checked){
        this.selected++;
      } else if(!e.target.checked){
        this.selected--;
      }
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
  .shopping-list{
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
      }
      .operation{
        cursor: pointer;
        svg{
          font-size: 20px;
          margin: 0 8px;
        }
      }
    }
    .panel-store{
      position: fixed;
      top: 80px;
      bottom: 60px;
      right: 0;
      left: 0;
      padding: 12px;
      padding-top: 20px;
      background-color: var(--background);
      h2{
        text-align: center;
        padding: 8px;
        color: var(--primary-color);
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
        font-size: 25px;
      }
      .deadline{
        margin: 8px 0;
      }
      .single-radio{
        position: relative;
        height: 40px;
        display: flex;
        align-items: center;
        label{
          input{
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 140px;
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
          height: 40px;
          display: flex;
          align-items: center;
        }
        select{
          width: 100%;
        }
      }

      .action{
        justify-content: flex-end;
        button{
          width: 100px;
          margin-left: 20px;
        }
      }
    }
  }
</style>
