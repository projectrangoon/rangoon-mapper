import types  from '../constants/ActionTypes';

export const handlePlacesChanged = (places) => {
  return {
    type: types.PLACES_CHANGED,
    places
  }
}

export const updateMapCenter = (center) => {
  return {
    type: types.UPDATE_MAP_CENTER,
    center
  }
}

export const calculateRoute = (start_stop, end_stop) => {
  console.log(start_stop, end_stop);
  return {
    type: types.CALCULATE_ROUTE,
    start_stop,
    end_stop
  }
}