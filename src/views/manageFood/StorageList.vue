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
        <button v-if="selectedList.length === 1" @click="openEditFood(selectedList[0])" class="btn btn-primary">
          Edit
          <font-awesome-icon icon="fa-solid fa-pen-to-square" />
        </button>
        <button @click="multipleStore" class="btn btn-primary">
          Delete
          <font-awesome-icon icon="fa-solid fa-trash" />
        </button>
      </div>
    </div>
    <div 
      class="panel-delete-background" 
      :class="panelDelete ? 'show' : 'hide'"
    >
      <div class="blurred" @click="cancelPanel"></div>
      <div class="panel-delete d-flex flex-direction-column">
        <!-- <div @click="cancelPanel" class="cancel">
          <font-awesome-icon icon="fa-solid fa-x" />
        </div> -->
        <div class="food-name">
          <h4>
            {{ actualEl.name }}
          </h4>
        </div>
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
          <input v-model="enableAddToShoppingList" type="checkbox" name="addToShoppingList" id="addToShoppingList">
        </div>
      </div>

    </div>
    <div v-if="editFood" class="edit-food">
      <Food 
        mode="read"
        :propsFood="actualEl"
        @closePanel="editFood = false"
        @saved="saveEditFood"
      />     
    </div>
    <div v-else>
      <div v-if="filterType == 1" class="header-old d-flex">
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
      </div>
      <div v-else-if="filterType == 2" class="header d-flex">
        <div 
          class="filter"
          :class="isFiltered ? 'filtered' : ''"
        >
          <div 
            class="cancel-filter box" 
            :class="isFiltered ? 'show' : ''"
            @click="cancelFilter"
          >
            <font-awesome-icon icon="fa-solid fa-x" />
          </div>
          <div class="box box-filter"
            :class="index == activeFilter ? 'active' : ''"
            v-for="(storage, index) in storages" 
            :key="index" 
            :value="storage"
            v-show="!isFiltered || (isFiltered && index != 0)"
            @click="filterStorage(index)"
          >
            {{ storage }}
          </div>
        </div>
      </div>

      <ul :class="selectedList.length > 0 ? 'anable-select' : ''">
        <li
          class="d-flex"
          v-for="(el, index) in storageList" 
          :key="index"
        >
          <div class="storage-food d-flex" :class="setDeadlineClass(el)">
            <input v-model="el.selected" @change="changeCheckbox" :name="el.name" :index="index" :id="el.name" type="checkbox">
            <label class="d-flex" :for="el.name">
              <div class="missing-days">
                {{ el.missingDays }}
              </div>
              <div class="list-name">
                {{ el.name }}
              </div>
            </label>
          </div>
          <div class="operation d-flex">
            <div @click="openEditFood(index)" class="edit">
              <font-awesome-icon icon="fa-solid fa-pen-to-square" />
            </div>
            <div @click="deleteEl(index)" class="delete">
              <font-awesome-icon icon="fa-solid fa-trash" />      
            </div>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { supabase } from '../../supabase';
import Food from "src/components/food/Food.vue";
import PopupMessage from "../../components/PopupMessage.vue";
import loaderMixin from "../../mixins/loaderMixin.js";
import setAppbarTitle from "../../mixins/setAppbarTitle.js"



export default {
  name: 'StorageList',
  mixins: [loaderMixin, setAppbarTitle],
  components: {
    PopupMessage,
    Food
  },
  props: {
  },
  data(){
    return{
      user: {},
      storageListOriginal: [],
      actualEl: Object,
      storageList: [],
      panelDelete: false,
      selectedList: [],
      popupMessage: "",
      popupType: "",
      triggerPopup: false,
      storages: [
        "All",
        "Frigorifero",
        "Dispensa",
        "Freezer"
      ],
      activeFilter: 0,
      filterType: 2,
      storageFilter: "All",
      isFiltered: false,
      enableAddToShoppingList: false,
      editFood: false
    }
  },
  created(){
    this.setAppbarTitle("Storage List");
    let stringUserData = window.localStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    // sistemare gestendo local storage al posto di localStorage ma diventerebbe meno sicuro. Trovare altro metodo
    // alert(JSON.stringify(this.user));
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
    openEditFood(index){
      index = parseInt(index);
      this.editFood = true;
      this.actualEl = this.storageList[index]
    },
    deleteEl(index){
      index = parseInt(index);
      this.selectedList = [index.toString()];
      this.panelDelete = true;
      this.storageList[index].selected = true;
      this.actualEl = this.storageList[index];
    },
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
    filterStorage(index){
      this.activeFilter = index;
      let vue = this;
      if(this.storages[index] == "All"){
        this.storageList = this.storageListOriginal;
        this.isFiltered = false;
      } else{
        this.storageList = this.storageListOriginal.filter(el=>{
          if("storage" in el && el.storage !== null){
            vue.isFiltered = true;
            return el.storage.toLowerCase() === vue.storages[index] .toLowerCase();
          }
        });

      }
    },
    cancelFilter(){
      this.storageList = this.storageListOriginal;
      this.isFiltered = false;
      this.activeFilter = 0;
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
    multipleStore(){
      if(this.selectedList.length > 0){
        this.panelDelete = true;
        this.managePanel();
      }
    },
    managePanel(){
      let vue = this;
      if(this.selectedList.length > 0){
        // quello visualizzato è sempre il primo quindi piano piano li tolgo 
        this.actualEl = this.storageList[this.selectedList[0]];
      } else{
        console.log("ho finito quindi chiudo il pannello");
        this.enableAddToShoppingList = false;
        this.panelDelete = false;
        this.getStorageList().then((data)=>{
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
      }

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
          .neq('garbage', true)
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
    eatenFood(){
      let vue = this;
      supabase
        .from('food')
        .delete()
        .eq('id', this.actualEl.id)
        .then(()=>{
          // popup operazione andata a buon fine
          vue.popupMessage = `${vue.actualEl.name} contrassegnato come mangiato!`
          vue.popupType = "success";
          vue.triggerPopup = true;

          if(vue.enableAddToShoppingList){
            console.log("aggiungo anche a lista della spesa");
            vue.toShoppingList().then(()=>{
              vue.selectedList.splice(0, 1);
              vue.managePanel();
            })
          } else{
            vue.selectedList.splice(0, 1);
            vue.managePanel();
          }
        })
        .catch((err)=>{
          console.log(err);
        })
    },
    toGarbage(){
      let vue = this;
      let garbageFood = {
        deadline: this.actualEl.deadline,
        id: this.actualEl.id,
        name: this.actualEl.name,
        garbage: true,
        garbageDate: new Date()
      }
      let saved = false;
      supabase
        .from("food")
        .update(garbageFood)
        .eq('id', garbageFood.id)
        .select()
        .then((data)=>{
          if("data" in data && data.data.length > 0){
            saved = true;
            // popup operazione andata a buon fine
            vue.popupMessage = `${garbageFood.name} buttato!`
            vue.popupType = "success";
            vue.triggerPopup = true;
            if(vue.enableAddToShoppingList){
              console.log("aggiungo anche a lista della spesa");
              vue.toShoppingList().then(()=>{
                vue.selectedList.splice(0, 1);
                vue.managePanel();
              })
            } else{
              vue.selectedList.splice(0, 1);
              vue.managePanel();
            }
          }
        })
        .catch((error)=>{
          if(!saved){
            console.log(error);
            vue.popupMessage = `Attenzione, errore nello spostemento`;
            vue.popupType = "error";
            vue.triggerPopup = true;
          }
        })
    },
    toShoppingList(){
      return new Promise((resolve, reject)=>{
        let toShopping = {
          shoppingList: true,
          name: this.actualEl.name,
          description: this.actualEl.description,
          user_id: this.actualEl.user_id,
          category: this.actualEl.category
        }

        supabase
          .from("food")
          .insert(toShopping)
          .select()
          .then((data)=>{
            resolve(data.data);
          })
          .catch((err)=>{
            reject(err);
          })
      })
    },
    saveEditFood(e){
      let vue = this;
      this.getStorageList().then((data)=>{
        this.changeLoader(false);
        this.editFood = false;
        this.triggerPopup = true;
        this.popupMessage = e.message;
        this.popupType = e.type;
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
    cancelPanel(){
      let vue = this;
      this.panelDelete = false;
      this.storageList.forEach((el, index)=>{
        if(vue.selectedList.includes(index.toString())){
          el.selected = true;
        } else{
        el.selected = false;
        }
      }) 
    }
  }
}
</script>

<style lang="scss">
  .storage-list{
    @import "src/assets/partials/panel.scss"; 
    .storage-list-appbar{
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
      .action{
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
      }
      button{
        // display: flex;
        // justify-content: space-between;
        flex-grow: 1;
        margin-left: 20px;
        height: 40px;
        max-width: 120px;
        font-size: 20px;
      }
    }
    .header-old{
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
    .edit-food{
      display: flex;
      flex-direction: column;
      padding: 12px;
      flex-grow: 1;
    }
    .header{
      overflow: auto;
      position: absolute;
      left: 0;
      right: 0;
      background-color: var(--background);
      z-index: 1;
      .filter{
        display: flex;
        margin: 5px 0;
        &.filtered{
          .box-filter{
            left: 0 !important;
          }
        }
        .box{
          padding: 5px 10px;
          margin: 0 5px;
          border: 1px solid var(--primary-color);
          border-radius: 15px;
          transition: all .4s;
          &.box-filter{
            position: relative;
            left: -42px;
          }
          &.active{
            background-color: var(--primary-color);
            color: var(--contrast-primary);
          }
          &.cancel-filter{
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            position: relative;
            left: -40px;
            transition: all .4s;
            svg{
              height: 15px;
              width: 15px;
            }
            &.show{
              left: 0;
            }
          }
        }
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
        opacity: 0;
        left: 70px;
      }
    }
    ul{
      margin-top: 45px;
    }
    li{
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      position: relative;
      left: -35px;
      transition: all .5s;
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
        opacity: 0;
        transition: all .3s;
      }
      .storage-food{
        flex-grow: 1;
        label{
          flex-grow: 1;
        }
      }
      .operation{
        position: relative;
        left: 35px;
        opacity: 1;
        cursor: pointer;
        transition: all .3s;
        svg{
          font-size: 20px;
          margin: 0 8px;
        }
      }
    }
    .panel-delete-background{
      .panel-delete{
        height: 180px;
      }
      .food-name{
        display: flex;
        justify-content: center;
        width: 100%;
        font-size: 22px;
        h4{
          padding-bottom: 5px;
          border-bottom: 2px solid var(--primary-color);
        }
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
        width: 100%;
        input[type=checkbox]{
          width: 20px;
          height: 20px;
          margin-left: 8px;
        }
      }
    }
  }
</style>
