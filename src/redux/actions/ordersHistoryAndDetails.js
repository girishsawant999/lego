import { loadingSpinner } from './globals';
import * as actionType from '../actionTypes';
import { API } from '../../api/api';
import {setOrderSummary} from './getMyCart';
import { fullBrowserVersion, browserName, osName } from 'react-device-detect';
/////////////////////////////////GET ORDER HISTORY////////////////////////////////////

const callActionGetOrderHistory = (payload) => {

    return {
        type: actionType.GET_ORDER_HISTORY,
        payload: payload
    };
}

export const getOrderHistory = (payload) => {

    return (dispatch) => {
        const data = {
            ...payload,
        }

        dispatch(callActionGetOrderHistory({ loading: true }))
        let cb = {
            success: (res) => {
                if (res.status === true && res.code === 200) {
                    dispatch(callActionGetOrderHistory({ orders_history: res.orders_details, is_order_history_rec: true }))

                }
                dispatch(callActionGetOrderHistory({ loading: false }))

            },
            error: (err) => {

                //console.log(err);
                dispatch(callActionGetOrderHistory({ loading: false }))
            }
        }

        API.getOrderHistory(data, cb)

    }

}


/////////////////////////////////VIEW ORDERS DETAILS////////////////////////////////////

const callActionViewOrderDetails = (payload) => {

    return {
        type: actionType.ORDER_DETAILS_VIEW,
        payload: payload
    };
}

export const viewOrderDetails = (payload) => {

    return (dispatch) => {
        const data = {
            ...payload,
        }

        dispatch(loadingSpinner({ loading: true }))
        dispatch(callActionViewOrderDetails({ orders_details_loader: true }))
        let cb = {
            success: (res) => {
                if (res.status === true && res.code === 200) {
                    dispatch(callActionViewOrderDetails({ orders_details: res.orders_details, is_order_details_rec: true }))

                }
                dispatch(loadingSpinner({ loading: false }))
                dispatch(callActionViewOrderDetails({ orders_details_loader: false }))
            },
            error: (err) => {
                dispatch(loadingSpinner({ loading: false }))
                dispatch(callActionViewOrderDetails({ orders_details_loader: false }))
                //console.log(err);
            }
        }

        API.getOrderDetailsInProfile(data, cb)

    }

}

export const clearState = () => {
    return {
        type: actionType.CLEAR_STATE,
        payload: { is_order_details_rec: false }
    };
}

export const orderJson = (payload) => {

    return (dispatch) => {
        const data = {
            order_id : payload.order_id
        };
        dispatch(loadingSpinner({ loading: true }))

        let cb = {
            success: (res) => {
                    dispatch(setOrderSummary({ 
                        order_id : payload.order_id, 
                        store_id : payload.store_id,
                        device_details: {
                            name : browserName,
                            os : osName,
                            type: "browser",
                            version: fullBrowserVersion
                        }
                    }))

                    dispatch(loadingSpinner({ loading: false }))
            },
            error: (err) => {
                dispatch(loadingSpinner({ loading: false }))
        //console.log(err);
            }
        }

        API.setOrderJson(data, cb)
    }
}