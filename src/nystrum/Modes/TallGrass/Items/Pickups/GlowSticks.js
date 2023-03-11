import * as Helper from '../../../../../helper';
import {GlowingPickup} from '../../../../Entities/index';
import {COLORS} from '../../theme';

export const GlowStick = (engine, position) => {
  let isUsed = false

  function activateLight(actor, item) {
    if (isUsed) return
    item.incrementLightRange(3)
    item.name = 'used glow stick'
    item.renderer.color = COLORS.gray
    item.addDescriptor('a used battery, not much use anymore.')
    isUsed = true
  }

  return new GlowingPickup({
    name: 'glow stick',
    passable: true,
    lightPassable: true,
    baseDescription: 'the C.C.C. doesn\'t generally give these out. luminescent chemical is too unstable they said.',
    lightRange: 0,
    lightColor: Helper.getRandomInArray([COLORS.green, COLORS.violet, COLORS.magenta, COLORS.blue]),
    pos: position,
    renderer: {
      character: 'i',
      sprite: '',
      color: COLORS.white,
      background: 'transparent',
    },
    dropEffects: [activateLight]
  });
}
