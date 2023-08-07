<template>
  <div class="new-note d-flex flex-direction-column flex-grow">
    <!-- <PopupMessage 
      :content="popupMessage" 
      position="center"
      :type="popupType" 
      :show="triggerPopup" 
      @showBack="triggerPopup=false"
    /> -->
    <div class="header d-flex">
      <h1>new note</h1>
    </div>
    <div class="new d-flex flex-direction-column flex-grow">
      <div class="type">
        <select v-model="type" name="types">
          <option 
            v-for="(type, index) in types" 
            :key="index" 
            :value="type"
            :selected="type=='free' ? 'selected' : ''"
          >
            {{ type }}
          </option>
        </select>
      </div>
      <div class="noteType d-flex flex-direction-column flex-grow">
        <FreeNote 
          v-if="type==='free'" 
          mode="edit" 
          @saved="showMessage"
        />
        <CountNote 
          v-else-if="type==='count'" 
          mode="edit" 
          @saved="showMessage"
          />
      </div>
    </div>
  </div>
</template>

<script>
import FreeNote from "../../components/notes/types/FreeNote.vue";
import CountNote from "../../components/notes/types/CountNote.vue";
// import PopupMessage from "../../components/PopupMessage.vue"
import popupMessageMixin from "../../mixins/sendPopupMessage.js"


export default {
  name: 'Notes',
  mixins: [popupMessageMixin],
  components: {
    FreeNote,
    CountNote,
    // PopupMessage
  },
  props: {
    
  },
  data(){
    return{
      user: {},
      title: "",
      content: "",
      types: [
        "free",
        "count",
        "todo"
      ],
      type: "free",
      // popupMessage: "",
      // popupType: "",
      // triggerPopup: false
    }
  },
  created(){
    let stringUserData = window.localStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
  },
  methods:{
    showMessage(e){
      // this.triggerPopup = true;
      // this.popupMessage = e.message;
      // this.popupType = e.type;
      let popupMessage = {
        popupMessage: e.message,
        triggerPopup: true,
        popupType: e.type
      }      
      this.sendPopupMessage(popupMessage)
    },
  }
}
</script>

<style lang="scss">
  .notes{
    .header{
      justify-content: center;
      margin-bottom: 8px;
      h1{
        padding-bottom: 3px;
        border-bottom: 3px solid var(--color-3);
      }
    }
    .new{
      select{
        width: 100%;
        margin-bottom: 8px;
      }
      input{
        margin-bottom: 8px;
      }
      // .type{
      //   margin-bottom: 8px;
      // }
    }
  }
</style>
