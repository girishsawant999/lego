import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';

const initialState = {
    addressBook: [],
    countryList: [],
    addressResp: {},
    isAddBookRec: false,
    isContryRec: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_COUNTRIES:
            return updateObject(state, action.payload)

        default:
            return state;
    }

}

export default reducer