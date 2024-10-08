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
  },

  initVariables() {
    this.audioList = document.querySelector('.app__tracks');
    this.audioList.innerHTML = '';
    this.play = document.querySelector('.app__play');
    this.next = document.querySelector('.next');
    this.prev = document.querySelector('.prev');
    this.progressBar = document.querySelector('.app__progress-level');
    this.volumeBar = document.querySelector('.volume__level');
    this.volumeIcon = document.querySelector('.volume__icon');
  },

  initEvents() {
    this.audioList.addEventListener('click', this.handleCurrentItem.bind(this));
    this.play.addEventListener('click', this.handleAudioPlay.bind(this));
    this.next.addEventListener('click', this.handleNext.bind(this));
    this.prev.addEventListener('click', this.handlePrev.bind(this));
    this.progressBar.addEventListener('input', this.progressBarHandler.bind(this));
    this.volumeBar.addEventListener('input', this.volumeHandler.bind(this));
    this.volumeIcon.addEventListener('click', this.volumeMuteHandle.bind(this));
  },

  handleAudioPlay() {
    const { playing, current } = this.state;
    const { audio } = current;
    console.log(playing, current);

    !playing ? audio.play() : audio.pause();

    this.state.playing = !playing;
    this.play.classList.toggle('playing', !playing);
  },

  handleNext() {
    const { current } = this.state;
    const currentEl = document.querySelector(`[data-id="${current.id}"]`);
    const next = currentEl.nextElementSibling?.dataset;
    const first = this.audioList.firstElementChild?.dataset;

    const itemId = next?.id || first?.id;

    if (!itemId) return;
    this.setCurrentItem(itemId);
  },

  handlePrev() {
    const { current } = this.state;
    const currentEl = document.querySelector(`[data-id="${current.id}"]`);
    const prev = currentEl.previousElementSibling?.dataset;
    const last = this.audioList.lastElementChild?.dataset;

    const itemId = prev?.id || last?.id;

    if (!itemId) return;
    this.setCurrentItem(itemId);
  },

  volumeHandler({ target }) {
    const {
      current: { audio },
    } = this.state;

    const currentVolumeLevel = target.value;
    this.volumeBar.value = currentVolumeLevel;
    audio.volume = currentVolumeLevel;

    if (audio.volume === 0) {
      this.volumeIcon.classList.add('muted');
    } else {
      this.volumeIcon.classList.remove('muted');
    }
  },

  volumeMuteHandle() {
    const {
      current: { audio },
    } = this.state;
    const currentVolumeLevel = this.volumeBar.value;

    if (audio.volume !== 0) {
      audio.volume = 0;
      this.volumeIcon.classList.toggle('muted');
    } else {
      audio.volume = currentVolumeLevel;
      this.volumeIcon.classList.toggle('muted');
    }
  },

  progressBarHandler({ target }) {
    const {
      current: { audio },
    } = this.state;
    const currentProgressValue = target.value;
    this.progressBar.currentValue = currentProgressValue;
    audio.currentTime = currentProgressValue;
  },

  audioUpdateHandler({ audio, duration }) {
    const progress = document.querySelector('.app__progress-passed');

    audio.addEventListener('timeupdate', ({ target }) => {
      const { currentTime } = target;
      this.progressBar.max = duration;
      this.progressBar.value = currentTime;

      progress.innerHTML = handleTime(currentTime);
    });
  },

  renderCurrentItem({ track, group, link, duration }) {
    const [image] = link.split('.');
    const time = handleTime(duration);

    document.querySelector('.song__title').innerHTML = track;
    document.querySelector('.song__author').innerHTML = group;
    document.querySelector('.app__progress-full').innerHTML = time;
    document.querySelector('.app__image').setAttribute('src', `./assets/images/${image}.jpg`);
  },

  pauseAudio() {
    const {
      current: { audio },
    } = this.state;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  },

  togglePlaying() {
    const { playing, current } = this.state;
    const { audio } = current;

    playing ? audio.play() : audio.pause();
    this.play.classList.toggle('playing', playing);
  },

  setCurrentItem(currentId) {
    const current = this.state.audios.find(({ id }) => +id === +currentId);

    this.pauseAudio();

    if (!current) return;
    this.state.current = current;
    this.renderCurrentItem(current);

    this.audioUpdateHandler(current);
    setTimeout(() => {
      this.togglePlaying();
    }, 10);
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

            <img class="track__image" src="./assets/images/${image}.jpg" alt="image">
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
