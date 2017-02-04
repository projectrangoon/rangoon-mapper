import types from '../constants/ActionTypes';

const loadAllBusStops = busStops => ({
  type: types.LOAD_ALL_BUS_STOPS,
  busStops,
});

export default loadAllBusStops;
