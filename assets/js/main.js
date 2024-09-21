import { data } from './data.js';

const AudioController = {
  state: {
    audios: [],
  },
  intit() {
    this.initVariables();
    this.renderAudios();
  },

  initVariables() {
    this.audioList = document.querySelector('.app__tracks');
  },

  renderAudios() {
    data.forEach(item => {
      const audio = new Audio(`./assets/audio/${item.link}`);

      audio.addEventListener('loadeddata', () => {
        const newItem = { ...item, duration: audio.duration, audio };

        this.state.audios = [...this.state.audios, newItem];

        console.log(this.state);
      });
    });
  },
};

AudioController.intit();

const appButtons = document.querySelector('.app__buttons');
document.addEventListener('scroll', () => {
  console.log(window.client);
});
