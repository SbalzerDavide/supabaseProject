<template>
  <div class="notes d-flex flex-direction-column flex-grow">
    <PopupMessage 
      :content="popupMessage" 
      position="center"
      :type="popupType" 
      :show="triggerPopup" 
      @showBack="triggerPopup=false"
    />
    <h1>new note</h1>
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
import PopupMessage from "../../components/PopupMessage.vue"

export default {
  name: 'Notes',
  components: {
    FreeNote,
    CountNote,
    PopupMessage
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
      popupMessage: "",
      popupType: "",
      triggerPopup: false
    }
  },
  created(){
    let stringUserData = window.sessionStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
  },
  methods:{
    showMessage(e){
      this.triggerPopup = true;
      this.popupMessage = e.message;
      this.popupType = e.type;      
    },
  }
}
</script>

<style lang="scss">
  .new{
    .noteType{
    }
  }
</style>
