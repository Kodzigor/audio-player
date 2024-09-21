import { data } from './data.js';
import { handleTime } from './utils.js';

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
    this.audioList.innerHTML = '';
  },

  renderItem({ id, track, group, genre, link, duration }) {
    const [image] = link.split('.');
    const time = handleTime(duration);

    return `
       <li class="app__track track" data-id="${id}">

            <img class="track__image" src="./assets/images/${image}.jpg">
            <div class="track__heading">
              <span class="track__title">${track}</span>
              <span class="track__author">${group}</span>
            </div>

            <div class="track__genre">${genre}</div>
            <div class="track__duration">${time}</div>
            <svg class="app__icon app__icon-small play">
              <use xlink:href="./assets/icons/sprite.svg#play-solid"></use>
            </svg>

        </li>
    `;
  },

  loadTracks(item) {
    this.audioList.innerHTML += this.renderItem(item);
  },

  renderAudios() {
    data.forEach(item => {
      const audio = new Audio(`./assets/audio/${item.link}`);

      audio.addEventListener('loadeddata', () => {
        const newItem = { ...item, duration: audio.duration, audio };

        this.state.audios = [...this.state.audios, newItem];
        this.loadTracks(newItem);
      });
    });
  },
};

AudioController.intit();
