import * as actionType from '../actionTypes';
import { API } from '../../api/api';
import { loadingSpinner } from './globals';
import { getMyCart } from './getMyCart';
import * as action from './index';

export const callActiongetAddressFromShippingDetails = (payload) => {

    return {
        type: actionType.GET_SHIPPING_TYPE,
        payload: payload
    };
}

export const getAddressFromShippingDetails = (payload) => {
    return (dispatch, getState) => {
        const data = {
            customer_id: payload.customer_id,
            store_id: payload.store_id,
        }
        dispatch(loadingSpinner({ shippingLoader: true }))
        if (getState().guest_user.startGuestCheckout === true) {
            if (getState().login.customer_details.quote_id) {
                dispatch(getMyCart({
                    quote_id: getState().login.customer_details.quote_id,
                    store_id: payload.store_id
                }))
            }
        }
        let cb = {
            success: (res) => {

                if (res.status && res.code === 200) {
                    let newState = {
                        available_address: res.addressData.length > 0,
                        addressData: res.addressData,
                        is_shipping_details_rec: true,
                        active_shipping_methods: res.active_shipping_methods,
                    }

                    dispatch(callActiongetAddressFromShippingDetails(newState))
                }

                dispatch(loadingSpinner({ shippingLoader: false }))
            },
            error: (err) => {

                dispatch(loadingSpinner({ shippingLoader: false }))

            }
        }

        API.getShippingType(data, cb)
    }
}

export const setShippingDetails = (payload) => {
    return {
        type: actionType.SET_SHIPPING_DETAILS,
        payload: payload
    };
}

export const setBillingDetails = (payload) => {
    return {
        type: actionType.SET_BILLING_DETAILS,
        payload: payload
    };
}

export const setShippingSuccess = (payload) => {

    return {
        type: actionType.GET_SHIPPING_SUCCESS,
        payload: payload
    };
}

// export const setVoucherMessage = (payload) => {

//     return {
//         type: actionType.SET_VOUCHER_MESSAGE,
//         payload: payload
//     };
// }

export const setAddressFromShippingDetails = (payload) => {
    return (dispatch, getState) => {
        const data = {
            address_id: payload.address_id,
            address_object: payload.address_object,
            cnumber: payload.cnumber,
            email: payload.email,
            fname: payload.fname,
            lname: payload.lname,
            mnumber: payload.mnumber,
            quote_id: payload.quote_id,
            nayomi_store_id: "",
            shipping_code: payload.shipping_code,
            store_id: payload.store_id,
            lego_store_id: payload.lego_store_id,
            store_id: payload.lego_store_id,
            shipping : payload.shipping,
            billing : payload.billing,
        }

        data.address_object.customer_appartment = payload.AptValue ? payload.AptValue : '';
        data.address_object.company = payload.companyName ? payload.companyName : '';

        dispatch(loadingSpinner({ loading: true }))
        dispatch(setShippingSuccess({ shippingSuccess: false,  shipping_code: payload.shipping_code }))
        let cb = {
            success: (res) => {
                if (res.status && res.code === 200) {
                    dispatch(loadingSpinner({ loader: false }));
                    dispatch(setShippingSuccess({ shippingSuccess: true }));
                    dispatch(getPaymentDetails({ store_id: data.store_id, quote_id: data.quote_id }));
                } else {
                    // dispatch(loadingSpinner({ loading: false }));
                    dispatch(setShippingSuccess({ shippingSuccess: false }));
                    dispatch(getMyCart({
                        quote_id: getState().login.customer_details.quote_id,
                        store_id: payload.store_id
                    }))
                }
                // if(res && res.voucher && res.voucher.voucherAlreadyRedeemed){
                //     if (localStorage.getItem('voucherCode')) {
                //         localStorage.removeItem('voucherCode');
                //     }
                // }
                // if(res && res.voucher && res.voucher.message){
                //    dispatch(setVoucherMessage({ voucherMessage: res.voucher.message }))
                // }
            },
            error: (err) => {
                dispatch(loadingSpinner({ loading: false }))
                dispatch(setShippingSuccess({ shippingSuccess: false }));
                dispatch(getPaymentDetails({ store_id: data.store_id, quote_id: data.quote_id }));
            }
        }

        API.setShippingType(data, cb)
    }

}

const callActionForGetPaymentDetails = (payload) => {
    return {
        type: actionType.GET_PAYMENT_CHECKOUT,
        payload: payload
    };
};

export const getPaymentDetails = (payload) => {
    return (dispatch, getState) => {
        const data = {
            quote_id: payload.quote_id,
            store_id: payload.store_id,
        }

        dispatch(loadingSpinner({ loading: true }))
        let cb = {
            success: (res) => {
                if (res.status && res.code === 200) {
                    let payment_d = { ...res.data }
                    dispatch(callActionForGetPaymentDetails({
                        is_payment_details_rec: true,
                        payment_details: payment_d
                    }))

                    let myCard = {
                        ...getState().myCart,
                        currency: res.cart_data.currency,
                        discount_amount: res.cart_data.discount_amount,
                        grand_total: res.cart_data.grand_total,
                        shipping_amount: res.cart_data.shipping_amount,
                        subtotal: res.cart_data.subtotal,
                        tax_amount: res.cart_data.tax_amount,
                        voucher_discount: res.cart_data.voucher_discount
                    };

                    dispatch({
                        type: actionType.GET_MY_CART,
                        payload: myCard
                    });

                   // dispatch(setShippingSuccess({ shippingSuccess: false }))
                } else {
                    dispatch(setShippingSuccess({ shippingSuccess: false }));
                }
                dispatch(loadingSpinner({ loading: false }))
                // if(payload.voucher) {
                //     dispatch({
                //         type: actionType.SET_VOU_CODE,
                //         payload:{voucher: payload.voucher, removevouher: true, voucherError: null}
                //     });
                // }
            },
            error: (err) => {
                dispatch(loadingSpinner({ loading: false }))
            }
        }

        API.getPaymentDetails(data, cb)
    }
}