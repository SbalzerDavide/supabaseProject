<template>
  <div class="list-notes">
    <ul>
      <li 
        class="note" 
        v-for="(note, index) in notes" 
        :key="index"
        @click="openNote(index)"
      >
        <div class="note-background">
          <div class="title">
            {{ note.title }}
          </div>
          <div class="content">
          </div>
          <div class="type">
          </div>   
        </div>
        <div class="note-foreground">
          <div class="delete" @click="deleteNote(index)">
            <font-awesome-icon icon="fa-solid fa-trash" />
          </div>     
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { supabase } from "../../supabase.js";


export default {
  name: 'NotesList',
  components: {
  },
  props: {
  },
  data(){
    return{
      user: {},
      notes: []
    }
  },
  created(){
    let vue = this;
    let stringUserData = window.sessionStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    this.getNotes().then((data)=>{
      vue.notes = data;
      console.log(vue.notes);
    });
  },
  methods:{
    deleteNote(index){
      supabase
        .from('notes')
        .delete()
        .eq('id', this.notes[index].id)
        .then((data)=>{
          console.log(data);
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
      padding: 10px;
      cursor: pointer;
      &:hover{
        background-color: var(--background-hover);
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

</style>
