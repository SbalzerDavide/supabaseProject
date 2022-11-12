<template>
  <div id="home">
    <h3>Completa i dati per il tuo account</h3>
    <div>
      <input 
        type="text" 
        v-model="username"
        placeholder="username"
      >
      <input 
        type="text" 
        v-model="website"
        placeholder="website"
      >
      <button @click="upsert">Inserisci</button>
    </div>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { supabase } from "../supabase.js";


export default {
  name: 'App',
  components: {
  },
  props: {
    session: Object
  },
  data(){
    return{
      username: "",
      website: "",
    }
  },
  mounted(){
    console.log("fatto mounted");
    console.log(this.session);
    this.getProfiles()
  },
  methods:{
    getProfiles(){
      try {
        const { user } = this.session;
        supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq('id', user.id)
          .single()
          .then((data)=>{
            console.log(data);
          })
      } catch (error) {
        alert(error.message)
      } finally {
        console.log("ho finito");
      }
    },
    upsert(){
      const { user } = this.session;

      const updates = {
        id: user.id,
        username: this.username,
        website: this.website,
        updated_at: new Date(),
      }
      supabase.from("profiles").upsert(updates)
        .then((data)=>{
          console.log(data);
        })
        .catch((error)=>{
          console.log(error);
        })

    },
    logout(){
      let vue = this;
      supabase.auth.signOut()
        .then(()=>{
          // vue.$emit('logout', true);
          vue.$router.push({ name: 'App', params: {} })
        })
        .catch((error)=>{
          console.log(error);
        })
    }
  }
}
</script>

<style>
</style>
