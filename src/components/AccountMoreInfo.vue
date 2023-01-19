<template>
  <div class="account-more-info">
    <h3>Completa i dati per il tuo account</h3>
    <div class="input-info">
      <div>
        <label for="username">Username</label>
        <input 
          name="username"
          type="text" 
          v-model="username"
          placeholder="username"
        >
      </div>
      <div>
        <label for="website">Website</label>
        <input 
          name="website"
          type="text" 
          v-model="website"
          placeholder="website"
        >
      </div>
    </div>
    <div class="action d-flex">
      <button class="btn btn-primary" @click="upsert">Inserisci</button>
    </div>
    <div class="close d-flex" @click="close">
      <font-awesome-icon icon="fa-solid fa-xmark" />
    </div>
  </div>
</template>

<script>
import { supabase } from "../supabase.js";


export default {
  name: 'AccountMoreInfo',
  components: {
  },
  props: {
  },
  data(){
    return{
      username: "",
      website: "",
      user: {}
    }
  },
  created(){
    let stringUserData = window.localStorage.getItem("userData");
    if(stringUserData != null){
      this.user = JSON.parse(stringUserData);
    }
    console.log(this.user);
  },
  methods:{
    close(){
      this.$emit("closeMoreInfo", true)
    },
    upsert(){
      let vue = this;
      const updates = {
        id: this.user.id,
        username: this.username,
        website: this.website,
        updated_at: new Date(),
      }
      supabase.from("profiles").upsert(updates)
        .then((data)=>{
          console.log(data);
          // aggiorno il valore di userData
          vue.user.username = vue.username;
          vue.user.website = vue.website;
          window.localStorage.setItem("userData", JSON.stringify(vue.user));
        })
        .catch((error)=>{
          console.log(error);
        })

    },
  }
}
</script>

<style lang="scss">
  .account-more-info{
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius);
    padding: 10px;
    position: relative;
    h3{
      margin: 10px 0;
    }
    .action{
      // display: flex;
      justify-content: flex-end;
    }
    .input-info{
      &>div{
        margin: 10px 0;
      }
      label{
        display: inline-block;
        width: 100px;
      }
    }
    .close{
      position: absolute;
      height: 24px;
      width: 24px;
      background-color: var(--primary-color);
      border-radius: 50%;
      top: -12px;
      right: -12px;
      // display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
    }
  }

</style>
