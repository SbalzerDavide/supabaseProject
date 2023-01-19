<template>
  <div class="list-notes">
    <PopupMessage 
      :content="popupMessage" 
      position="bottom"
      :type="popupType" 
      :show="triggerPopup" 
      @showBack="triggerPopup=false"
    />
    <button @click="goToNew" class="btn btn-primary add-new-note float">
      <font-awesome-icon icon="fa-solid fa-plus" />
    </button>
    <div class="header">
      <h1>Note ({{ this.notes.length }})</h1>
    </div>

    <!-- panel confermata delete -->
    <div 
      class="panel-delete-background"
      :class="panelDelete ? 'show' : 'hide'"
    >
      <div class="blurred" @click="panelDelete = false"></div>
      <div class="panel-delete d-flex flex-direction-column">
        <h4>Sei sicuro di voler eliminare la nota?</h4>
        <div class="action d-flex">
          <button @click="deleteNote(selectedIndex)" class="btn btn-primary">
            Conferma
          </button>

        </div>
      </div>
    </div>

    <ul>
      <li 
        class="note" 
        v-for="(note, index) in notes" 
        :key="index"
      >
        <div class="note-background" @click="openNote(index)">
          <div class="title">
            {{ note.title }}
          </div>
          <div class="content">
          </div>
          <div class="type">
          </div>   
        </div>
        <div class="note-foreground">
          <!-- <div class="delete" @click="deleteNote(index)"> -->
          <div class="delete" @click="selectNoteForDelete(index)">
            <font-awesome-icon icon="fa-solid fa-trash" />
          </div>     
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { supabase } from "../../supabase.js";
import PopupMessage from "../../components/PopupMessage.vue";
import loaderMixin from "../../mixins/loaderMixin.js"


export default {
  name: 'NotesList',
  mixins: [loaderMixin],
  components: {
    PopupMessage
  },
  props: {
  },
  data(){
    return{
      user: {},
      notes: [],
      panelDelete: false,
      selectedIndex: Number,
      popupMessage: "",
      popupType: "",
      triggerPopup: false,
    }
  },
  created(){
    let vue = this;
    let stringUserData = window.localStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    this.changeLoader(true);
    this.getNotes().then((data)=>{
      vue.notes = data;
      vue.changeLoader(false);
    });
  },
  methods:{
    goToNew(){
      this.$router.push({ path: 'new', replace: true })
    },
    selectNoteForDelete(index){
      this.selectedIndex = index;
      this.panelDelete = true;
    },
    deleteNote(index){
      let vue = this;
      supabase
        .from('notes')
        .delete()
        .eq('id', this.notes[index].id)
        .then((data)=>{
          console.log(data);
          vue.notes.splice(index, 1);
          // show message delete
          vue.popupMessage = "Nota eliminata";
          vue.popupType = "success";
          vue.triggerPopup = true;
          vue.panelDelete = false;
        })
        .catch((err)=>{
          console.log(err);
        })
    },
    getNotes(){
      return new Promise((resolve, reject)=>{
        let vue = this;
        supabase
          .from("notes")
          .select()
          .eq('user_id', vue.user.id)
          // verificare che questo order faccia veramente quello che voglio, ovvero che mi ordini in maniera discendete le note
          .order('id', { ascending: false })
          .then((data)=>{
            resolve(data.data);
          })
          .catch((err)=>{
            reject(err);
          })
      })
    },
    openNote(index){
      let vue = this;
      this.$router.push({ 
        name: "ShowNote", 
        params: {
          propsNote: vue.notes[index]
        } 
      })
    }
  }
}
</script>

<style lang="scss">
  .notes{
    @import "src/assets/partials/panel.scss"; 
    .header{
      display: flex;
      justify-content: center;
      padding: 0 12px;
      h1{
        padding-bottom: 3px;
        border-bottom: 3px solid var(--color-3);
      }
    }
    li{
      list-style: none;
      margin-top: 8px;
    }
    .note{
      position: relative;
      display: flex;
      border-radius: var(--border-radius);
      background-color: var(--background-hover);
      // background-color: var(--color-3);
      cursor: pointer;
      // &:hover{
      //   background-color: var(--background-hover);
      // }
      .note-background{
        margin-right: 34px;
        width: 100%;
        padding: 8px;
      }
      .note-foreground{
        position: absolute;        
        right: 20px;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        align-self: flex-end;
        z-index: 1;
      }
      .delete{
        &:hover{
          transform: scale(1.2);
          transition: all .3s;
        }
      }
    }
  }
  .add-new-note{
    &.float{
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      margin: 10px;
      z-index: 5;
      border-radius: 50%;
    }
  }

</style>
