import * as actionType from "../actionTypes"
import { updateObject } from "../utilityReducers"

const initialState = {
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionType.NOTIFY_ME:
			return updateObject(state, action.payload)

		default:
			return state
	}
}
export default reducer
