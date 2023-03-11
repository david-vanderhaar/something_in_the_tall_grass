import { getRandomInArray } from '../../../../../helper';
import { Trap } from '../../../../Entities';
import { DamageOnContact } from '../../../../StatusEffects/DamageOnContact';
import { COLORS } from '../../theme';

export const Brambles = (engine, pos, attackDamage = 1, useCount = 1) => {
  const trap = new Trap({
    game: engine.game,
    name: 'bramble bush',
    passable: true,
    lightPassable: false,
    pos,
    renderer: {
      character: getRandomInArray(["'", '.', '"', ',']),
      sprite: '',
      background: COLORS.sunset,
      color: COLORS.ebony,
    },
    enemyFactions: ['PEOPLE'],
  });

  const effect = new DamageOnContact({
    actor: trap,
    game: engine.game,
    damage: attackDamage,
    useCount,
    messageOnDamage: `brambles, beware. does ${attackDamage} damage.`,
    messageType: {
      color: COLORS.sunset,
      backgroundColor: COLORS.ebony,
    },
  })
  engine.addStatusEffect(effect);
  return trap
}