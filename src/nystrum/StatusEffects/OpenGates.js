import {Base} from './Base';
import {MESSAGE_TYPE} from '../message';
import * as Helper from '../../helper';

export class OpenGates extends Base {
  constructor({...args}) {
    super({ ...args });
    this.name = 'Open Inner Gates';
    this.lifespan = -1;
    this.allowDuplicates = false
    this['actor_background'] = this.actor.renderer.background;
    this['nextGate'] = this.actor.setNextGate();
    this.renderer = {
      background: '#3cc2bb',
      color: '#24fe88',
      character: this['nextGate'].character,
    }
    this.onStart = () => {
      // this.game.addMessage(`${this.actor.name} was enveloped in hardened sand.`, MESSAGE_TYPE.INFORMATION);
      // const nextGate = this.actor.setNextGate();
      // this.renderer = {
      //   background: '#3cc2bb',
      //   color: '#24fe88',
      //   character: nextGate.character,
      // }
      const nextGate = this['nextGate'];
      this.actor.speed += nextGate.buffValue;
      this.actor.energy += nextGate.buffValue;
      this.actor.attackDamage += nextGate.damageBuff;
      this.actor.renderer.character = nextGate.character;
      this.game.addMessage(`${this.actor.name} opened the ${nextGate.name}.`);
      this.actor.decreaseDurability(nextGate.durabilityDebuff);
      this.actor.decreaseDurability(0);
      this.game.addMessage(`${this.actor.name} suffers ${nextGate.durabilityDebuff} damage from physical stress.`)
    }
  }
  
  static displayName = 'Open Inner Gates'
  static getValidTargetsOnTile(tile, actor) {
    return Helper.getDestructableEntities(tile.entities).filter((entity) => actor.id !== entity.id && actor.isAlly(entity));
  }
}
