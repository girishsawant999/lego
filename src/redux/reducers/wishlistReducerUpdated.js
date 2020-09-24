import * as actionType from "../actionTypes"
import { updateObject } from "../utilityReducers"

const initialState = {
	wishlistProducts: [],
	wishlistCount: 0,
	wishlistLoader: false,
	wishlistMessage: "",
	wishlistItemAdded: false,
	wishlistItemRemoved: false,
	wishlistLoadingProductId : null,
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionType.WISHLIST_UPDATED:
			return updateObject(state, action.payload)
		default:
			return state
	}
}

export default reducer
