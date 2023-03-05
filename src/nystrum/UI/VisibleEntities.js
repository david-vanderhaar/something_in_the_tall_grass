import React from "react"

export const VisibleEntities = ({game}) => {
  return (
    <div className="UI" style={{marginBottom: 20}}>
      {
        game.entityLog.getAllUniqueEntities().map(
          (entity, index) => <VisibleEntityCard key={index} entity={entity} />
        )
      }
    </div>
  )
}

const VisibleEntityCard = ({entity}) => {
  return (
    <div>
      <EntityIcon renderer={entity.renderer} />
      <EntityName entity={entity} />
    </div>
  )
}

export const LookedAtEntites = ({game}) => {
  const lookedAt = game.entityLog.getLookedAt()
  if (lookedAt.length <= 0) return null

  return (
    <div style={{top: 0, position: 'absolute', textAlign: 'left', zIndex: 1, maxWidth: '60%'}}>
      {lookedAt.map((entity, index) => (
        <div key={index} style={{marginBottom: 10}}>
          <EntityIcon renderer={entity.renderer} />
          <EntityName entity={entity} />
          <div style={{marginLeft: 20}}>
            <EntityDescription entity={entity} />
            <StatusEffects actor={entity} />
          </div>
        </div>
      ))}
    </div>
  )
}

const EntityIcon = ({renderer}) => {
  return (
    <span style={{
      color: renderer.color,
      backgroundColor: renderer.background,
      borderRadius: 2,
      padding: 2,
      marginRight: 5,
    }}>
      {renderer.sprite || renderer.character}
    </span>
  )
}

const EntityName = ({entity}) => (<span style={{color: entity.renderer.color}}>{entity.name}</span>)
const EntityDescription = ({entity}) => (<div>{entity.getFullDescription()}</div>)

function StatusEffect ({effect}) {
  return (
    <div>
      <EntityIcon renderer={effect.renderer} />
      <span>
        {effect.name}
      </span>
      <div style={{marginLeft: 20}}>
        {effect.description}
        asdasddg sfasfg asdfasdf asfasgrrg
      </div>
    </div>
  )
}

function StatusEffects ({actor}) {
  return (
    <div className="StatusEffects">
      {
        actor.game.engine.getStatusEffectsByActorId(actor.id).map((effect, i) => {
          return (<StatusEffect key={i} effect={effect} />)
        })
      }
    </div>
  )
}
