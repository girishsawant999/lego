import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';

const initialState = {
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_SHIPPING_DETAILS:
      return updateObject(state, action.payload);
    
    case actionType.SET_BILLING_DETAILS:
      return updateObject(state, action.payload);

    default:
      return state;
  }
};
export default reducer;