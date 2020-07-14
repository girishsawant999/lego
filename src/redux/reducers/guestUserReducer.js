import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';

const initialState = {
    temp_quote_id: null,
    new_quote_id: null,
    startGuestCheckout: false,
    timestamp: null,
}



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.GUEST_USER_CART_ID:
            return updateObject(state, action.payload)
            
        case actionType.GUEST_ADD_TO_CART:
            return updateObject(state, action.payload)

        case actionType.START_GUEST_CHECKOUT:
            return updateObject(state, action.payload)

        case actionType.UPDATE_GUEST_USER_NEW_QUOTE_ID:
            return updateObject(state, initialState)

        case actionType.UPDATE_GUEST_USER_NEW_QUOTE_ID_PAYFORT:
            return updateObject(state, action.payload)

        default:
            return state;
    }

}

export default reducer