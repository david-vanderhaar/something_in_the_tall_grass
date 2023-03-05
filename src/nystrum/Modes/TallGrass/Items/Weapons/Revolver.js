import * as Constant from '../../../../constants';
import {RangedWeapon} from '../../../../Entities/index';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import {COLORS} from '../../../Jacinto/theme';

export const Revolver = ({engine, position}) => new RangedWeapon({
  game: engine.game,
  name: 'Revolver',
  passable: true,
  attackRange: 6,
  magazineSize: 10,
  baseRangedAccuracy: 1,
  baseRangedDamage: 2,
  attackDamage: 1,
  pos: position,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'r',
    color: COLORS.base3,
    background: COLORS.base01,
  },
  rangedHitSounds: [
    JACINTO_SOUNDS.pistol_fire_01,
    JACINTO_SOUNDS.pistol_fire_02,
  ],
  rangedMissSounds: [
    JACINTO_SOUNDS.bullet_miss_01,
    JACINTO_SOUNDS.bullet_miss_02,
    JACINTO_SOUNDS.bullet_miss_03,
  ]
});
