import types from '../constants/ActionTypes';

const initialState = {
  center: [ 96.1587996, 16.7849606 ],
  zoom: [13.86],
  bearing: 1,
  minZoom: 5,
};

const webglmap = (state = initialState, action) => {
  switch (action.type) {
    case types.SELECT_BUS_SERVICE_SUCCESS: {
      const { busService, busServiceNo } = action.payload;
      return {
        ...state,
        busService,
        busServiceNo,
      };
    }
    default: {
      return state;
    }
  }
};

export default webglmap;
