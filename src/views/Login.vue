<template>
  <div class="login d-flex">
    <ThemeSwitch />
    <div class="login-container d-flex-flex-direction-column">
      <h1>login</h1>
      <div v-if="type==='login'" class="login-box">
        <div class="user">
          <label for="email"></label>
          <input 
            type="email" 
            name="email"
            v-model="email"
            placeholder="email"
          >
        </div>
        <div class="password">
          <div @click="manageShowPassword('showLoginPsw')" class="show-password d-flex">
            <font-awesome-icon v-if="showLoginPsw" icon="fa-solid fa-eye" />
            <font-awesome-icon v-else icon="fa-solid fa-eye-slash" />
          </div>
          <label for="password"></label>
          <input 
            :type="showLoginPsw ? 'text' : 'password'"
            name="password"
            v-model="password"
            placeholder="password"
            @keyup.enter="handleLogin" 
          >
        </div>
        <div class="remember d-flex">
          <input type="checkbox" name="remember" id="">
          <label for="remember">Remember me</label>
        </div>
        <div class="action d-flex">
          <button class="btn" @click="handleLogin">Login</button>
          <a @click="type='signIn'" href="#">register</a>
        </div>
      </div>
      <div v-else-if="type==='signIn'" class="login-box">
        <h3>signIn</h3>
        <div class="user">
          <label for=""></label>
          <input 
            type="email"
            v-model="email"
            placeholder="email"
          >
        </div>
        <div class="password">
          <div @click="manageShowPassword('showSignInPsw')" class="show-password d-flex">
            <font-awesome-icon v-if="showSignInPsw" icon="fa-solid fa-eye" />
            <font-awesome-icon v-else icon="fa-solid fa-eye-slash" />
          </div>

          <label for=""></label>
          <input 
            :type="showSignInPsw ? 'text' : 'password'"
            v-model="password"
            placeholder="password"
            @keyup.enter="handleSignIn" 
          >
        </div>
        <div class="password">
          <div @click="manageShowPassword('showSignInRePsw')" class="show-password d-flex">
            <font-awesome-icon v-if="showSignInRePsw" icon="fa-solid fa-eye" />
            <font-awesome-icon v-else icon="fa-solid fa-eye-slash" />
          </div>
          <label for=""></label>
          <PopupMessage 
            :content="errorPassword" 
            position="anchored"
            type="error" 
            :show="showError" 
            @showBack="showError=false"
          />
          <input 
            :type="showSignInRePsw ? 'text' : 'password'"
            v-model="passwordControl"
            v-on:focusout="rePasswordFocusout"
            placeholder="re-type password"
            @keyup.enter="handleSignIn" 
          >
        </div>
        <div class="action d-flex">
          <button class="btn" @click="handleSignIn">Sign in</button>
          <a @click="type='login'" href="#">login</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "../supabase.js";
import ThemeSwitch from "../components/ThemeSwitch.vue"
import PopupMessage from "../components/PopupMessage.vue"

export default {
  name: 'Login',
  components:{
    ThemeSwitch,
    PopupMessage
  },
  data(){
    return {
      session: null,
      type: "login",
      email: "",
      password: "",
      passwordControl: "",
      theme: "light",
      showLoginPsw: false,
      showSignInPsw: false,
      showSignInRePsw: false,
      loading: false,
      showError: false,
      errorPassword: ""
    }
  },
  created(){
    document.body.classList.add(`theme-${this.theme}`);
  },
  methods:{
    rePasswordFocusout(){
      if(this.passwordControl !== this.password){
        // mostrare in questo caso errore
        this.showError = true;
        this.errorPassword = "Inserire correttamente la conferma";
        console.log("attenzione le due password non coincidono");
      }
    },
    manageShowPassword(el){
      let internalValue = this[el];
      this.showLoginPsw = false;
      this.showSignInPsw = false;
      this.showSignInRePsw = false;
      this[el] = !internalValue;
    },
    handleMagicLink(){
      let vue = this;
      try {
        vue.loading = true
        const { error } =  supabase.auth.signInWithOtp({
          email: vue.email,
        })
        if (error) throw error
        alert('Check your email for the login link!')
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        vue.loading = false
      }
    },
    handleSignIn(){
      let vue = this;
      try {
        vue.loading = true
        const { error } =  supabase.auth.signUp({
          email: vue.email,
          password: vue.password
        })
        if (error) throw error
        alert('Check your email for the login link!')
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        vue.loading = false
      }
    },
    handleLogin(){
      let vue = this;
      supabase.auth.signInWithPassword({
          // email: vue.emailLogin,
          // password: vue.passwordLogin
          email: vue.email,
          password: vue.password
        }).then(()=>{
          console.log("router push");
          vue.$router.push({ name: 'App'})
        })
        .catch((err)=>{
          console.log(err);
        })  
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"> 
  @import "@/assets/var.scss";
  .login{
    // display: flex;
    justify-content: center;
    padding-top: 30vh;
    .login-container{
      // display: flex;
      // flex-direction: column;
      width: 280px;
      padding: 20px;
      background: var(--background-primary);
      border-radius: var(--border-radius);
      .action{
        // display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        a{
          font-size: 13px;
          align-self: flex-end;
          color: var(--text-color);
        }
      }
      .login-box > *{
        margin-bottom: 8px;
      }
      input:not([type='checkbox']){
        // margin-bottom: 8px;
        width: 100%;
      }
      input[type="checkbox"]{
        width: 20px;
        height: 20px;

      }
      .remember{
        display: flex;
        align-items: center;
        font-size: 14px;
        input{
          margin-right: 8px;
        }
      }
      .password{
        position: relative;
      }
      .show-password{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 21px;
        position: absolute;
        height: 100%;
        right: 10px;
      }
    }
    .change-theme{
      position: fixed;
      top: 25px;
      right: 40px;
    }
  }
</style>
