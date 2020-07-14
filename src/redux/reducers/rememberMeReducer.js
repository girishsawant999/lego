import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';
const initialState = {
    
    rememberMeData: {},
   
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.REMEMBER_ME:
            return updateObject(state, action.payload)
        default:
            return state;
    }
}
export default reducer
