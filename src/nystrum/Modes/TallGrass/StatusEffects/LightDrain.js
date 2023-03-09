import {Base} from '../../../StatusEffects/Base';
import { COLORS } from '../theme';

export class LightDrain extends Base {
  constructor({...args}) {
    super({ ...args });
    this.name = 'light drain';
    this.description = "all lights give out eventually"
    this.allowDuplicates = false
    this.processOnlyOnPlayerTurn = true
    this.lifespan = -1
    this.renderer = {
      color: COLORS.white,
      background: COLORS.sunset,
      character: 'o'
    }


    this.onStep = (timePassed) => {
      if (!this.actor.entityTypes.includes('ILLUMINATING')) return

      this.actor.decrementLightRange()
    }
  }
}