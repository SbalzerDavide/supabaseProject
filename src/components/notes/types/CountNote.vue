<template>
  <div class="count-note d-flex flex-direction-column flex-grow">
    <div class="count-note-content d-flex flex-direction-column flex-grow">
      <div class="title d-flex">
        <h3 
          v-if="mode === 'read' && !enabledInputTitle"
          @click="clickToEnabledInputTitle"
        >
            {{ note.title }}
        </h3>
        <input
          v-else-if="edit || enabledInputTitle" 
          type="text" 
          ref="title"
          name="title"
          placeholder="title"
          v-model="note.title"
          @focusout="enabledInputTitle=false"
        >
      </div>
      <div class="counter">
        <div class="operator minus" @click="changeCount('-')">
          <font-awesome-icon icon="fa-solid fa-minus" />
        </div>
        <div class="counter-number">
          {{ note.count }}
        </div>
        <div class="operator plus" @click="changeCount('+')">
          <font-awesome-icon icon="fa-solid fa-plus" />
        </div>
      </div>
      <div class="comment d-flex flex-direction-column flex-grow">
        <textarea name="" id="" v-model="note.content">
        </textarea>
      </div>
    </div>
    <div class="action">
      <button @click="save" class="btn btn-primary">Save</button>
    </div>

  </div>
</template>

<script>
import { supabase } from '../../../supabase';


export default {
  name: 'CountNote',
  components: {
  },
  props: {
    mode: {
      type: String, 
      default: "read",
    },
    propsNote: Object
  },
  data(){
    return{
      user: {},
      edit: true,
      note: Object,
      enabledInputTitle: false     
    }
  },
  created(){
    let stringUserData = window.sessionStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    if(this.mode === "read" && this.propsNote !== {}){
      this.edit = false;
      this.note = this.propsNote;
    } else{
      this.edit = true;
      this.note = {
        title: "",
        content: "",
        count: 0
      }
    }
  },
  methods:{
    clickToEnabledInputTitle(){
      this.enabledInputTitle = true;
      // messo perchè l'elemento input non visibile immediatamente dopo aver settato la proprietà
      setTimeout(() => {
        this.$refs.title.focus();
      }, 5);
    },
    changeCount(operation){
      if(operation === "+"){
        this.note.count++;
      } else if(operation === "-"){
        this.note.count--;
      }
    },
    save(){
      let vue = this;
      if(this.title !== ""){
        if("id" in this.note){
          // nota già esistente quindi faccio upsert
          let updateNote = {
            user_id: this.user.id,
            title: this.note.title,
            content: this.note.content,
            type: "free",
          }
          supabase
            .from("notes")
            .update(updateNote)
            .eq('id', this.note.id)
            .then((data)=>{
              console.log(data);
              this.$emit('saved', {
                message: "La nota è stata salvato correttamente",
                type: "success"
              })
            })
            .catch((error)=>{
              console.log(error);
            })

        } else{
          // nota nuova quindi faccio insert
          let newNote = {
            user_id: this.user.id,
            title: this.note.title,
            content: this.note.content,
            type: "count",
          }
          supabase
            .from("notes")
            .insert(newNote)
            .select()
            .then((data)=>{
              // richiamo componente per messaggio successo salvataggio
              vue.note.id = data.data[0].id;
              this.$emit('saved', {
                message: "La nota è stata salvata correttamente",
                type: "success"
              })
            })
            .catch((err)=>{
              console.log(err);
              this.$emit('saved', {
                message: "Attenzione! Errore salvataggio nota",
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
  .count-note{
    .title{
      height: 40px;
      align-items: center;
    }
    .counter{
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px 0;
    }
    .operator{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      background-color: var(--background-primary);
    }
    .counter-number{
      display: flex;  
      align-items: center;
      justify-content: center;
      min-width: 40px;
      margin: 0 10px;
    }
    textarea{
      width: 100%;
      height: 100%;
      padding: 10px;
      resize: none;
    }
    .action{
      margin-top: 10px;
    }
  }
</style>
