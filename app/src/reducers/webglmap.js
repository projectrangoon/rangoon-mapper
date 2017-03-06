const initialState = {
  center: [ 96.1587996, 16.7849606 ],
  zoom: [13.86],
  bearing: 1,
  pitch: 30,
  minZoom: 5,
};

const webglmap = (state = initialState, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default webglmap;
