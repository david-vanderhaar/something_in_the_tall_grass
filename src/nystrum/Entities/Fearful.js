export const Fearful = superclass => class extends superclass {
  constructor({ fearPoints = 0, maxFearPoints = 3, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('FEARFUL');
    this.fearPoints = fearPoints;
    this.maxFearPoints = maxFearPoints;
  }

  setFear(points) {
    this.fearPoints = points
    // chance to add status effect here based on percentage of fear
  }

  setFearByLightStrength() {
    // arbitraryLightSourceDistanceSafety == 3
    // arbitraryLightRangeSafety == 3
    // entity gains fear once arbitraryLightSourceDistanceSafety < (lightSource.lightRange - distanceToLightSource)
    // so a player that is holding a lantern w/ lightRange == 2; gains a fear point
    //   3 > 2 - 0
    // so a player that is holding a lantern w/ lightRange == 3; does not gain a fear point
    //   3 > 3 - 0
    // so a player that is 2 tiles from a lantern w/ lightRange == 3; gains a fear point
    //   3 > 3 - 2
    // so a player that is 2 tiles from a lantern w/ lightRange == 4; gains a fear point
    //   3 > 4 - 2
    // so a player that is 2 tiles from a lantern w/ lightRange == 6; does not gain a fear point
    //   3 > 6 - 2
  }
};
