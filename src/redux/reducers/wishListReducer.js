import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';

const initialState = {
    products: [],
    wishLoader: false,
    wishListLoader : false,
    wishListMessage : '',
    wishResult : '',
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_WISHLIST_ITEM:
            return updateObject(state, action.payload)

        case actionType.ADD_PRODUCT_IN_WISHLIST:
            return updateObject(state, action.payload)

        case actionType.REMOVE_PRODUCT_FROM_WISHLIST:
            return updateObject(state, action.payload)
        
        case actionType.WISH_LIST_LOADER:
            return updateObject(state, action.payload)

        case actionType.PRODUCT_WISH_DETAIL:
            return updateObject(state, action.payload)

        default:
            return state;
    }

}

export default reducer