import * as actionType from "../actionTypes"
import { updateObject } from "../utilityReducers"

const initialState = {
	customer_details: {},
	isUserLoggedIn: false,
	loginMessage: null,
	loginErrorMessage: null,
	errorMessage: null,
	loading: false,
	store_id: null,
	registerUserDetails: {},
	registerLoader: false,
	forgotPasswordDetails: {},
	changePasswordDetails: {},
	resetPasswordDetails: {},
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionType.LOGIN:
			return updateObject(state, action.payload)

		case actionType.REGISTER:
			return updateObject(state, action.payload)

		case actionType.FORGOT_PASSWORD:
			return updateObject(state, action.payload)

		case actionType.RESET_PASS:
			return updateObject(state, action.payload)

		// case actionType.CLEAR_REGISTRATION_ERROR:
		//     return updateObject(state, action.payload)

		// case actionType.CHANGE_PASSWORD:
		//     return updateObject(state, action.payload)

		// case actionType.CLEAR_CHANGE_PASS:
		//     return updateObject(state, action.payload)

		case actionType.UPDATE_NEW_QUOTE_ID:
		    return updateObject(state, action.payload)

		default:
			return state
	}
}
export default reducer
