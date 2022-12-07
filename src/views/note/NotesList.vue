<template>
  <div class="list-notes">
    <PopupMessage 
      :content="popupMessage" 
      position="bottom"
      :type="popupType" 
      :show="triggerPopup" 
      @showBack="triggerPopup=false"
    />

    <!-- panel confermata delete -->
    <div 
      class="panel-delete-background"
      :class="panelDelete ? 'show' : 'hide'"
    >
      <div class="blurred" @click="panelDelete = false"></div>
      <div class="panel-delete d-flex flex-direction-column">
        <h4>Sei sicuro di voler eliminare la nota?</h4>
        <div class="action d-flex">
          <button @click="panelDelete = false" class="btn">
            Annulla
          </button>
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
    let stringUserData = window.sessionStorage.getItem("userData");
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
    li{
      list-style: none;
    }
    .note{
      position: relative;
      display: flex;
      cursor: pointer;
      &:hover{
        background-color: var(--background-hover);
      }
      .note-background{
        margin-right: 34px;
        width: 100%;
        padding: 10px;
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
        z-index: 2;
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
          opacity: 1;
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
          width: 60%;
          height: 100px;
          opacity: 0;
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
        .action{
          justify-content: space-between;
        }
        button{
          height: 50px;
          width: 45%;
        }
      }
    }
</style>
