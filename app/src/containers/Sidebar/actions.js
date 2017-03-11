import { push } from 'react-router-redux';

import { createActions } from '../../utils';
import types from '../../constants/ActionTypes';
import { calculateRoute, clearPolylines } from '../Map/actions';


const selectStartStopActions = createActions([
  types.SELECT_START_STOP_REQUEST,
  types.SELECT_START_STOP_SUCCESS,
  types.SELECT_START_STOP_FAIL,
]);

const selectEndStopActions = createActions([
  types.SELECT_END_STOP_REQUEST,
  types.SELECT_END_STOP_SUCCESS,
  types.SELECT_END_STOP_FAIL,
]);

export const selectStartStop = startStop =>
  (dispatch, getState) => {
    const { map } = getState();
    const { endStop, google } = map;
    if (!startStop) {
      dispatch(clearPolylines());
    }
    if (google && startStop && endStop) {
      dispatch(selectStartStopActions.success({ startStop,
        routePath: null,
        calculatingRoute: true,
      }));
      dispatch(push(`/directions/${startStop.bus_stop_id}/${endStop.bus_stop_id}`));
      setTimeout(() => { dispatch(calculateRoute(startStop, endStop)); }, 100);
    } else {
      dispatch(selectStartStopActions.success({ startStop,
        routePath: null,
        calculatingRoute: false,
      }));
    }
  };

export const selectEndStop = endStop =>
  (dispatch, getState) => {
    const { map } = getState();
    const { startStop, google } = map;
    if (!endStop) {
      dispatch(clearPolylines());
    }
    if (google && startStop && endStop) {
      dispatch(selectEndStopActions.success({ endStop,
        routePath: null,
        calculatingRoute: true,
      }));
      dispatch(push(`/directions/${startStop.bus_stop_id}/${endStop.bus_stop_id}`));
      setTimeout(() => { dispatch(calculateRoute(startStop, endStop)); }, 100);
    } else {
      dispatch(selectEndStopActions.success({ endStop,
        routePath: null,
        calculatingRoute: false,
      }));
    }
  };
