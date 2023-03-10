import { Howl, Howler } from 'howler';

export default {
  fire_0: new Howl({
    src: [window.PUBLIC_URL + '/sounds/fire-00.mp3'],
    volume: 0.5,
    loop: true,
  }),
  fire_1: new Howl({
    src: [window.PUBLIC_URL + '/sounds/fire-01.mp3'],
    volume: 0.05,
    loop: true,
  }),
  scream_0: new Howl({
    src: [window.PUBLIC_URL + '/sounds/scream-00.wav']
  }),
  scream_1: new Howl({
    src: [window.PUBLIC_URL + '/sounds/scream-01.wav']
  }),
  scream_2: new Howl({
    src: [window.PUBLIC_URL + '/sounds/scream-02.wav']
  }),
  water_0: new Howl({
    src: [window.PUBLIC_URL + '/sounds/water-04.wav']
  }),
  water_1: new Howl({
    src: [window.PUBLIC_URL + '/sounds/water-05.wav']
  }),
  chop_0: new Howl({
    src: [window.PUBLIC_URL + '/sounds/chop-00.wav'],
    volume: 0.2,
  }),
  chop_1: new Howl({
    src: [window.PUBLIC_URL + '/sounds/chop-01.wav'],
    volume: 0.2,
  }),
  equip_0: new Howl({
    src: [window.PUBLIC_URL + '/sounds/equip-00.wav'],
    volume: 0.2,
  }),
  equip_1: new Howl({
    src: [window.PUBLIC_URL + '/sounds/equip-01.wav'],
    volume: 0.2,
  }),
  explosion_0: new Howl({
    src: [window.PUBLIC_URL + '/sounds/explosion-00.wav'],
    volume: 0.2,
  }),
  save: new Howl({
    src: [window.PUBLIC_URL + '/sounds/save.wav'],
  }),
  lose: new Howl({
    src: [window.PUBLIC_URL + '/sounds/lose-00.wav'],
  }),
  grab_0: new Howl({
    src: [window.PUBLIC_URL + '/sounds/grab-00.wav'],
    volume: 0.2,
  }),
  release_0: new Howl({
    src: [window.PUBLIC_URL + '/sounds/grab-01.wav'],
    volume: 0.2,
  }),
}