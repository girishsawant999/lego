import * as actionTypes from '../actionTypes';
import { API } from '../../api/api';
import { getMyCart } from '../actions/index';
import { loadingSpinner, loadingSpinnerForProduct } from './globals';

export const referFriend = payload => {
	return (dispatch,getState) => {
		const data = {
			supplier_id: payload.supplier_id,
			friend1: payload.friend1,
			friend2: payload.friend2,
			friend3: payload.friend3,
			friend4: payload.friend4,
			friend5: payload.friend5,
        };

        dispatch(callReferFriend({referfriendLoader: true , referfriend: {} }));
        dispatch(loadingSpinner({ loading: true }));
        
        let cb = {
			success: res => {
				if (res.status && res.message) {
					dispatch(callReferFriend({referfriendLoader: false , referfriend: { message: res.message, status: res.status } }));
				} else {
					dispatch(callReferFriend({referfriendLoader: false , referfriend: { message: res.message, status: res.status } }));
				}
			},
			error: err => { },
		};
		API.addreferFriend(data, cb);
	};
};
export const callReferFriend = payload => {
	return ({
		type: actionTypes.REFERAL_DETAIL,
		payload: payload
	})
}