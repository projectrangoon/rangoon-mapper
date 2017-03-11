import types from '../../constants/ActionTypes';

const conditionalAdd = (existing, newGuy) => {
  const i = existing.indexOf(newGuy);
  if (i === -1) {
    return [...existing, newGuy];
  }
  return [...existing.slice(0, i), ...existing.slice(i + 1) ];
};

const initialState = {
  selectedBusServices: [],
};

const busServicesSidebar = (state = initialState, action) => {
  switch(action.type) {
    case types.TOGGLE_BUS_SERVICE_SUCCESS: {
      const newBusService = parseInt(action.payload.busServiceNo, 10);
      return {
        ...state,
        selectedBusServices: conditionalAdd(state.selectedBusServices, newBusService),
      };
    }

    default: {
      return state;
    }
  }
};


export default busServicesSidebar;
