import R from 'ramda'
import createGrid from './create-grid'

import {
  cellWidth
, cellHeight
, worldWidth
, worldHeight
, cols
, rows
} from './config'

import {
  UPDATE_WORLD
, DESTROY_ENEMY
} from './actions'

const grid = createGrid(rows - 5, cols - 2)

const defaultState = grid.cells.map(i => {
  let coords = grid.getCoords(i)
  return {
    key: `enemy-${ i }`
  , type: coords.y % 3
  , left: coords.x * cellWidth + cellWidth
  , top: coords.y * cellHeight + cellHeight
  , flip: false
  , elapsedTime: 0
  , index: i
  , beatPeriod: 500
  , fastestBeat: 50
  , beatFasterBy: 0 // this really should depend on how many enemies are still alive
  , width: cellWidth
  , height: cellHeight
  }
})

const update = (state, action) => {
  let beat = state.elapsedTime >= state.beatPeriod
    , beatFaster = state.beatPeriod > state.fastestBeat
    , e = {
        elapsedTime: beat ? 0 : state.elapsedTime + action.elapsedTime
      , flip: beat ? !state.flip : state.flip
      , beatPeriod: beatFaster ? state.beatPeriod - state.beatFasterBy : state.beatPeriod
      }
  return  Object.assign({}, state, e)
}

export const enemies = (state = defaultState, action) => {
  switch (action.type) {
    case DESTROY_ENEMY:
      return R.reject((e => e.key == action.enemy.key), state)
     case UPDATE_WORLD:
      return state.map(e => update(e, action))
    default:
      return state
  }
}

const addExplosion = (state, action) => {
  let {top, left} = action.enemy
    , key = `exposion-${Date.now()}`

  return {top, left, key}
}

export const enemyExplosions = (state = [], action) => {
  switch (action.type) {
    case DESTROY_ENEMY:
      return state.concat(addExplosion(state, action))
    default:
      return state
  }
}
