<template>
  <div class="storage-list d-flex flex-direction-column flex-grow">
    <PopupMessage 
      :content="popupMessage" 
      position="bottom"
      :type="popupType" 
      :show="triggerPopup" 
      @showBack="triggerPopup=false"
    />
    <div v-show="selectedList.length > 0" class="storage-list-appbar">
      <div @click="removeSelection" class="back">
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
      </div>
      <div class="action">
        <button class="btn btn-primary">
          Delete
          <font-awesome-icon icon="fa-solid fa-trash" />
        </button>

        <button @click="multipleList" class="btn btn-primary">
          List
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
        <div class="choice d-flex">
          <button class="btn btn-primary" @click="eatenFood">
            Alimento consumato
          </button>
          <button class="btn" @click="toGarbage">
            Alimento buttato
          </button>
        </div>
        <div class="addToShoppingList">
          <label for="addToShoppingList">Inserisci a lista della spesa</label>
          <input type="checkbox" name="addToShoppingList" id="addToShoppingList">
        </div>
      </div>

    </div>
    <div class="header d-flex">
        <h1>Storage list</h1>
        <select @change="applyFilter" name="storage" v-model="storageFilter">
          <option 
            v-for="(storage, index) in storages" 
            :key="index" 
            :value="storage"
          >
            {{ storage }}
          </option>
        </select>
      <!-- <button @click="multipleAction" class="btn btn-primary">
        Store
        <font-awesome-icon icon="fa-solid fa-box" />
      </button> -->
    </div>

    <ul>
      <li 
        class="d-flex"
        v-for="(el, index) in storageList" 
        :key="index"
      >
        <div class="storage-food d-flex" :class="setDeadlineClass(el)">
          <input v-model="el.selected" @change="changeCheckbox" :name="el.name" :index="index" :id="el.name" type="checkbox">
          <div class="missing-days">
            {{ el.missingDays }}
          </div>
          <div class="list-name">
            {{ el.name }}
          </div>
        </div>
        <div class="operation d-flex">
          <!-- <div class="edit">
            <font-awesome-icon icon="fa-solid fa-pen" />
          </div> -->
          <div @click="deleteFood(index)" class="delete">
            <font-awesome-icon icon="fa-solid fa-trash" />      
          </div>
          <div class="toShopping">
              <font-awesome-icon icon="fa-solid fa-cart-shopping" />
          </div>

        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { supabase } from '../../supabase';
// import Food from "../../components/food/Food.vue";
import PopupMessage from "../../components/PopupMessage.vue";
import loaderMixin from "../../mixins/loaderMixin.js"


export default {
  name: 'StorageList',
  mixins: [loaderMixin],
  components: {
    PopupMessage,
  },
  props: {
  },
  data(){
    return{
      user: {},
      storageListOriginal: [],
      storageList: [],
      panelDelete: false,
      selectedList: [],
      // selected: 0,
      selectedIndex: Number,
      popupMessage: "",
      popupType: "",
      triggerPopup: false,
      storages: [
        "All",
        "Frigorifero",
        "Dispensa",
        "Freezer"
      ],
      storageFilter: "All"
    }
  },
  created(){
    let stringUserData = window.sessionStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    let vue = this;
    this.changeLoader(true);
    this.getStorageList().then((data)=>{
      this.changeLoader(false);
      vue.storageList = data;
      vue.storageListOriginal = data;
      let today = new Date();
      vue.storageList.forEach(el=>{
        let elDate = new Date(el.deadline);
        el.selected = false;
        var timeinmilisec = elDate.getTime() - today.getTime();
        el.missingDays = Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));
      })
    })
  },
  methods:{
    applyFilter(){
      let vue = this;
      if(this.storageFilter == "All"){
        this.storageList = this.storageListOriginal;
      } else{
        this.storageList = this.storageListOriginal.filter(el=>{
          if("storage" in el && el.storage !== null){
            return el.storage.toLowerCase() === vue.storageFilter.toLowerCase();
          }
        });
      }
    },
    removeSelection(){
      this.selectedList = [];
      this.storageList.forEach(el => {
        el.selected = false;
      });
    },
    multipleAction(){
      if(this.selectedList.length > 0){
        let selectedEl = this.shoppingList.filter(el=>el.selected);
        console.log(selectedEl);
      }
    },
    multipleList(){

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
      console.log(this.selectedList);
    },
    getStorageList(){
      return new Promise((resolve, reject)=>{
        let vue = this;
        supabase
          .from("food")
          .select()
          .eq('user_id', vue.user.id)
          .eq('shoppingList', false)
          .order("deadline")
          .then((data)=>{
            resolve(data.data);
          })
          .catch((err)=>{
            reject(err);
          })
      })
    },
    setDeadlineClass(food){
      let deadlineClass;
      if(food.missingDays < 0){
        deadlineClass = "garbage-food";
      } else if(food.missingDays < 4){
        deadlineClass = "limit-food";
      } else if(food.missingDays < 8){
        deadlineClass = "warning-food";
      } else{
        deadlineClass = "far-food";
      }
      return deadlineClass;
    },
    deleteFood(index){
      this.panelDelete = true;
      this.selectedIndex = index
    },
    eatenFood(){
      let vue = this;
      supabase
        .from('food')
        .delete()
        .eq('id', this.storageList[this.selectedIndex].id)
        .then((data)=>{
          console.log(data);
          // popup operazione andata a buon fine
          // popup operazione andata a buon fine
          vue.popupMessage = `${vue.storageList[this.selectedIndex].name} contrassegnato come mangiato!`
          vue.popupType = "success";
          vue.triggerPopup = true;

          vue.storageList.splice(vue.selectedIndex, 1);
          vue.panelDelete = false;
        })
        .catch((err)=>{
          console.log(err);
        })
    },
    toGarbage(){
      let vue = this;
      let garbageFood = {
        deadline: this.storageList[this.selectedIndex].deadline,
        id: this.storageList[this.selectedIndex].id,
        name: this.storageList[this.selectedIndex].name,
        garbage: true,
        garbageDate: new Date()
      }
      supabase
        .from("food")
        .update(garbageFood)
        .eq('id', garbageFood.id)
        .select()
        .then((data)=>{
          console.log(data);
          // popup operazione andata a buon fine
          vue.popupMessage = `${garbageFood.name} buttato!`
          vue.popupType = "success";
          vue.triggerPopup = true;

          vue.storageList.splice(vue.selectedIndex, 1);
          vue.panelDelete = false;
        })
        .catch((error)=>{
          console.log(error);
        })

    }
  }
}
</script>

<style lang="scss">
  .storage-list-appbar{
    position: fixed;
    top: 0;
    width: 100%;
    height: 80px;
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
      height: 45px;
      width: 120px;
      font-size: 20px;
    }
  }
  .storage-list{
    .header{
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      h1{
        padding-bottom: 3px;
        border-bottom: 3px solid var(--color-3);
      }
      div{
        align-items: center;
      }
      button{
        width: 120px;
      }
      select{
        margin-left: 8px;
      }
    }
    li{
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      .storageFood{

      }
      .missing-days{
        width: 40px;
        margin: 0 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius);
      }
      .garbage-food{
        .missing-days{
          background-color: black;
          color: white;
        }
      }
      .limit-food{
        .missing-days{
          background-color: #f8d7da;
          color: #721c24;
        }
      }
      .warning-food{
        .missing-days{
          background-color: #fff3cd;
          color: #856404;
        }
      }
      .far-food{
        .missing-days{
          background-color: #d4edda;
          color: #155724;
        }
      }
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
          width: 90%;
          height: 180px;
          padding: 20px;
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
      }
      .choice{
        justify-content: space-between;
        button{
          height: 60px;
          width: 45%;
        }
      }
      .addToShoppingList{
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        input[type=checkbox]{
          width: 20px;
          height: 20px;
          margin-left: 8px;
        }
      }
    }
  }
</style>
