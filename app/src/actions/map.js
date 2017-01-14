import types  from '../constants/ActionTypes';

export const handlePlacesChanged = (places) => {
  return {
    type: types.PLACES_CHANGED,
    places
  }
}