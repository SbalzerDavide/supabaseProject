export default {
  methods: {
    changeLoader(value) {
      const changeLoader = new CustomEvent('changeLoader', {
        bubbles: true,
        detail: {
          loader: value
          }
      });
      window.dispatchEvent(changeLoader);
    }
  }
};