import types from '../constants/ActionTypes';

const initialState = {
  latitude: 16.7943528,
  longitude: 96.1518985,
  zoom: 15,
  bearing: 0,
  pitch: 45,
};

const webglmap = (state = initialState, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default webglmap;
