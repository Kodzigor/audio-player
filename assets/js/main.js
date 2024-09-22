import { data } from './data.js';
import { handleTime } from './utils.js';

const AudioController = {
  state: {
    audios: [],
    current: data[0],
    playing: false,
  },

  intit() {
    this.initVariables();
    this.initEvents();
    this.renderAudios();
    this.renderCurrentItem(this.state.current);
  },

  initVariables() {
    this.audioList = document.querySelector('.app__tracks');
    this.audioList.innerHTML = '';
    this.playButton = null;
  },

  initEvents() {
    this.audioList.addEventListener('click', this.handleCurrentItem.bind(this));
  },

  handleAudioPlay() {
    const { playing, current } = this.state;
    const { audio } = current;

    !playing ? audio.play() : audio.pause();

    this.state.playing = !playing;
    this.playButton.classList.toggle('playing', !playing);
  },

  handlePlayer() {
    const play = document.querySelector('.app__play');
    this.playButton = play;

    play.addEventListener('click', this.handleAudioPlay.bind(this));
  },

  audioUpdateHandler({ audio, duration }) {
    const progressBar = document.querySelector('.app__progress-level');
    const progress = document.querySelector('.app__progress-passed');

    audio.addEventListener('timeupdate', ({ target }) => {
      const { currentTime } = target;
      progressBar.max = duration;
      progressBar.value = currentTime;

      progress.innerHTML = handleTime(currentTime);
    });
  },

  renderCurrentItem({ id, track, group, genre, link, duration }) {
    const [image] = link.split('.');
    const time = handleTime(duration);

    document.querySelector('.song__title').innerHTML = track;
    document.querySelector('.song__author').innerHTML = group;
    document.querySelector('.app__progress-full').innerHTML = time;
    document.querySelector('.app__image').setAttribute('src', `./assets/images/${image}.jpg`);
  },

  setCurrentItem(currentId) {
    const current = this.state.audios.find(({ id }) => +id === +currentId);

    if (!current) return;
    this.state.current = current;
    this.renderCurrentItem(current);

    this.handlePlayer();
    this.audioUpdateHandler(current);
  },

  handleCurrentItem({ target }) {
    const id = target.closest('.app__track') ? target.closest('.app__track').dataset.id : null;
    if (!id) return;

    this.setCurrentItem(id);
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
