<template>
  <div class="new-food d-flex flex-direction-column flex-grow">
    <PopupMessage 
      :content="popupMessage" 
      position="bottom"
      :type="popupType" 
      :show="triggerPopup" 
      @showBack="triggerPopup=false"
    />
    <!-- <h1>Add new</h1> -->
    <div class="new-food-element d-flex flex-direction-column flex-grow">
      <Food 
        mode="new"
        @saved="showMessage"
      />     
    </div>
  </div>
</template>

<script>
// import { supabase } from '../../../supabase';
import Food from "../../components/food/Food.vue";
import PopupMessage from "../../components/PopupMessage.vue";



export default {
  name: 'NewFood',
  components: {
    Food,
    PopupMessage
  },
  props: {
  },
  data(){
    return{
      popupMessage: "",
      popupType: "",
      triggerPopup: false 
    }
  },
  created(){
  },
  methods:{
    showMessage(e){
      console.log(e);
      this.triggerPopup = true;
      this.popupMessage = e.message;
      this.popupType = e.type;      
    },
  }
}
</script>

<style lang="scss">
  .new-food{
    padding: 12px;
  }

</style>
