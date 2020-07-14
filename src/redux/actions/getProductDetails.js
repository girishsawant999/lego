import * as actionType from "../actionTypes";
import { loadingSpinner } from "./globals";
import { API } from "../../api/api";

export const getProductDetails = (payload) => {
	return (dispatch) => {
		const data = {
			...payload,
		}

		dispatch(loadingSpinner({ loading: true }));
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					let newState = { ...res};
					let requestData = {
						productid: newState.product[0].id,
						storeid: data.store_id
					}
					dispatch(getReviewList(requestData));
					dispatch(callActionGetProduct( newState ));
				} else {
					let newState = { ...res.product[0] };
					let requestData = {
						productid: res.product[0].id,
						storeid: data.store_id
					}
					dispatch(getReviewList(requestData));
					dispatch(callActionGetProduct(newState));
				}

				dispatch(loadingSpinner({ loading: false }));
			},
			error: (err) => {
				dispatch(loadingSpinner({ loading: false }));
			},
		}

		API.getProductDetails(data, cb)
	}
}

const callActionGetProduct = (payload) => {
	return {
		type: actionType.GET_PRODUCT_DETAILS,
		payload: payload,
	};
}

export const getReviewList = (payload) => {
	return (dispatch) => {
		const data = {
			...payload,
		}
		dispatch(loadingSpinner({ loading: true }));
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					let newState = { reviews: res};
					dispatch(callActionGetReviews( newState ));
				}

				dispatch(loadingSpinner({ loading: false }));
			},
			error: (err) => {
				dispatch(loadingSpinner({ loading: false }));
			},
		}

		API.getReviewsList(data, cb)
	}
}

const callActionGetReviews = (payload) => {
	return {
		type: actionType.GET_REVIEW_LIST,
		payload: payload,
	};
}

export const addReview = (payload) => {
	return (dispatch, getState) => {
		let lang = getState().global.language
		const data = {
			...payload,
		}
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					let newState = { reviewAdded: true, reviewMsg: lang === "en" ?  "Thanks for submitting your Review. We shall get back to you !" : "شكرا على تقديم تقييمك. سنعود إليك!"};
					let requestData = {
						productid: data.productid,
						storeid: data.storeid
					}
					dispatch(getReviewList(requestData));
					dispatch(callActionGetReviews( newState ));
				}

				dispatch(loadingSpinner({ loading: false }));
			},
			error: (err) => {
				let newState = { reviewAdded: false };
				dispatch(callActionGetReviews( newState ));
				dispatch(loadingSpinner({ loading: false }));
			},
		}

		API.addReview(data, cb)
	}
}
