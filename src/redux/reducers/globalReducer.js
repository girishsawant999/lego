import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';
import cookie from 'react-cookies';
const initialState = {
	// currentStore: cookie.load('storeid') ? cookie.load('storeid'): 2,
	currentStore: 1,
	loading: false,
	language: "ar", // cookie.load("language") ? cookie.load("language") : "en",
	country:"KSA", // cookie.load("country") ? cookie.load("country") : "KSA",
	region: "ar", //cookie.load("store_locale") ? cookie.load("store_locale") : "en",
	store_locale:"ar", // cookie.load("store_locale") ? cookie.load("store_locale") : "en",
    home_page_data: {},
    home_page_two_data: {},
    quick_logos_icon_data: {},
    trendin_now_data: {},
    featured_set_data: {},
    spotlightbannerdata: {},
    recommendedproductdata: {},
    home_page_two_a_data: {},
    discover_more: {},
    languageDetails: {},
    staticPageLoader: false,
    homeLoader: false,
    home2ALoader: false,
    home2Loader: false,
    currentTime: '',
    recommendedCategories : [],
    storeInfo: {
    },
    landingPageData: '',
    storeList : []

}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.STORE_REGION:
            return updateObject(state, action.payload)
        case actionType.GET_STORE_ID:
            return updateObject(state, action.payload)
        case actionType.STORE_LOCALE:
            return updateObject(state, action.payload)
        case actionType.GET_DISCOVER_CMS:
            return updateObject(state, action.payload)
        case actionType.CHANGE_STORE:
            return updateObject(state, action.payload)
        case actionType.GET_HOME_PAGE_DATA:
            return updateObject(state, action.payload)
        case actionType.GET_RECOMENDED_DATA:
            return updateObject(state, action.payload)
        case actionType.LOADING_SPINNER:
            return updateObject(state, action.payload)
        case actionType.GET_STORE_LIST:
            return updateObject(state, action.payload)
        case actionType.GET_TIME_STAMP:
            return updateObject(state,action.payload)
        default:
            return state;
    }
}
export default reducer
