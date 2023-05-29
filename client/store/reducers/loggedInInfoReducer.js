const loggedInInfoReducer = {
  setInitialLoggedInInfo(state, action) {
    state.id = action.payload.id;
    state.role = action.payload.role;
    state.isSignedIn = true;
  },
  removeLoggedInInfo(state, action) {
    state.id = null;
    state.role = null;
    state.isSignedIn = false;
  },
};

export default loggedInInfoReducer;
