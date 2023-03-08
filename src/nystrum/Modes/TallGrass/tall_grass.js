import * as ROT from 'rot-js';
import { Mode } from '../default';
import * as CONSTANT from '../../constants';
import * as TALL_GRASS_CONSTANT from '../TallGrass/theme'
import * as JACINTO_CONSTANT from '../Jacinto/theme'
import * as MonsterActors from '../TallGrass/Actors/Monsters';
import * as Helper from '../../../helper'
import * as MapHelper from '../../Maps/helper';
import * as CoverGenerator from '../../Maps/coverGenerator';
import * as BuildingGenerator from '../../Maps/generator';
import { EmergenceHole, RenderedWithPickUpEffects, Wall } from '../../Entities';
import { Ammo } from '../../Items/Pickups/Ammo';
import { Gnasher } from '../../Items/Weapons/Gnasher';
import { Beacon, Lantern } from '../../Items/Environment/Lantern';

export class SomethingInTheTallGrass extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.game.tileKey = {
      ...CONSTANT.TILE_KEY,
      ...JACINTO_CONSTANT.TILE_KEY,
      ...TALL_GRASS_CONSTANT.TILE_KEY,
    }

    this.data = {level: 0};

    // this.game.fovActive = true
  }

  initialize() {
    super.initialize();
    this.game.createEmptyLevel();
    this.generateLevel()
    this.game.initializeMapTiles();

    this.placePlayerOnEmptyTile()
    this.placeGeneratorPiece(Helper.getRandomPos(this.game.map).coordinates)
    
    this.addLootCaches(2)
    this.addMonsters()
    this.addTallGrass()

  }

  update() {}

  addLootCaches(numberOfCaches) {
    Helper.range(numberOfCaches).forEach(() => {
      const cacheGenerator = Helper.getRandomInArray([
        // overgrown buildings
        this.addBuilding.bind(this),
        // beacons & boxes (broken tools and equipment)
        this.addBeacon.bind(this),
        // monster nests (eggs, webs, bones)
        this.addNest.bind(this),
      ])

      cacheGenerator()
    })

    this.addOvergrowth()
    this.addLoot()
  }

  addBuilding() {
    const keys = this.getEmptyGroundTileKeys()
    const randomKey = Helper.getRandomInArray(keys)
    const pos = Helper.stringToCoords(randomKey)
    const rooms = Helper.getRandomIntInclusive(1, 2)
    const roomSize = Helper.getRandomIntInclusive(2, 4)
    BuildingGenerator.generate(this.game.map, pos.x, pos.y, rooms, roomSize);
  }

  addBeacon() {
    const keys = this.getEmptyGrassTileKeys()
    const randomKey = Helper.getRandomInArray(keys)
    const origin = Helper.stringToCoords(randomKey)

    const positions = Helper.getPointsWithinRadius(origin, 4)
    positions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) tile.type = 'STEEL_FLOOR'
    })

    const lantern = Beacon({engine: this.game.engine, lightRange: 0})
    lantern.setPosition(origin)
    this.game.placeActorOnMap(lantern)
    // CoverGenerator.generateCoverBlock(origin, this.game)
  }

  addNest() {
    const keys = this.getEmptyTileKeys()
    const randomKey = Helper.getRandomInArray(keys)
    const origin = Helper.stringToCoords(randomKey)


    const positions = Helper.getPointsWithinRadius(origin, 2)
    positions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) tile.type = 'NEST'
    })

    const nest = new EmergenceHole({
      name: 'nest',
      pos: origin,
      game: this.game,
      passable: true,
      renderer: {
        character: '+',
        sprite: '',
        color: TALL_GRASS_CONSTANT.COLORS.flesh1,
        background: TALL_GRASS_CONSTANT.COLORS.black
      },
      timeToSpread: 5,
      spreadCount: 10,
      durability: 1,
      faction: 'MONSTER',
      enemyFactions: ['PEOPLE'],
      speed: CONSTANT.ENERGY_THRESHOLD,
      getSpawnedEntity: (spawnPosition) => MonsterActors.createRandomBasic(this, spawnPosition),
      onDestroy: () => {
        this.game.map[Helper.coordsToString(origin)].type = 'GROUND'
      },
    });

    if (this.game.placeActorOnMap(nest)) {
      this.game.engine.addActor(nest);
      this.game.draw();
    };
  }

  addOvergrowth() {
    const keys = this.getEmptyTileKeysByTags(['OVERGROWN'])
    const percentOvergrown = 0.3;
    const numberOfOvergrownTiles = Math.round(keys.length * percentOvergrown)
    const randomSelection = Helper.getNumberOfItemsInArray(numberOfOvergrownTiles, keys)
    randomSelection.forEach((key) => {
      this.placeTallGrass(Helper.stringToCoords(key))
    })
  }

  addLoot() {
    const keys = this.getEmptyTileKeysByTags(['LOOT'])
    const amountOfLoot = 2
    const randomSelection = Helper.getNumberOfItemsInArray(amountOfLoot, keys)
    randomSelection.forEach((key) => {
      this.placeLootItem(Helper.stringToCoords(key))
    })
  }

  placeLootItem(position) {
    const itemCreator = Helper.getRandomInArray([
      Ammo,
      Gnasher
    ])

    const item = itemCreator(this.game.engine)
    item.setPosition(position)

    this.game.placeActorOnMap(item)
  }

  addMonsters() {
    Helper.range(3).forEach((index) => 
      MonsterActors.addSpitter(
        this, 
        Helper.getRandomPos(this.game.map).coordinates
        )
      )
  }

  addTallGrass() {
    this.getEmptyGrassTileKeys()
      .forEach((key) => this.placeTallGrass(Helper.stringToCoords(key)))
  }

  generateLevel_v1() {
    const x = Math.floor(this.game.mapWidth / 2)
    MapHelper.addTileZone(
      this.game.tileKey,
      { x, y: 0 },
      this.game.mapHeight,
      10,
      'GROUND_ALT',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
  }

  generateLevel () {
    const digger = new ROT.Map.Cellular(this.game.mapWidth, this.game.mapHeight);
    digger.randomize(0.6) // the higher this percentage, the hight the difficulty due to more tall grass
    Helper.range(4).forEach(() => digger.create())
    let freeCells = [];
    let digCallback = function (x, y, value) {      
      let key = x + "," + y;
      let type = Helper.getRandomInArray(['GROUND', 'GROUND_ALT'])
      if (value) { 
        type = 'LAYED_GRASS';
      }
      MapHelper.addTileToMap({map: this.game.map, key, tileKey: this.game.tileKey, tileType: type})
      freeCells.push(key);
    }
    digger.create(digCallback.bind(this));
    digger.connect(digCallback.bind(this))
  }

  placeTallGrass(position) {
    const grass = new Wall({
      durability: 1,
      defense: 0,
      name: 'tall grass',
      passable: true,
      lightPassable: false,
      pos: position,
      renderer: {
        character: Helper.getRandomInArray(["'", '.', '"', ',']),
        sprite: '',
        background: TALL_GRASS_CONSTANT.COLORS.sunset,
        color: TALL_GRASS_CONSTANT.COLORS.sandy_brown,
      }
    })

    const tileType = Helper.getRandomInArray(['GROUND', 'GROUND_ALT'])
    this.game.map[Helper.coordsToString(position)].type = tileType
    this.game.placeActorOnMap(grass)
  }

  placeGeneratorPiece(position) {
    const item = new RenderedWithPickUpEffects({
      name: 'an important component',
      baseDescription: 'a component that powers up our base camp generator',
      pos: position,
      passable: true,
      renderer: {
        character: Helper.getRandomInArray(['a', 'b', 'c', 'd']),
        sprite: Helper.getRandomInArray(['', '', '', '',]),
        background: TALL_GRASS_CONSTANT.COLORS.violet,
        color: TALL_GRASS_CONSTANT.COLORS.white,
      },
      pickupEffects: [
        () => this.goToNextLevel()
      ]
    })

    this.game.placeActorOnMap(item)
  }

  placePlayerOnEmptyTile() {
    const player = this.game.getFirstPlayer()
    if (!player) return

    const randomPosition = Helper.getRandomInArray(this.getEmptyGroundTileKeys())
    player.setPosition(Helper.stringToCoords(randomPosition))
    this.game.placeActorOnMap(player)
  }

  getEmptyTileKeys (keys = Object.keys(this.game.map)) {
    return keys.filter((key) => !!!this.game.map[key].entities.length)
  }

  getEmptyTileKeysByTags (tags, keys = Object.keys(this.game.map)) {
    return this.getEmptyTileKeys(keys)
      .filter((key) => MapHelper.tileHasAnyTags({tile: this.game.map[key], tags}))
  }

  getEmptyGroundTileKeys (keys = Object.keys(this.game.map)) {
    return this.getEmptyTileKeys(keys)
      .filter((key) => this.game.map[key].type === 'GROUND' || this.game.map[key].type === 'GROUND_ALT')
  }

  getEmptyGrassTileKeys (keys = Object.keys(this.game.map)) {
    // return this.getEmptyTileKeys(keys).filter((key) => this.game.map[key].type === 'TALL_GRASS')
    return this.getEmptyTileKeys(keys).filter((key) => this.game.map[key].type === 'LAYED_GRASS')
  }

    
  //Extras
  setLevel (level) {
    this.data.level = level;
  }

  nextLevel () {
    this.setLevel(this.data.level + 1);
  }

  goToNextLevel() {
    this.destroyAllMonsters()
    this.nextLevel();
    this.initialize();
  }

  destroyAllMonsters() { this.enemies().forEach((enemy) => enemy.destroy()) }

  // reset () {
  //   this.setLevel(1);
  //   this.initialize();
  // }

  // setWaveData () {
  //   const level = this.data.level - 1
  //   const nextLevelData = _.get(this.dataByLevel, level, {});
  //   this.data = {...this.data, ...nextLevelData, hasPlayedEndSound: false}
  // }

  // levelComplete () {
  //   const playerOnExit = this.playerIsOnExit();
  //   const enemiesDefeated = this.enemiesDefeated();
  //   if (enemiesDefeated) {
  //     this.activateExitTiles();
  //     if (!this.data.hasPlayedEndSound) {
  //       JACINTO_SOUNDS.level_end.play()
  //       this.data.hasPlayedEndSound = true
  //     }
  //   }

  //   return playerOnExit && enemiesDefeated
  // }

  // enemiesDefeated () {
  //   return this.enemies().length <= 0
  // }

  enemies () {
    return this.game.engine.actors.filter((actor) => actor['faction'] === 'MONSTER')
  }

  // hasWon () {
  //   return this.data.level > this.dataByLevel.length;
  // }

  // hasLost () {
  //   let players = this.getPlayers()
  //   if (!players.length) return true;
  //   else if (players.length) {
  //     if (players[0].durability <= 0) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}