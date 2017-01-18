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
  const route_markers = [];
  route_markers.push({ lat: parseFloat(start_stop.lat), lng: parseFloat(start_stop.lng) })
  route_markers.push({ lat: parseFloat(end_stop.lat), lng: parseFloat(end_stop.lng) })
  return {
    type: types.CALCULATE_ROUTE,
    route_markers
  }
}