import { clamp } from "../../helper";
import { LightDrain } from "../Modes/TallGrass/StatusEffects/LightDrain";

export const Illuminating = superclass => class extends superclass {
  constructor({ lightRange = 8, lightColor = '#f9d091', lightDrain = true, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('ILLUMINATING');
    this.lightRange = lightRange
    this.lightColor = lightColor
    this.lightDrain = lightDrain
    if (lightDrain) this.initializeDrainEffect()
  }

  setLightRange(value) {
    this.lightRange = clamp(value, 1, 10)
  }

  incrementLightRange(amount = 1) {
    this.setLightRange(this.lightRange + amount)
  }

  decrementLightRange(amount = 1) {
    this.setLightRange(this.lightRange - amount)
  }

  initializeDrainEffect() {
    const effect = new LightDrain({
      game: this.game,
      actor: this,
      stepInterval: 1000
    })
    
    this.game.engine.addStatusEffect(effect)
  }
};
