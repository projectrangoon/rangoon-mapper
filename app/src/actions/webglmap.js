import { push } from 'react-router-redux';
import { createActions } from '../utils';
import types from '../constants/ActionTypes';

const selectBusServiceActions = createActions([
  types.SELECT_BUS_SERVICE_REQUEST,
  types.SELECT_BUS_SERVICE_SUCCESS,
  types.SELECT_BUS_SERVICE_FAIL,
]);


export const selectBusService = (e, busService, busServiceNo) =>
  (dispatch, getState) => {

    dispatch(selectBusServiceActions.request({ busService, busServiceNo }));

    const { webglmap } = getState();

    if (busService && busServiceNo) {
      dispatch(selectBusServiceActions.success({ webglmap, busService, busServiceNo }));
      dispatch(push(`/bus/${busServiceNo}`));
    } else {
      dispatch(selectBusServiceActions.fail({ webglmap, busService, busServiceNo }));
    }
  }
