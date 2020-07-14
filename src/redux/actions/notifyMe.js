import * as actionType from "../actionTypes"
import { API } from "../../api/api"

const actionNotifyMe = (payload) => {
	return {
		type: actionType.NOTIFY_ME,
		payload: payload,
	}
}

export const notifyMe = (payload) => {
	return (dispatch) => {
		const data = {
			...payload,
        }
		dispatch(actionNotifyMe({ notifyLoader: true }))
		let cb = {
			success: (res) => {
			    dispatch(actionNotifyMe({ ...res,notifyLoader: false }))
			},
			error: (err) => {
				dispatch(actionNotifyMe({ notifyLoader: false }))
			},
		}
		API.notifyMe(data, cb)
	}
}