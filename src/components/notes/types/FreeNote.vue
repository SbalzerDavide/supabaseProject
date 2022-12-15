<template>
  <div class="free-note d-flex flex-direction-column flex-grow">
    <div class="free-note-content d-flex flex-grow">
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
      <div class="content flex-grow">
        <textarea 
          name="content" 
          cols="30" 
          v-model="note.content"
          @input="changeTextarea = true"
        >
        </textarea>
      </div>
    </div>
    <div v-if="mode=='edit' || (changeTextarea || enabledInputTitle)" class="action">
      <button @click="save" class="btn btn-primary">Save</button>
    </div>

  </div>
</template>

<script>
import { supabase } from '../../../supabase';


export default {
  name: 'FreeNote',
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
      // in seguito attivare questa variabile solo al click oppure se nuova nota sempre true
      enabledInputTitle: false,
      changeTextarea: false,
    }
  },
  // computed: {
  //   note: {
  //     // getter
  //     get() {
  //       if(this.show){
  //         this.countDown();
  //       }
  //       return this.show;
  //     },
  //     // setter
  //     set(newValue) {
  //       this.$emit('showBack', newValue);
  //     }
  //   }
  // },

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
                message: "La nota è stata salvata correttamente",
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
            type: "free",
          }
          supabase
            .from("notes")
            .insert(newNote)
            .select()
            .then((data)=>{
              vue.note.id = data.data[0].id;
              this.$emit('saved', {
                message: "La nota è stata salvata correttamente",
                type: "success"
              })
              vue.$router.push({ path: 'list', replace: true })

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
  .free-note{
    .title{
      height: 40px;
      align-items: center;
      h3, input{
        width: 100%;
      }
    }
    .free-note-content{
      flex-direction: column;
      .content{
      }
    }
    textarea{
      width: 100%;
      height: 100%;
      min-height: 200px;
      padding: 10px;
    }
    .action{
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
      button{
        width: 150px;
        height: 50px;
      }
    }
  }
</style>
