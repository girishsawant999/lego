import * as actionType from "../actionTypes"
import { API } from "../../api/api"

export const loadingSpinner = (payload) => {
	return {
		type: actionType.LOADING_SPINNER,
		payload: payload,
	}
}

export const storeRegion = (payload) => {
	return (dispatch) => {
		const data = { payload }
	}
}

export const storeLocale = (payload) => {
	return (dispatch) => {
		const data = { payload }
	}
}

export const changeStore = (payload) => {
	return (dispatch) => {
		const data = { payload }
	}
}

export const getStoreIds = (payload = {}) => {
	// return (dispatch) => {
	//     const data = {
	//        ...payload,
	//     }

	//     let cb = {
	//         success: (res) => {
	//             if(res.status === true && res.code === 200){
	//                 dispatch(callActionGetStoreIds({allStores : res.data}))

	//             }else{

	//                 dispatch(callActionGetStoreIds({allStores : res.data}))
	//             }
	//         },
	//         error: (err) => {
	//             console.log(err);
	//         }
	//     }

	//     API.getStoreId(data, cb)

	// }
	return {
		type: actionType.GET_STORE_ID,
		payload: payload,
	}
}

export const setChangeStore = (payload = {}) => {
	var lang, cntry, str_lc, region

	switch (parseInt(payload.store_id)) {
		case 1:
			lang = "ar"
			cntry = "KSA"
			str_lc = "ar"
			region = "ar"
			break

		case 2:
			lang = "en"
			cntry = "KSA"
			str_lc = "en"
			region = "en"
			break

		// case 3:
		//     lang = 'ar';
		//     cntry = 'SA';
		//     str_lc = 'uae-ar';
		//     break;
		// case 4:
		//     lang = 'en';
		//     cntry = 'SA';
		//     str_lc = 'uae-en';
		//     break;
		// case 5:
		//     lang = 'ar';
		//     cntry = 'International';
		//     str_lc = 'ar';
		//     break;
		// case 6:
		//     lang = 'en';
		//     cntry = 'International';
		//     str_lc = 'en';
		//     break;
		default:
			lang = "en"
			cntry = "KSA"
			str_lc = "en"
			region = "en"
	}

	return (dispatch) => {
		let newStoreState = {
			currentStore: payload.store_id,
			language: lang,
			country: cntry,
			store_locale: str_lc,
			region: region,
		}
		// console.log('Before dispatch newStoreState', newStoreState);
		dispatch(callActionForChangeStore({ ...newStoreState }))
		// dispatch(callActionForChangeStore({ ...newState, globalStoreDetails: {globalStoreDetails} }))
	}
}

const callActionForChangeStore = (payload) => {
	return {
		type: actionType.CHANGE_STORE,
		payload: payload,
	}
}
const actionForGetHomePageData = (payload) => {
	return {
		type: actionType.GET_HOME_PAGE_DATA,
		payload: payload,
	}
}

export const getHomePageData = (payload = {}) => {
	return (dispatch) => {
		const data = {
			...payload,
		}
		dispatch(loadingSpinner({ homeLoader: true }))
		let callback = {
			success: (res) => {
				// localStorage.setItem('HomePageData', JSON.stringify(res));
				if (res.status === true && res.code === 200) {
					dispatch(actionForGetHomePageData({ home_page_data: res }))
				} else {
				}
				dispatch(loadingSpinner({ homeLoader: false }))
			},
			error: (err) => {
				dispatch(loadingSpinner({ homeLoader: false }))
			},
		}
		API.getHomePageData(data, callback)
	}
}

const actionGetRecommendedData = (payload) => {
	return {
		type: actionType.GET_RECOMENDED_DATA,
		payload: payload,
	}
}
export const getRecommendedData = (payload = {}) => {
	return (dispatch) => {
		const data = {
			...payload,
		}
		dispatch(loadingSpinner({ recommendedDataLoader: true }))
		let callback = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					dispatch(actionGetRecommendedData({ recommended_data: res }))
				} else {
				}
				dispatch(loadingSpinner({ recommendedDataLoader: false }))
			},
			error: (err) => {
				dispatch(loadingSpinner({ recommendedDataLoader: false }))
			},
		}
		API.getRecommendedDataData(data, callback)
	}
}