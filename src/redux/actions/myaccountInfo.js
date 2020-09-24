import * as actionType from "../actionTypes";
import { API } from "../../api/api";
import { loadingSpinner } from './globals';

const actionForGetAccountPageData = (payload) => {
	return {
		type: actionType.GET_ACCOUNT_PAGE_DATA,
		payload: payload,
	}
}

const actionUpdateAccountInfo = (payload) => {
	return {
		type: actionType.UPDATE_ACCOUNT_PAGE_DATA,
		payload: payload,
	}
}

const callActionLoginUser = (payload) => {
	return {
		type: actionType.LOGIN,
		payload: payload,
	}
}

export const updateAccountInfoData = (payload) => {
	return (dispatch, getState) => {
		const data = { ...payload }
		dispatch(actionForGetAccountPageData({ updateLoader: true }))
		let cb = {
			success: (res) => {
				const newState = {
					status: true,
					...res,
				}

				const payload2 = {
					customerid: getState().login.customer_details.customer_id,
				}

				let customer_details = { ...getState().login.customer_details };
				customer_details.firstname = res.firstname;
				customer_details.lastname = res.lastname;
				res.custom_attributes.forEach((attr) => {
					if (attr.attribute_code === "customer_telephone") {
						customer_details.phone_number = attr.value;
					} else if (attr.attribute_code === "country_carrier_code") {
						customer_details.carrier_code = attr.value;
					}
				}) 

				let newCustomerState = {
					customer_details: { ...customer_details },
				}
				dispatch(callActionLoginUser({ ...newCustomerState }))
				
				dispatch(actionForGetAccountPageData({ user: newState, updateLoader: false }))
				dispatch(getAddressBook({...payload2}))
				 
				// if (res.status === true && res.code === 200) {
				// 	console.log('Success');
				// 	dispatch(actionForGetAccountPageData({ user: res, accountLoader: false }))
				// } else {
				// 	console.log('Fails');
				// 	dispatch(actionForGetAccountPageData({ user: res, accountLoader: false }))
				// }
			},
			error: (err) => {
				dispatch(actionForGetAccountPageData({updateErr:err, updateLoader: false }))
			},
		}
		API.updateAccountInfo(data, cb, payload)
	}
}
export const getAccountPageData = (payload) => {
	return (dispatch) => {
		const data = {}
		dispatch(actionForGetAccountPageData({ accountLoader: true }))
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					dispatch(actionForGetAccountPageData({ user: res, accountLoader: false }))
				} else {
					dispatch(actionForGetAccountPageData({ user: res, accountLoader: false }))
				}
			},
			error: (err) => {
				dispatch(actionForGetAccountPageData({ accountLoader: false }))
			},
		}
		API.getAccountPageData(data, cb, payload.url_key)
	}
}

const actionDeleteAddress = (payload) => {
	return {
		type: actionType.DELETE_ADDRESS,
		payload: payload,
	}
}
export const deleteAddress = (payload) => {
	return (dispatch, getState) => {
		const data = { ...payload }
		const payload2 = {
			customerid: getState().login.customer_details.customer_id,
		}
		dispatch(actionDeleteAddress({ deleteAddressLoader: true }))
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					dispatch(getAddressBook({...payload2}))
					dispatch(actionDeleteAddress({ deleteAddressData: res, deleteAddressLoader: false }))
				} else {
					dispatch(getAddressBook({...payload2}))
					dispatch(actionDeleteAddress({ deleteAddressData: res, deleteAddressLoader: false }))
				}
			},
			error: (err) => {
				dispatch(actionDeleteAddress({ deleteAddressLoader: false }))
			},
		}
		API.deleteAddress(data, cb)	
	}
}

const actionAddAddress = (payload) => {
	return {
		type: actionType.ADD_ADDRESS,
		payload: payload,
	}
}
export const AddAddress = (payload) => {
	return (dispatch) => {
		const data = { ...payload }
		dispatch(actionAddAddress({ addAddressLoader: true }))
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					dispatch(actionAddAddress({ addAddressData: res, addAddressLoader: false }))
				} else {
					dispatch(actionAddAddress({ addAddressData: res, addAddressLoader: false }))
				}
			},
			error: (err) => {
				dispatch(actionAddAddress({ addAddressLoader: false }))
			},
		}
		API.addAddress(data, cb)
	}
}

const actionChangePassword = (payload) => {
	return {
		type: actionType.CHANGE_PASSWORD,
		payload: payload,
	}
}
export const changePassword = (payload) => {
	return (dispatch) => {
		const data = { 
			newPassword: payload.newPassword,
			currentPassword: payload.currentPassword,
		 }
		dispatch(actionChangePassword({ changePasswordLoader: true }))
		let cb = {
			success: (res) => {
				if (res) {
				const changePasswordData= {
					message : "Done",
					status : true
				}
				dispatch(actionChangePassword({changePasswordData : changePasswordData}))
				} 
				dispatch(actionChangePassword({ changePasswordLoader: false }))
			},
			error: (err) => {
				const errState = {
					message : "Fail",
					status : false
				}
				dispatch(actionChangePassword({ changePasswordData: errState, changePasswordLoader: false }))
			},
		}
		API.changePassword(data, cb ,payload.customerId)
	}
}

const actionGetAddressBook = (payload) => {
	return {
		type: actionType.ADDRESS_BOOK,
		payload: payload,
	}
}
export const getAddressBook = (payload) => {
	return (dispatch) => {
		const data = { ...payload }
		dispatch(actionGetAddressBook({ AddressBookData: {}, addAddressData: {},deleteAddressData:{}, AddressBookLoader: true }))
		let cb = {
			success: (res) => {
				if (res.status === true && res.code === 200) {
					dispatch(actionGetAddressBook({ AddressBookData: res, AddressBookLoader: false }))
				} else {
					const newState = { status: true }
					dispatch(actionGetAddressBook({ AddressBookData: newState, AddressBookLoader: false }))
				}
			},
			error: (err) => {
				dispatch(actionGetAddressBook({ AddressBookLoader: false }))
			},
		}
		API.getAddressBook(data, cb)
	}
}

export const deleteCard = (payload) => {
	return (dispatch, getState) => {
		const data = { ...payload }
		dispatch(loadingSpinner({ loading: true }));
		let payment_details = {
			...getState().myCart.payment_details,
		}
		let cb = {
			success: (res) => {
				if (res.status === 200) {
					if (payment_details && payment_details.payfort_fort_cc && payment_details.payfort_fort_cc.cards) {
						payment_details.payfort_fort_cc.cards = payment_details.payfort_fort_cc.cards.filter(item => {
							return payload.id !== item.id
						});
					}
					dispatch(loadingSpinner({ loading: false }))

					dispatch({
						type: actionType.GET_PAYMENT_CHECKOUT,
						payload: {
							deleteCardMsg: res.message,
							payment_details
						}
					});
					setTimeout(() => {
						dispatch({
							type: actionType.GET_PAYMENT_CHECKOUT,
							payload: {
								deleteCardMsg: '',
								payment_details
							}
						});
					}, 2000);
				} else {
					dispatch(loadingSpinner({ loading: false }))

					dispatch({
						type: actionType.GET_PAYMENT_CHECKOUT,
						payload: {
							deleteCardMsg: res.message,
							payment_details
						}
					});

					setTimeout(() => {
						dispatch({
							type: actionType.GET_PAYMENT_CHECKOUT,
							payload: {
								deleteCardMsg: '',
								payment_details
							}
						});
					}, 2000);
				}
			},
			error: (err) => {
				dispatch(loadingSpinner({ loading: false }))
			},
		}

		API.deleteSavedCard(data, cb);
	}
}
