import types from '../constants/ActionTypes';

const loadAllBusServices = busServices => ({
  type: types.LOAD_ALL_BUS_SERVICES,
  busServices,
});

export default loadAllBusServices;
