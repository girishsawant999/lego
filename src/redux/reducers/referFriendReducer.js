import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';
const initialState = {
    loading: false,
    referfriend: {},
    referfriendLoader : false
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.REFERAL_DETAIL:
            return updateObject(state, action.payload)
            
        default:
            return state;
    }
}
export default reducer
