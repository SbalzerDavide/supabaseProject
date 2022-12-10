export default {
  methods: {
    sendPopupMessage(value) {
      const popupMessageEvent = new CustomEvent('popupMessageEvent', {
        bubbles: true,
        detail: {
          popupMessage: value
          }
      });
      window.dispatchEvent(popupMessageEvent);
    }
  }
};