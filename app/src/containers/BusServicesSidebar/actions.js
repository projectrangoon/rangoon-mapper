import { push } from 'react-router-redux';

import { createActions } from '../../utils';
import types from '../../constants/ActionTypes';

const selectBusServiceActions = createActions([
  types.SELECT_BUS_SERVICE_REQUEST,
  types.SELECT_BUS_SERVICE_SUCCESS,
  types.SELECT_BUS_SERVICE_FAIL,
]);

const toggleBusServiceActions = createActions([
  types.TOGGLE_BUS_SERVICE_REQUEST,
  types.TOGGLE_BUS_SERVICE_SUCCESS,
  types.TOGGLE_BUS_SERVICE_FAIL,
]);


export const selectBusService = (busServiceNo) =>
  (dispatch, getState) => {

    dispatch(selectBusServiceActions.request({ busServiceNo }));

    const { webglmap } = getState();

    if (busServiceNo) {
      dispatch(selectBusServiceActions.success({ webglmap, busServiceNo }));
      dispatch(push(`/bus/${busServiceNo}`));
    } else {
      dispatch(selectBusServiceActions.fail({ webglmap, busServiceNo }));
    }
  }

export const toggleBusService = (busServiceNo) =>
  (dispatch, getState) => {
    dispatch(toggleBusServiceActions.request({ busServiceNo }));

    if(busServiceNo) {
      dispatch(toggleBusServiceActions.success({ busServiceNo }));
    } else {
      dispatch(toggleBusServiceActions.fail({ busServiceNo }));
    }
  }
