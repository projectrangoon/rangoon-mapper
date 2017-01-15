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