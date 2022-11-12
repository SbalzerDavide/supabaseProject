<template>
  <div>
    <div 
      v-show="internaShow" 
      class="popup-message"
      :class="type"
    >
        {{ content }}
      <div class="cloud-arrow"></div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'PopupMessage',
  components: {
  },
  props: {
    type: String,
    show: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ""
    }
  },
  data(){
    return{
    }
  },
  created(){
    
  },
  computed: {
    internaShow: {
      // getter
      get() {
        if(this.show){
          this.countDown();
        }
        return this.show;
      },
      // setter
      set(newValue) {
        this.$emit('showBack', newValue);
      }
    }
  },
  methods:{
    countDown(){
      setTimeout(() => {
        this.internaShow = false;
      }, 6000);
    }
  }
}
</script>

<style lang="scss">
  .popup-message{
    position: absolute;
    padding: 5px;
    bottom: calc(100% + 5px);
    left: 10px;
    border-radius: var(--border-radius);
    &.error{
      background-color: #f8d7da !important;
      color: #721c24;
    }
    .cloud-arrow{
      position: absolute;
      width: 8px;
      height: 8px;
      left: 6px;
      transform: rotate(45deg);
      border-style: solid;
      border-width: 0 1px 1px 0;
      bottom: -5px;
      border-radius: 2px;
    }
  }
  .theme-light{
    .popup-message{
      background-color: white;
      border: 1px solid #444;
      &.error{
        background-color: #f8d7da;
        color: #721c24;
        .cloud-arrow{
          background-color: #f8d7da;
        }
      }
      &.info{
        background-color: #d1ecf1;
        color: #0c5460;
        .cloud-arrow{
          background-color: #d1ecf1;
        }
      }
      &.warning{
        background-color: #fff3cd;
        color: #856404;
        .cloud-arrow{
          background-color: #fff3cd;
        }
      }
      &.success{
        background-color: #d4edda;
        color: #155724;
        .cloud-arrow{
          background-color: #d4edda;
        }
      }
      .cloud-arrow{
        background-color: white;
        border-color: #444;
      }
    }
  }
  .theme-dark{
    .popup-message{
      background-color: #444;
      border: 1px solid #888;
      color: white;
      &.error{
        background-color: #f8d7da;
        color: #721c24;
        .cloud-arrow{
          background-color: #f8d7da;
        }
      }
      &.info{
        background-color: #d1ecf1;
        color: #0c5460;
        .cloud-arrow{
          background-color: #d1ecf1;
        }
      }
      &.warning{
        background-color: #fff3cd;
        color: #856404;
        .cloud-arrow{
          background-color: #fff3cd;
        }
      }
      &.success{
        background-color: #d4edda;
        color: #155724;
        .cloud-arrow{
          background-color: #d4edda;
        }
      }
      .cloud-arrow{
        background-color: #444;
        border-color: #888;
      }
    }
  }
</style>
