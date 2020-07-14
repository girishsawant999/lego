import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';
const initialState = {
    logoSlider : '',
    menus: []
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_MENU_DATA:
            return updateObject(state, action.payload)
        default:
            return state;
    }
}
export default reducer
