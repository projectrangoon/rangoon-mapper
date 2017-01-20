import types from '../constants/ActionTypes';

export default const loadAllBusServices = (busServices) =>
  {
    type: types.LOAD_ALL_BUS_SERVICES,
    busServices
  }
