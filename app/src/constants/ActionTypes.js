import { createConstants } from '../utils'

export default createConstants(
  // General
  'REQUEST_FAIL',
  'MODAL_SHOW',
  'MODAL_HIDE',

  // Map
  'PLACES_CHANGED',
  'UPDATE_MAP_CENTER',
  'DRAW_ROUTE',
  'CALCULATE_ROUTE',
  'AJACENCY_LIST_LOADED',

  'LOAD_ALL_BUS_STOPS',
  'SELECT_START_STOP',
  'SELECT_END_STOP',

  'LOAD_ALL_BUS_SERVICES',

)