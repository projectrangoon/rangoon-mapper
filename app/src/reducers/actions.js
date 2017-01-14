const initialState = {
  type: null
}

const actions = (state = initialState, action) => {
  if (action.type) {
    return {
      type: action.type
    }
  }

  return state
}

export default actions
