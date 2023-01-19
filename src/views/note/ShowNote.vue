<template>
  <div class="show-note d-flex flex-direction-column flex-grow">
    <PopupMessage 
      :content="popupMessage" 
      position="bottom"
      :type="popupType" 
      :show="triggerPopup" 
      @showBack="triggerPopup=false"
    />
    <!-- <h3>show note</h3> -->


    <div class="noteType d-flex flex-direction-column flex-grow">
      <FreeNote 
        v-if="note.type==='free'" 
        mode="read" 
        :propsNote="note"
        @saved="showMessage"
      />
      <CountNote 
        v-else-if="note.type==='count'" 
        mode="read" 
        :propsNote="note"
        @saved="showMessage"
        />
    </div>
  </div>
</template>

<script>
// import { supabase } from '../../supabase';
import FreeNote from "../../components/notes/types/FreeNote.vue";
import CountNote from "../../components/notes/types/CountNote.vue";
import PopupMessage from "../../components/PopupMessage.vue"




export default {
  name: 'Notes',
  components: {
    FreeNote,
    CountNote,
    PopupMessage
  },
  props: {
    propsNote: Object
  },
  data(){
    return{
      user: {},
      popupMessage: "",
      popupType: "",
      triggerPopup: false
    }
  },
  computed: {
    note: {
      // getter
      get() {
        return this.propsNote;
      },
      // setter
      set(newValue) {
        this.$emit('showBack', newValue);
      }
    }
  },
  created(){
    console.log(this.note);
    let stringUserData = window.localStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
  },
  methods:{
    showMessage(e){
      console.log(e);
      this.triggerPopup = true;
      this.popupMessage = e.message;
      this.popupType = e.type;      
    },
    // save(){
    //   // 15/11/22 i salvataggi avvengono all'interno dei singoli componenti quindi per ora questa non è utilizzata
    //   let newNote = {
    //     user_id: this.user.id,
    //     title: this.title,
    //     content: this.content
    //   }
    //   supabase
    //     .from("notes")
    //     .insert(newNote)
    //     .then((data)=>{
    //       console.log(data);
    //       // richiamo componente per messaggio successo salvataggio
    //     })
    //     .catch((err)=>{
    //       console.log(err);
    //       // richiamo componente per messaggio errore salvataggio
    //     })
    // }
  }
}
</script>

<style lang="scss">
  .show-note{
    // padding: 12px;
    .noteType{
    }
  }
</style>
