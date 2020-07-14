import * as actionType from "../actionTypes"
import { updateObject } from "../utilityReducers"

const initialState = {}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionType.GET_ACCOUNT_PAGE_DATA:
			return updateObject(state, action.payload)
		case actionType.ADD_ADDRESS:
			return updateObject(state, action.payload)
		case actionType.DELETE_ADDRESS:
			return updateObject(state, action.payload)
		case actionType.CHANGE_PASSWORD:
			return updateObject(state, action.payload)
		case actionType.ADDRESS_BOOK:
			return updateObject(state, action.payload)

		default:
			return state
	}
}
export default reducer
