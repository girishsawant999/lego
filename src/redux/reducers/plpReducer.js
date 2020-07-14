import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';
const initialState = {
    PlpData: '',
    product: '',
    PlpLoader: false,
    PlpNextLoader: false,
    autoSerachsuggestionData : ''
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_PLP_DATA:
            return updateObject(state, action.payload)
        case actionType.GET_PLP_LOADER:
            return updateObject(state, action.payload)
        case actionType.SEARCH_RESULT:
            return updateObject(state, action.payload)
        case actionType.GET_SUGGESTION_API:
            return updateObject(state, action.payload)
        default:
            return state;
    }
}
export default reducer
