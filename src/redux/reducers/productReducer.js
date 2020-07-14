import * as actionType from "../actionTypes";
import { updateObject } from "../utilityReducers";

const initialState = {
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.GET_PRODUCT_DETAILS:
      return updateObject(state, action.payload);
    case actionType.GET_REVIEW_LIST:
      return updateObject(state, action.payload);
    default:
      return state;
  }
};
export default reducer;
