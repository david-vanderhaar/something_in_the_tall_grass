import { getTileAtPosition } from '../../../../helper';
import {Base} from '../../../StatusEffects/Base';
import { COLORS } from '../theme';


export class LayGrass extends Base {
  constructor({...args}) {
    super({ ...args });
    this.name = 'flattened';
    this.allowDuplicates = true
    this.processOnlyOnPlayerTurn = true
    const rendererOriginal = {
      ...this.actor.renderer
    }
    const rendererFlattened = {
      color: COLORS.sandy_brown,
      background: COLORS.brown_sugar,
    };

    this.onStart = () => {
      this.actor.renderer = {
        ...this.actor.renderer,
        ...rendererFlattened
      }

      this.actor.lightPassable = true
    }

    this.onStep = (timePassed) => {
      const tile = getTileAtPosition(this.game, this.actor.getPosition())
      if (tile.entities.length > 1) this.timeToLive += timePassed
    }

    this.onStop = () => {
      this.actor.renderer = {
        ...rendererOriginal
      }

      this.actor.lightPassable = false
    }
  }
}