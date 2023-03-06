import * as Helper from '../../../../../helper';
import {RenderedWithPickUpEffects} from '../../../../Entities/index';
import {COLORS} from '../../theme';

export const Battery = (strength = 4) => {
  let isUsed = false

  function activateLight(actor, item) {
    if (isUsed) return
  
    const pos = actor.getPosition()
    const tiles = Helper.getNeighboringTiles(actor.game.map, pos)
    const lights = tiles.reduce((acc, tile) => {
      return acc.concat(Helper.filterEntitiesByType(tile.entities, 'ILLUMINATING'))
    }, [])
  
    if (lights.length === 0) return
  
    lights.forEach((light) => light.lightRange += strength)
    item.renderer.background = COLORS.sunset
    item.renderer.color = COLORS.white
    item.addDescriptor('a spent battery, not much use anymore.')
    isUsed = true

    // spawn rare loot
  }

  return new RenderedWithPickUpEffects({
    name: 'battery',
    passable: true,
    lightPassable: true,
    renderer: {
      character: '%',
      sprite: '%',
      background: COLORS.orange,
      color: COLORS.white,
    },
    dropEffects: [activateLight]
  });
}
