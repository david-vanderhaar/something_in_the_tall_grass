// import deps
import * as Constant from '../../../constants';
import * as Helper from '../../../../helper';
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
import { Grenade } from '../../../Items/Weapons/Grenade';
import { Ammo } from '../../../Items/Pickups/Ammo';
import {COLORS} from '../../Jacinto/theme';
import * as TALL_GRASS_CONSTANT from '../../TallGrass/theme';
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
import { GoToPreviousKeymap } from '../../../Actions/GoToPreviousKeymap';
import { Lantern } from '../../../Items/Environment/Lantern';
import { Revolver } from '../Items/Weapons/Revolver';
import { Battery } from '../Items/Pickups/Battery';
import { LayGrass } from '../StatusEffects/LayGrass';
import { GlowStick } from '../Items/Pickups/GlowSticks';


export default function (engine) {

  // define keymap
  const keymap = (engine, actor) => {

    function stepOnGrass () {
      const entities = Helper.getEntitiesByPositionByAttr({
        game: engine.game,
        position: actor.getPosition(),
        attr: 'name',
        value: 'tall grass', 
      })
      
      
      entities.forEach((entity) => {
        const effect = new LayGrass({
          game: engine.game,
          actor: entity,
          lifespan: Constant.ENERGY_THRESHOLD * 3,
          stepInterval: Constant.ENERGY_THRESHOLD
        })
        engine.addStatusEffect(effect);
      })
    }

    return {
      Escape: () => new Say({
        label: 'Stay',
        message: 'standing still...',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      }),
      e: () => new Say({
        label: 'Hand Crank',
        message: 'you use the hande crank. the light burns brighter.',
        game: engine.game,
        actor,
        energyCost: actor.speed,
        onSuccess: () => {
          lantern.incrementLightRange()
        },
      }),
      // q: () => new Say({
      //   label: 'Dim',
      //   message: 'you crank the knob left. the light dims.',
      //   game: engine.game,
      //   actor,
      //   energyCost: Constant.ENERGY_THRESHOLD,
      //   onSuccess: () => {
      //     lantern.lightRange -= 1
      //   },
      // }),
      'w,ArrowUp': () => {
        const direction = Constant.DIRECTIONS.N;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          onSuccess: stepOnGrass
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
          energyCost: Constant.ENERGY_THRESHOLD,
          onSuccess: stepOnGrass
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
          energyCost: Constant.ENERGY_THRESHOLD,
          onSuccess: stepOnGrass
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
          energyCost: Constant.ENERGY_THRESHOLD,
          onSuccess: stepOnGrass
        });
      },
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
      p: () => new OpenEquipment({
        label: 'Equipment',
        game: engine.game,
        actor,
      }),
      g: () => new PickupAllItems({
        label: 'Pickup',
        game: engine.game,
        actor,
      }),
      t: () => new PrepareDirectionalThrow({ // add glow stick throwable?
        label: 'Grenade',
        projectileType: 'Grenade',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      v: () => new AddStatusEffect({
        label: 'Steady The Nerves',
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
  const durability = 5;
  let actor = new Player({
    // pos: { x: 23, y: 7 },
    renderer: {
      sprite: '',
      character: '@',
      color: TALL_GRASS_CONSTANT.COLORS.white,
      background: TALL_GRASS_CONSTANT.COLORS.brown_sugar,
    },
    lightPassable: true,
    name: 'field agent',
    baseDescription: 'you, a C.C.C member stationed in the Layoria region.',
    speed: Constant.ENERGY_THRESHOLD * 5,
    durability,
    baseRangedAccuracy: 0,
    baseRangedDamage: 0,
    attackDamage: 1,
    equipment: Constant.EQUIPMENT_LAYOUTS.human(),
    game: engine.game,
    presentingUI: true,
    faction: 'PEOPLE',
    enemyFactions: ['MONSTER'],
    initializeKeymap: keymap,
  })

  // add default items to container
  const primary = Revolver(engine, actor.getPosition());
  const lantern = Lantern({engine, lightRange: 6})
  // lantern.setPosition(actor.getPosition())
  const ammo = Array(2).fill('').map(() => Ammo(engine));
  const grenades = Array(2).fill('').map(() => Grenade(engine, 6));
  const glowSticks = Array(2).fill('').map(() => GlowStick(engine, actor.getPosition()))
  const batteries = Array(2).fill('').map(() => Battery());
  actor.container = [
    new ContainerSlot({
      itemType: ammo[0].name,
      items: ammo,
    }),
    new ContainerSlot({
      itemType: grenades[0].name,
      items: grenades,
    }),
    new ContainerSlot({
      itemType: batteries[0].name,
      items: batteries,
    }),
    new ContainerSlot({
      itemType: glowSticks[0].name,
      items: glowSticks,
    }),
  ]

  actor.equip(primary.equipmentType, primary);
  actor.equip(lantern.equipmentType, lantern);

  return actor;
}