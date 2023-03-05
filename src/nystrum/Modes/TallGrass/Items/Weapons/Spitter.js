import * as Constant from '../../../../constants';
import {RangedWeapon} from '../../../../Entities/index';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import {COLORS} from '../../../Jacinto/theme';

export const SpitterSac = (engine, position) => new RangedWeapon({
  game: engine.game,
  name: 'spitter sac',
  passable: true,
  attackRange: 4,
  magazineSize: 10,
  baseRangedAccuracy: 0.6,
  baseRangedDamage: 1,
  attackDamage: 1,
  pos: position,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'o',
    color: COLORS.green,
    background: COLORS.base01,
  },
  rangedHitSounds: [ // update
    JACINTO_SOUNDS.pistol_fire_01,
    JACINTO_SOUNDS.pistol_fire_02,
  ],
  rangedMissSounds: [ // update
    JACINTO_SOUNDS.bullet_miss_01,
    JACINTO_SOUNDS.bullet_miss_02,
    JACINTO_SOUNDS.bullet_miss_03,
  ]
});
