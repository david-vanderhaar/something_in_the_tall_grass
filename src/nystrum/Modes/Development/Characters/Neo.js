// import deps
import * as Constant from '../../../constants';
import { Player } from '../../../Entities/index';
import { ContainerSlot } from '../../../Entities/Containing';
import {Say} from '../../../Actions/Say';
import {MoveOrAttack} from '../../../Actions/MoveOrAttack';
import {PrepareLooking} from '../../../Actions/PrepareLooking';
import {PrepareDirectionalThrow} from '../../../Actions/PrepareDirectionalThrow';
import {PrepareRangedAttack} from '../../../Actions/PrepareRangedAttack';
import {PrepareCallReinforcements} from '../../../Actions/PrepareCallReinforcements';
import {PrepareAreaStatusEffect} from '../../../Actions/PrepareAreaStatusEffect';
import {OpenAvailableStatusEffects} from '../../../Actions/OpenAvailableStatusEffects';
import {OpenInventory} from '../../../Actions/OpenInventory';
import {OpenEquipment} from '../../../Actions/OpenEquipment';
import {OpenUpgrades} from '../../../Actions/OpenUpgrades';
import {OpenDropInventory} from '../../../Actions/OpenDropInventory';
import {Upgrade} from '../../../Entities/Upgradable';
import {PickupAllItems} from '../../../Actions/PickupAllItems';
import { Boltok } from '../../../Items/Weapons/Boltok';
import { Snub } from '../../../Items/Weapons/Snub';
import { Lancer } from '../../../Items/Weapons/Lancer';
import { Grenade } from '../../../Items/Weapons/Grenade';
import { Ammo } from '../../../Items/Pickups/Ammo';
import {COLORS} from '../../../Modes/Jacinto/theme';
import { Reload } from '../../../Actions/Reload';
import { AddSandSkinStatusEffect } from '../../../Actions/AddSandSkinStatusEffect';
import {UpgradeResource} from '../../../Actions/ActionResources/UpgradeResource';
import { SandSkin } from '../../../StatusEffects/SandSkin';
import { MeleeDamageDebuff } from '../../../StatusEffects/MeleeDamageDebuff';
import { AddStatusEffect } from '../../../Actions/AddStatusEffect';
import { TakeAim } from '../../../StatusEffects/TakeAim';
import { MeleeDamage } from '../../../StatusEffects/MeleeDamage';
import { MoveTargetingCursor } from '../../../Actions/MoveTargetingCursor';
import { MoveTowards } from '../../../Actions/MoveTowards';
import { Gnasher } from '../../../Items/Weapons/Gnasher';
import { GoToPreviousKeymap } from '../../../Actions/GoToPreviousKeymap';


export default function (engine) {
  // define keymap
  const keymap = (engine, actor) => {
    return {
      Escape: () => new Say({
        label: 'Stay',
        message: 'standing still...',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      }),
      'w,ArrowUp': () => {
        const direction = Constant.DIRECTIONS.N;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        });
      },
      's,ArrowDown': () => {
        const direction = Constant.DIRECTIONS.S;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        });
      },
      'a,ArrowLeft': () => {
        const direction = Constant.DIRECTIONS.W;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        });
      },
      'd,ArrowRight': () => {
        const direction = Constant.DIRECTIONS.E;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        });
      },
      p: () => new Say({
        label: 'Stay',
        message: 'standing still...',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      }),
      l: () => new PrepareLooking({
        label: 'Look',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [],
      }),
      f: () => new PrepareRangedAttack({
        label: 'Fire Weapon',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [],
      }),
      r: () => new Reload({
        label: 'Reload',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      }),
      i: () => new OpenInventory({
        label: 'Inventory',
        game: engine.game,
        actor,
      }),
      o: () => new OpenDropInventory({
        label: 'Drop Items',
        game: engine.game,
        actor,
      }),
      // o: () => new OpenEquipment({
      //   label: 'Equipment',
      //   game: engine.game,
      //   actor,
      // }),
      u: () => new OpenUpgrades({
        label: 'Upgrade',
        game: engine.game,
        actor,
      }),
      g: () => new PickupAllItems({
        label: 'Pickup',
        game: engine.game,
        actor,
      }),
      t: () => new PrepareDirectionalThrow({
        label: 'Grenade',
        projectileType: 'Grenade',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      c: () => new PrepareCallReinforcements({
          label: 'Call Reinforcments',
          game: engine.game,
          actor,
          passThroughEnergyCost: Constant.ENERGY_THRESHOLD * 3,
          passThroughRequiredResources: [
            new UpgradeResource({ getResourceCost: () => 1 }),
          ],
        }),
      b: () => new OpenAvailableStatusEffects({
          label: 'Buff/Debuff',
          game: engine.game,
          actor,
        }),
      h: () => new AddSandSkinStatusEffect({
        label: 'Sand Skin',
        game: engine.game,
        actor,
      }),
      x: () => new AddStatusEffect({
        label: 'Rev Lancer Chainsaw',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        effect: new MeleeDamage({
          buffValue: 12,
          game: engine.game,
          actor,
          lifespan: Constant.ENERGY_THRESHOLD * 3,
          stepInterval: Constant.ENERGY_THRESHOLD,
        }),
        particleTemplate: {
          renderer: {
            color: '#424242',
            background: '#e6e6e6',
            character: ''
          },
        },
      }),
      v: () => new AddStatusEffect({
        label: 'Take Aim',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD * 2,
        effect: new TakeAim({
          buffValue: 10,
          game: engine.game,
          actor,
        }),
      }),
      mouseOver: (mousePosition) => {
        return new MoveTargetingCursor({
          hidden: true,
          actor: actor,
          game: engine.game,
          targetPos: mousePosition,
        })
      },
      mouseLeftButton: (mousePosition) => {
        return new MoveTowards({
          hidden: true,
          actor,
          game: engine.game,
          targetPos: mousePosition,
        })
      },
      mouseRightButton: (mousePosition) => {
        return new GoToPreviousKeymap({
          hidden: true,
          actor,
          game: engine.game,
        })
      },
    };
  }

  // instantiate class
  const primary = Snub(engine);
  const durability = 5;
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: {
      sprite: '',
      character: 'G',
      color: COLORS.base3,
      background: COLORS.cog2,
    },
    lightPassable: true,
    name: 'The Commander',
    speed: Constant.ENERGY_THRESHOLD * 3,
    durability,
    baseRangedAccuracy: 0,
    baseRangedDamage: 0,
    attackDamage: 0,
    upgrade_points: 10,
    upgrade_tree: [
      Upgrade({
        cost: 1,
        name: 'Gain Melee Debuff Action',
        removeOnActivate: true,
        activate: (actor) => actor.addAvailableStatusEffect(MeleeDamageDebuff),
      }),
      Upgrade({
        cost: 1,
        name: '+1 Effect Range',
        canUpgrade: (actor) => actor.getStatusEffectRange() < actor.statusEffectRangeMax,
        activate: (actor) => (actor.increaseStatusEffectRange(1)),
      }),
      Upgrade({
        cost: 1,
        name: '+1 Reinforcements',
        activate: (actor) => (actor['reinforcementCount'] += 1),
      }),
      Upgrade({
        cost: 3,
        name: 'Full Health',
        canUpgrade: (actor) => actor.durability < actor.durabilityMax,
        activate: (actor) => (actor.increaseDurability(actor.durabilityMax - actor.durability)),
      }),
    ],
    availableStatusEffects: [SandSkin],
    equipment: Constant.EQUIPMENT_LAYOUTS.gear(),
    game: engine.game,
    presentingUI: true,
    faction: 'COG',
    enemyFactions: ['LOCUST'],
    initializeKeymap: keymap,
  })

  actor['reinforcementCount'] = 1

  // add default items to container
  const ammo = Array(10).fill('').map(() => Ammo(engine));
  const grenades = Array(2).fill('').map(() => Grenade(engine, 6));
  const secondary = Boltok(engine);
  const lancer = Lancer(engine);
  const gnasher = Gnasher(engine);
  actor.container = [
    new ContainerSlot({
      itemType: gnasher.name,
      items: [gnasher],
    }),
    new ContainerSlot({
      itemType: lancer.name,
      items: [lancer],
    }),
    new ContainerSlot({
      itemType: secondary.name,
      items: [secondary],
    }),
    new ContainerSlot({
      itemType: ammo[0].name,
      items: ammo,
    }),
    new ContainerSlot({
      itemType: grenades[0].name,
      items: grenades,
    }),
  ]

  actor.equip(primary.equipmentType, primary);

  return actor;
}