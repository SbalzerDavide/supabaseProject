export default {
  methods: {
    setAppbarTitle(value) {
      const setAppbarTitle = new CustomEvent('setAppbarTitle', {
        bubbles: true,
        detail: {
          title: value
          }
      });
      window.dispatchEvent(setAppbarTitle);
    }
  }
};