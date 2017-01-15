import types  from '../constants/ActionTypes';

export const loadAllBusServices = (bus_services) => {
  return {
    type: types.LOAD_ALL_BUS_SERVICES,
    bus_services
  }
}