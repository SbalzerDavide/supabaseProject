<template>
  <div class="food d-flex flex-direction-column flex-grow">
    <div v-show="availableSave" class="food-appbar">
      <button @click="save" class="btn btn-primary">
        Save
      </button>
    </div>

    <div class="food-input d-flex flex-direction-column flex-grow">
      <div class="mode d-flex">
        <button 
          class="btn"
          :class="food.shoppingList == true ? 'active' : ''"
          @click="food.shoppingList = true"
        >
          Shopping list
        </button>
        <button 
          class="btn"
          :class="food.shoppingList == false ? 'active' : ''"
          @click="food.shoppingList = false"
        >
          Storage
        </button>
      </div>
      <div class="name-quantity d-flex">
        <div class="name">
          <input 
            v-if="edit"
            ref="inputName"
            type="text"
            v-model="food.name"
            placeholder="Alimento"
            @keyup="checkAvailableSave"
            @keyup.enter="save"
          >
          <h3 v-else>{{ food.title }}</h3>
        </div>
        <div class="quantity">
          <label for="quantity">Qty</label>
          <input 
            type="number" 
            name="quantity"
            v-model="food.quantity"
          >
        </div>
      </div>
      <div v-show="!food.shoppingList" class="storage">
        <select @change="checkStorage" v-model="food.storage">
          <option 
            v-for="(storage, index) in storages" 
            :key="index" 
            :value="storage"
          >
            {{ storage }}
          </option>
        </select>
      </div>
      <div v-show="!food.shoppingList" class="deadline">
        <!-- <h5 @click="openSetDeadline = true">Imposta scadenza</h5> -->
        <button @click="openSetDeadline = true" class="btn">
          Imposta scadenza
        </button>
        <span>
          {{ deadlineValueFormat }}
        </span>
        <div v-show="openSetDeadline" class="radio d-flex flex-direction-column">
          <!-- valori preimpostati, in cui alla funzione vengono passati i giorni -->
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
          <div class="set">
            <button @click="openSetDeadline = false" class="btn btn-primary">
              Imposta
            </button>
          </div>
        </div>


      </div>
      <div class="category">
        <!-- <h5>Categoria alimento</h5> -->
        <select v-model="food.category">
          <option value="" disabled selected>Seleziona una categoria</option>
          <option 
            v-for="(category, index) in categories" 
            :key="index" 
            :value="category"
          >
            {{ category }}
          </option>
        </select>
        <!-- possibilità di selezioanre il tipo di alimento, all'inizio magari saranno statici poi darò la possibilità di personalizzarli -->

      </div>
      <div class="description d-flex flex-direction-column flex-grow">
        <!-- <label for="description">Aggiungi una descrizione</label> -->
        <textarea 
          placeholder="Aggiungi una descrizione" 
          name="description"
          v-model="food.description"
        >
        </textarea>
      </div>
    </div>
    <!-- <div class="food-action">
      <button class="btn btn-primary" 
        @click="save"
        @keyup.enter="save"
      >
        Save
      </button>
    </div> -->

  </div>
</template>

<script>
import { supabase } from "../../supabase.js";


export default{
  name: "Food",
  props:{
    mode: {
      type: String, 
      default: "read",
    },
    propsFood: Object,
  },
  data(){
    return{
      user: {},
      food: Object,
      openSetDeadline: false,
      // activeMode: "shoppingList",
      storages: [
        // "Lista della spesa",
        "Frigorifero",
        "Freezer",
        "Dispensa"
      ],
      categories: [
        "frutta",
        "verdura",
        "carne",
        "dolci",
        "secco"
      ],
      deadlineValue: Object,
      calendarDate: Object,
      deadlineValueFormat: "",
      inputDays: 0,
      availableSave: false
    }
  },
  created(){
    let stringUserData = window.sessionStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    if(this.mode === "new"){
      this.edit = true;
      this.food = {
        name: "",
        // storage: "Lista della spesa",
        storage: "Frigorifero",
        shoppingList: true,
        quantity: 1,
        category: "",
        description: ""
      }
    } else if(this.type === "read"){
      this.food = this.propsFood;
    }
    this.deadlineValue =  new Date();
    
  },
  mounted(){
    this.$refs.inputName.focus();
  },
  methods:{
    checkAvailableSave(){
      if(this.food.name !== ""){
        this.availableSave = true;
      } else{
        this.availableSave = false;
      }
    },
    checkStorage(){
      if(this.food.storage === "Lista della spesa"){
        this.food.shoppingList = true;
      } else{
        this.food.shoppingList = false;
      }
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
    save(){
      let vue = this;
      if(this.food.name !== ""){
        if("id" in this.food){
          // alimento già esistente quindi faccio upsert
          let updateFood = this.food;

          if(!("deadline" in updateFood)){
            this.$emit('saved', {
              message: "Inserire data di scadenza",
              type: "warning"
            })
            return;
          }

          if(updateFood.shoppingList == true){
            delete updateFood.storage;
          }
          updateFood.user_id = this.user.id;
          supabase
            .from("food")
            .update(updateFood)
            .eq('id', this.food.id)
            .then((data)=>{
              if("data" in data && data.data.length > 0){
                this.$emit('saved', {
                  message: "L'alimento è stato salvato correttamente",
                  type: "success"
                })
                vue.availableSave = false;
              }
            })
            .catch((error)=>{
              console.log(error);
            })

        } else{
          // alimento nuovo quindi faccio insert
          let newFood = this.food;
          newFood.user_id = this.user.id;
          if(!newFood.shoppingList && !("deadline" in newFood)){
            this.$emit('saved', {
              message: "Inserire data di scadenza",
              type: "warning"
            })
            console.log("manca deadline");
            return;
          }
          if(newFood.shoppingList == true){
            delete newFood.storage;
          }

          // inserire deadline solo se è stata impostata
          // questo controllo non funziona
          if(this.deadlineValue !== {}){
            newFood.deadline = this.deadlineValue;
          }
          supabase
            .from("food")
            .insert(newFood)
            .select()
            .then((data)=>{
              if("data" in data && data.data.length > 0){
                vue.food.id = data.data[0].id;
                this.$emit('saved', {
                  message: "L'alimento è stato salvato correttamente",
                  type: "success"
                })
                // azzero dati  di inserimento per poter aggiungere un altro alimento
                // vue.food.name = "";
                vue.food = {
                  name: "",
                  storage: "Frigorifero",
                  shoppingList: true,
                  quantity: 1,
                  category: "",
                  description: ""
                }
                vue.$refs.inputName.focus();
                vue.availableSave = false;
              }
            })
            .catch((err)=>{
              console.log(err);
              this.$emit('saved', {
                message: "Attenzione! Errore salvataggio alimento",
                type: "error"
              })
            })
        }
      }
    }


  }
}
</script>

<style lang="scss">
  .food-appbar{
    position: fixed;
    top: 0;
    width: 100%;
    height: 80px;
    background-color: var(--background-primary);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
    z-index: 5;
    button{
      height: 50px;
      width: 40%;
    }
  }
  .mode{
    justify-content: space-between;
    button{
      width: 44%;
      height: 50px;
      &.active{
        color: var(--primary-color);
        border-color: var(--primary-color);
        background-color: var(--color-3);
      }
    }  
  }
  .food-input{
    &>div{
      margin: 8px 0;
    }
    input[type=radio]{
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    .name-quantity{
      justify-content: space-between;
      .name{
        flex-grow: 1;
        input{
          width: 100%;
        }
      }
      .quantity{
        display: flex;
        align-items: center;
        label{
          margin: 0 5px 0 15px;
        }
        input{
          width: 30px;
        }
      }

    }
    .storage{
      select{
        width: 100%;
      }
    }
    .category{
      select{
        width: 100%;
      }
    }
    .deadline{
      h5{
        margin-bottom: 10px;
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
      }
      .radio{
        position: fixed;
        top: 80px;
        bottom: 60px;
        left: 0;
        right: 0;
        padding: 20px;
        background-color: var(--background);
      }
      .set{
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;

      }
    }
    .description{
      textarea{
        width: 100%;
        min-height: 200px;
        padding: 10px;
        flex-grow: 1;
      }
    }
  }
  .food-action{
    display: flex;
    justify-content: flex-end;
    button{
      width: 45%;
    }
  }
</style>
