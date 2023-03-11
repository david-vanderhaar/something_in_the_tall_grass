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
import { Beacon, Lantern } from '../../Items/Environment/Lantern';
import { Battery } from './Items/Pickups/Battery';
import { JACINTO_SOUNDS } from '../Jacinto/sounds';
import { Revolver, Shotgun } from './Items/Weapons/Revolver';
import { Knife, Machete } from './Items/Weapons/Melee';
import { Brambles } from './Items/Environment/Brambles';
import { GlowStick } from './Items/Pickups/GlowSticks';

export class SomethingInTheTallGrass extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.game.tileKey = {
      ...CONSTANT.TILE_KEY,
      ...JACINTO_CONSTANT.TILE_KEY,
      ...TALL_GRASS_CONSTANT.TILE_KEY,
    }

    this.data = {
      level: 1,
      // finalLevel: 1,
      finalLevel: 10,
      finalLevelAmmo: 10,
      finalLevelBattery: 3,
      finalLevelMonsters: 1,
      finalLevelMonsterNests: 0,
      // finalLevelMonsterNests: 4,
      lootCachesPerLevel: 5,
      lootPerLevel: 4,
      lootList: [
        Ammo,
        Battery,
        Revolver,
        Shotgun,
        Knife,
        Machete,
        GlowStick,
      ],
      bramblePatchAmount: 5,
    };

    this.game.fovActive = true
  }

  initialize() {
    JACINTO_SOUNDS.ambient_howling.play()
    super.initialize();
    this.game.createEmptyLevel();
    this.generateLevel()
    this.game.initializeMapTiles();

    
    if (this.data.level < this.data.finalLevel) {
      this.placePlayerOnEmptyTile()
      this.addLootCaches(this.data.lootCachesPerLevel)
      this.addMonsters()
      this.placeGeneratorPiece(Helper.getRandomPos(this.game.map).coordinates)
    } else {
      const mapCenter = this.mapCenter()
      this.addBaseCamp(mapCenter)
      // place monsters
      this.addMonsters(this.data.finalLevelMonsters)
      // place monster nests 
      Helper.range(this.data.finalLevelMonsterNests).forEach(() => this.addNest())
      this.placePlayerAtPosition({x: mapCenter.x + 2, y: mapCenter.y})
    }

    this.addBrambles()
    this.addTallGrass()
    // const player = this.game.getFirstPlayer()
    // player.move(player.getPosition())
    // this.game.draw()
  }

  mapCenter() {
    return {x: Math.round(this.game.mapWidth / 2), y: Math.round(this.game.mapHeight / 2)}
  }

  update() {
    super.update();
    if (this.hasWon()) {
      this.game.toWin()
    }
  }

  addBaseCamp(origin) {
    const clearedPositions = Helper.getPointsWithinRadius(origin, 10)
    clearedPositions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) tile.type = Helper.getRandomInArray(['GROUND', 'GROUND_ALT'])
    })

    const beaconPositions = Helper.getPointsWithinRadius(origin, 6)
    beaconPositions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) tile.type = 'STEEL_FLOOR'
    })

    const lantern = Beacon({engine: this.game.engine, lightRange: 10})
    lantern.setPosition(origin)
    this.game.placeActorOnMap(lantern)

    const neigbors = Helper.getNeighboringPoints(origin, true)
    neigbors.forEach((point) => this.placeGeneratorPiece(point))

    // place ammo and batteries in building
    this.addLoot(this.data.finalLevelAmmo, Ammo)
    this.addLoot(this.data.finalLevelBattery, Battery)
  }

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
    this.addLoot(this.data.lootPerLevel)
  }

  addBuilding() {
    const keys = this.getEmptyGroundTileKeys()
    const randomKey = Helper.getRandomInArray(keys)
    const pos = Helper.stringToCoords(randomKey)
    const rooms = Helper.getRandomIntInclusive(1, 2)
    const roomSize = Helper.getRandomIntInclusive(2, 4)
    return BuildingGenerator.generate(this.game.map, pos.x, pos.y, rooms, roomSize);
  }

  addBeacon(origin = null) {
    if (origin === null) {
      const keys = this.getEmptyGrassTileKeys()
      const randomKey = Helper.getRandomInArray(keys)
      origin = Helper.stringToCoords(randomKey)
    }

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

  addBrambles() {
    const keys = this.getEmptyTileKeysByTags(['BRAMBLES'])
    const amount = this.data.bramblePatchAmount
    const randomSelection = Helper.getNumberOfItemsInArray(amount, keys)
    randomSelection.forEach((key) => {
      this.addBramblePatch(Helper.stringToCoords(key))
    })
  }

  addBramblePatch(origin) {
    const size = Helper.getRandomIntInclusive(2, 5)
    const clearedPositions = Helper.getPointsWithinRadius(origin, size)
    clearedPositions.forEach((position) => {
      const tile = MapHelper.getTileFromMap({map: this.game.map, position})
      if (tile) {
        if (MapHelper.tileHasTag({tile, tag: 'BRAMBLES'})) {
          this.placeBrambleBush(position)
        }
      }
    })
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

  addLoot(amountOfLoot = 1, itemCreator = null) {
    const keys = this.getEmptyTileKeysByTags(['LOOT'])
    const randomSelection = Helper.getNumberOfItemsInArray(amountOfLoot, keys)
    randomSelection.forEach((key) => {
      this.placeLootItem(Helper.stringToCoords(key), itemCreator)
    })
  }

  placeLootItem(position, itemCreator = null) {
    if (!itemCreator) {
      itemCreator = Helper.getRandomInArray(this.data.lootList)
    }

    const item = itemCreator(this.game.engine)
    item.setPosition(position)

    this.game.placeActorOnMap(item)
  }

  addMonsters(amount = 1) {
    Helper.range(amount).forEach((index) => 
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

  placeBrambleBush(position) {
    const bramble = Brambles(this.game.engine, position) 

    this.game.map[Helper.coordsToString(position)].type = 'BRAMBLE'
    this.game.placeActorOnMap(bramble)
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
      lightPassable: true,
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

  placePlayerAtPosition(position) {
    const player = this.game.getFirstPlayer()
    if (!player) return

    player.setPosition(position)
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
    if (this.data.level >= this.data.finalLevel) return

    this.destroyAllMonsters()
    this.nextLevel();
    this.initialize();
  }

  destroyAllMonsters() { this.enemies().forEach((enemy) => enemy.destroy()) }

  // reset () {
  //   this.destroyAllMonsters()
  //   this.setLevel(1);
  //   this.initialize();
  // }

  // setWaveData () {
  //   const level = this.data.level - 1
  //   const nextLevelData = _.get(this.dataByLevel, level, {});
  //   this.data = {...this.data, ...nextLevelData, hasPlayedEndSound: false}
  // }

  enemiesDefeated () {
    return this.enemies().length <= 0
  }

  enemies () {
    return this.game.engine.actors.filter((actor) => actor['faction'] === 'MONSTER')
  }

  hasWon () {
    return (this.data.level >= this.data.finalLevel && this.enemiesDefeated());
  }

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