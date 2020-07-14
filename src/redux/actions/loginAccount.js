import * as actionType from "../actionTypes"
import { loadingSpinner } from "./globals"
import { API } from "../../api/api"
import {getGuestCartId} from './guestUser';
import { getCartCount } from "./getMyCart";
import { store } from '../store/store';
import { getWishlist } from './wishList';

const callActionRegisterUser = (payload) => {
	return {
		type: actionType.REGISTER,
		payload: payload,
	}
}

export const registerUser = (payload) => {
	return (dispatch) => {
		const data = {
			...payload,
		}
		dispatch(callActionRegisterUser({ registerUserDetails: {}, registerLoader: true }))
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					let newState = {
						...res,
						customer_details: { ...res.customer_details },
						isUserLoggedIn: res.status,
						loginMessage: res.message,
					}

					let registerUserDetails = {
						...res,
					}
					dispatch(
						callActionRegisterUser({
							registerUserDetails: { ...registerUserDetails },
							registerSuccess: true,
							registerLoader: false,
						})
					)
					dispatch(callActionLoginUser({ ...newState }))
				} else {
					let registerUserDetails = {
						...res,
					}
					dispatch(
						callActionRegisterUser({
							registerUserDetails: { ...registerUserDetails },
							registerLoader: false,
						})
					)
				}
			},
			error: (err) => {
				dispatch(callActionRegisterUser({ registerUserDetails: { err }, registerLoader: false }))
			},
		}
		API.registerSave(data, cb)
	}
}

const callActionForgotPassword = (payload) => {
	return {
		type: actionType.FORGOT_PASSWORD,
		payload: payload,
	}
}

export const forgotPassword = (payload) => {
	return (dispatch) => {
		const data = {
			...payload,
		}
		dispatch(callActionForgotPassword({ forgotPasswordDetails: {}, forgotPasswordLoader: true }))
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					dispatch(callActionForgotPassword({ forgotPasswordDetails: { ...res } }))
				} else {
					dispatch(callActionForgotPassword({ forgotPasswordDetails: { ...res } }))
				}
				dispatch(callActionForgotPassword({ forgotPasswordLoader: false }))
			},
			error: (err) => {
				dispatch(callActionForgotPassword({ forgotPasswordLoader: false }))
			},
		}
		API.forgotPassword(data, cb)
	}
}

const callActionLoginUser = (payload) => {
	return {
		type: actionType.LOGIN,
		payload: payload,
	}
}
export const loginUser = (payload) => {
	return (dispatch, getState) => {
        let { global } = store.getState();

		const data = {
			email: payload.email,
			password: payload.password,
			guestquote: payload.guestquote,
			wishlist: {
				product_ids: payload.product_id,
			},
			store_id: global.currentStore
		}

		dispatch(callActionLoginUser({ loginLoader: true }))
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					let newState = {
						customer_details: { ...res.customer_details },
						isUserLoggedIn: res.status,
						loginMessage: res.message,
					}
					dispatch(callActionLoginUser({ ...newState }))
					let wishdata = {
						customerid: res.customer_details.customer_id,
						store_id: global.currentStore,
					};
					const payload={quote_id:res.customer_details.quote_id}
					dispatch(getWishlist({...wishdata}));
					dispatch(getCartCount(payload))
				} else {
					let newState = {
						isUserLoggedIn: res.status,
						loginErrorMessage: res.message,
					}
					dispatch(callActionLoginUser({ ...newState }))
				}
				dispatch(callActionLoginUser({ loginLoader: false }))
			},
			error: (err) => {
				let newState = {
					isUserLoggedIn: false,
					errorMessage: "Something Went Wrong..",
					loginLoader: false,
				}
				dispatch(callActionLoginUser({ ...newState }))
			},
		}
		API.loginUser(data, cb)
	}
}

const callActionResestPass = (payload) => {
	return {
		type: actionType.RESET_PASS,
		payload: payload,
	}
}
export const resetPassword = (payload) => {
	return (dispatch) => {
		const data = {
			...payload,
		}
		dispatch(callActionResestPass({ resetPasswordLoader: true }))
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					dispatch(callActionResestPass({ resetPasswordDetails: res }))
				} else {
					dispatch(callActionResestPass({ resetPasswordDetails: res }))
				}
				dispatch(callActionResestPass({ resetPasswordLoader: false }))
			},
			error: (err) => {
				dispatch(callActionResestPass({ resetPasswordLoader: true }))
			},
		}
		API.resetpassword(data, cb)
	}
}
export const OnLogoutUser = () => {
    return{
        type: actionType.LOGOUT_USER,
    };
    
}

export const logoutUser = () => {
    return (dispatch) => {
        dispatch(OnLogoutUser());
        dispatch(getGuestCartId());
        // type: actionType.LOGOUT_USER,
    };
    
}
