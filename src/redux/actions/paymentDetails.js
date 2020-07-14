import * as actionType from '../actionTypes';
import { API } from '../../api/api';
import { loadingSpinner } from './globals';
import { getPaymentDetails } from './shippingDetails';
export const setPaymentDetails = (payload) => {
    return (dispatch, getState) => {
        const data = {
            quote_id: payload.quote_id,
            store_id: payload.store_id,
            payment_code: payload.payment_code
        }
        dispatch(loadingSpinner({ loading: true }))
        // dispatch({
        //     type: actionType.SET_VOU_CODE,
        //     payload: { removevouher: false, voucherError: null }
        // });
        let cb = {
            success: (res) => {
                if (res.status && res.code === 200) {
                    let payment_details = {
                        ...getState().myCart.payment_details,
                        redirectToOrderConfirmation: true,
                        payment_code: data.payment_code
                    };

                    dispatch(getPaymentDetails({ store_id: data.store_id, quote_id: data.quote_id }));
                    dispatch(callActionForSetPaymentDetails({ payment_details: { ...payment_details } }))
                }
                // dispatch(loadingSpinner({ loading: false }))
            },
            error: (err) => {
                dispatch(loadingSpinner({ loading: false }))
            }
        }

        API.setPaymentDetails(data, cb)
    }
}

const callActionForSetPaymentDetails = (payload) => {
    //console.log(payload);
    return {
        type: actionType.SET_PAYMENT_CHECKOUT,
        payload: payload
    };
};


export const getPlaceOrder = payload => {
    return (dispatch, getState) => {
        const data = {
            store_id: payload.store_id,
            quote_id: payload.quote_id
        }
        dispatch(loadingSpinner({ loading: true }))
        let cb = {
            success: res => {

                if (res.status) {
                    if (res.order_data.new_quote_id !== "" && getState().login.isUserLoggedIn) {
                        let newQuoteId = {
                            ...getState().login.customer_details,
                            quote_id: res.order_data.new_quote_id,
                        }
                        dispatch(CallActionForUpdateNewQuoteId({ customer_details: { ...newQuoteId } }))
                    } else {
                        dispatch(CallActionForUpdateGuestUserQuoteId({}))
                    }

                    dispatch({
                        type: actionType.SET_VOU_CODE,
                        payload: { voucherSuccess: '', voucher: '', voucherError: '' }
                    })
                    let payfort_data = res.payfort_data;
                    // payfort_data.isPlaceOrderSuccess = true
                    dispatch({
                        type: actionType.GET_PLACE_ORDER,
                        payload: { payfort_data: payfort_data }
                    });

                }
                dispatch(loadingSpinner({ loading: false }))

            },
            error: err => {
                dispatch(loadingSpinner({ loading: false }))
            },
        };

        API.getPlaceOrder(data, cb);
    }
}

export const placeOrder = (payload) => {
    return (dispatch, getState) => {
        const data = {
            quote_id: payload.quote_id,
            store_id: payload.store_id,
        }
        dispatch(loadingSpinner({ loading: true }))
        let cb = {
            success: (res) => {
                //console.log(res);
                if (res.status) {
                    let newState = {
                        order_details: { ...getState().myCart.order_details },
                        is_order_placed: true,
                        order_id: res.order_data.order_number,
                        order_data: { ...res.order_data }
                    }
                    dispatch({
                        type: actionType.SET_VOU_CODE,
                        payload: { voucherSuccess: '', voucher: '', voucherError: '' }
                    })
                    dispatch(callActionForPlaceOrder({ is_order_placed: true, order_summary: { ...newState } }))

                    if (res.order_data.new_quote_id !== "" && getState().login.isUserLoggedIn) {

                        let newQuoteId = {
                            ...getState().login.customer_details,
                            quote_id: res.order_data.new_quote_id,
                        }
                        dispatch(CallActionForUpdateNewQuoteId({ customer_details: { ...newQuoteId } }))
                    } else {
                        dispatch(CallActionForUpdateGuestUserQuoteId({}))
                    }

                }
                dispatch(loadingSpinner({ loading: false }))
            },
            error: (err) => {
                dispatch(loadingSpinner({ loading: false }))
            }
        }

        API.placeOrder(data, cb)
    }
}

const CallActionForUpdateNewQuoteId = (payload) => {
    return {
        type: actionType.UPDATE_NEW_QUOTE_ID,
        payload: payload
    };
};

const CallActionForUpdateGuestUserQuoteId = (payload) => {
    return {
        type: actionType.UPDATE_GUEST_USER_NEW_QUOTE_ID,
        payload: payload
    };
};

const callActionForPlaceOrder = (payload) => {
    return {
        type: actionType.PLACE_ORDER_CHECKOUT,
        payload: payload
    };
};