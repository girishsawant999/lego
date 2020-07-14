import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';
const initialState = {
    loading: false,
    contactUsDetails: {},
    contactLoader : false
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.CONTACT_US:
            return updateObject(state, action.payload)
        default:
            return state;
    }
}
export default reducer
