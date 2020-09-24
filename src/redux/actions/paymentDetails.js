import * as actionType from '../actionTypes';
import { API } from '../../api/api';
import { loadingSpinner } from './globals';
import {
  getPaymentDetails,
  setShippingDetails,
  setBillingDetails,
} from './shippingDetails';
import { getMyCart } from './getMyCart';
import { updateQuoteID, getGuestCartId } from './guestUser';

export const setPaymentDetails = (payload) => {
  return (dispatch, getState) => {
    const data = {
      quote_id: payload.quote_id,
      store_id: payload.store_id,
      payment_code: payload.payment_code,
    };
    dispatch(loadingSpinner({ loading: true }));
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
            payment_code: data.payment_code,
          };

          dispatch(
            getPaymentDetails({
              store_id: data.store_id,
              quote_id: data.quote_id,
            })
          );
          dispatch(
            callActionForSetPaymentDetails({
              payment_details: { ...payment_details },
            })
          );
        } else {
          if (res.new_quote_id) {
            if (getState().login.isUserLoggedIn && getState().login.customer_details) {
              dispatch({
                type: actionType.LOGIN,
                payload: {
                  customer_details: {
                    ...getState().login.customer_details,
                    quote_id: res.new_quote_id,
                  },
                },
              });
            } else {
              if (getState().login.customer_details) {
                dispatch({
                  type: actionType.LOGIN,
                  payload: {
                    customer_details: {
                      ...getState().login.customer_details,
                      quote_id: null,
                    },
                  },
                });
              }
              dispatch({
                type: actionType.UPDATE_GUEST_USER_NEW_QUOTE_ID_PAYFORT,
                payload: { new_quote_id: res.new_quote_id },
              });
              dispatch(getGuestCartId(res.new_quote_id));
            }
            // dispatch(updateQuoteID(''));
          }
          dispatch(
            callActionForSetPaymentDetails({
              setPaymentFailed: true,
              setPaymentFailedMsg: res.message,
            })
          );
        }
        dispatch(loadingSpinner({ loading: false }));
      },
      error: (err) => {
        dispatch(loadingSpinner({ loading: false }));
      },
    };

    API.setPaymentDetails(data, cb);
  };
};

const callActionForSetPaymentDetails = (payload) => {
  //console.log(payload);
  return {
    type: actionType.SET_PAYMENT_CHECKOUT,
    payload: payload,
  };
};

export const getPlaceOrder = (payload) => {
  return (dispatch, getState) => {
    const data = {
      store_id: payload.store_id,
      quote_id: payload.quote_id,
      save_card: payload.save_card,
      type: 'web',
    };
    dispatch(loadingSpinner({ loading: true }));
    let cb = {
      success: (res) => {
        if (res.status) {
          if (
            res.order_data.new_quote_id !== '' &&
            getState().login.isUserLoggedIn
          ) {
            let newQuoteId = {
              ...getState().login.customer_details,
              quote_id: res.order_data.new_quote_id,
            };
            dispatch(
              CallActionForUpdateNewQuoteId({
                customer_details: { ...newQuoteId },
              })
            );
          } else {
            dispatch(CallActionForUpdateGuestUserQuoteId({}));
          }

          dispatch({
            type: actionType.SET_VOU_CODE,
            payload: {
              voucherSuccess: '',
              voucher: '',
              voucherError: '',
            },
          });
          dispatch({
            type: actionType.GET_PLACE_ORDER,
            payload: { payfort_data: res.payfort_data },
          });
          localStorage.setItem(
            'merchant_reference',
            res.payfort_data.merchant_reference
          );
        } else {
          dispatch({
            type: actionType.GET_PLACE_ORDER,
            payload: {
              placeOrderFailed: true,
              placeOrderMessage: res.message ? res.message : null,
            },
          });
        }
        dispatch(loadingSpinner({ loading: false }));
      },
      error: (err) => {
        dispatch(loadingSpinner({ loading: false }));
        dispatch({
          type: actionType.GET_PLACE_ORDER,
          payload: {
            placeOrderFailed: true,
          },
        });
      },
    };

    API.getPlaceOrder(data, cb);
  };
};

export const placeOrder = (payload) => {
  return (dispatch, getState) => {
    const data = {
      quote_id: payload.quote_id,
      store_id: payload.store_id,
      type: 'web',
    };
    dispatch(loadingSpinner({ loading: true }));
    let cb = {
      success: (res) => {
        //console.log(res);
        if (res.status) {
          let newState = {
            order_details: { ...getState().myCart.order_details },
            is_order_placed: true,
            order_id: res.order_data.order_number,
            order_data: { ...res.order_data },
          };
          dispatch({
            type: actionType.SET_VOU_CODE,
            payload: { voucherSuccess: '', voucher: '', voucherError: '' },
          });
          dispatch(
            callActionForPlaceOrder({
              is_order_placed: true,
              order_summary: { ...newState },
            })
          );

          if (
            res.order_data.new_quote_id !== '' &&
            getState().login.isUserLoggedIn
          ) {
            let newQuoteId = {
              ...getState().login.customer_details,
              quote_id: res.order_data.new_quote_id,
            };
            dispatch(
              CallActionForUpdateNewQuoteId({
                customer_details: { ...newQuoteId },
              })
            );
          } else {
            dispatch(CallActionForUpdateGuestUserQuoteId({}));
          }
        }
        dispatch(loadingSpinner({ loading: false }));
      },
      error: (err) => {
        dispatch(loadingSpinner({ loading: false }));
      },
    };

    API.placeOrder(data, cb);
  };
};

const CallActionForUpdateNewQuoteId = (payload) => {
  return {
    type: actionType.UPDATE_NEW_QUOTE_ID,
    payload: payload,
  };
};

const CallActionForUpdateGuestUserQuoteId = (payload) => {
  return {
    type: actionType.UPDATE_GUEST_USER_NEW_QUOTE_ID,
    payload: payload,
  };
};

const callActionForPlaceOrder = (payload) => {
  return {
    type: actionType.PLACE_ORDER_CHECKOUT,
    payload: payload,
  };
};

export const callActionForPayfortFailed = (payload) => {
  return {
    type: actionType.PAYFORT_FAILED,
    payload: payload,
  };
};

export const payfortRestoreQuote = (payload) => {
  return (dispatch, getState) => {
    const data = { ...payload };
    dispatch(loadingSpinner({ loading: true }));
    let cb = {
      success: (res) => {
        if (res.status) {
          dispatch(
            callActionForPayfortFailed({
              isPayfortFailed: true,
              is_payment_details_rec: true,
              shippingSuccess: true,
            })
          );
          let newQuoteId = {
            ...getState().login.customer_details,
            quote_id: res.quote_id,
          };
          dispatch(
            CallActionForUpdateNewQuoteId({
              customer_details: { ...newQuoteId },
            })
          );

          dispatch(
            getMyCart(
              {
                quote_id: res.quote_id,
                store_id: getState().global.currentStore,
              },
              true
            )
          );

          const { addressData } = res;
          const shippingPayload = {
            AptValue: addressData.shipping.street,
            Id: addressData.shipping.address_id,
            address_id: addressData.shipping.address_id,
            address_object: {
              carrier_code: addressData.shipping.carrier_code,
              city: addressData.shipping.city,
              company: addressData.shipping.company,
              country_id: addressData.shipping.country_id,
              customer_appartment: addressData.shipping.street,
              postcode: addressData.shipping.postcode,
              region_id: addressData.shipping.region_id,
              state: addressData.shipping.state,
              street: addressData.shipping.street,
            },
            address_type: addressData.shipping.customer_address_type,
            billing: 'false',
            carrier_code: addressData.shipping.carrier_code,
            city: addressData.shipping.city,
            cnumber: addressData.shipping.customer_id,
            company: addressData.shipping.company,
            companyName: addressData.shipping.company,
            country_id: addressData.shipping.country_id,
            customer_appartment: addressData.shipping.street,
            defaultAddr: true,
            email: addressData.shipping.email,
            fname: addressData.shipping.firstname,
            isClickAndCollect: false,
            isSelected: true,
            isShippingSet: false,
            isaddressallowed: false,
            isdefaultBilling: false,
            isdefaultShipping: false,
            lego_store_id: getState().global.currentStore,
            lname: addressData.shipping.lastname,
            mnumber: addressData.shipping.telephone,
            postcode: addressData.shipping.postcode,
            quote_id: addressData.shipping.quote_id,
            region_id: addressData.shipping.region_id,
            shipping: 'true',
            shipping_code: 'tablerate_bestway',
            state: addressData.shipping.city,
            store_id: getState().global.currentStore,
            street: addressData.shipping.street,
            telephone: addressData.shipping.telephone,
            userFirstName: addressData.shipping.firstname,
            userID: addressData.shipping.customer_id,
            userLastName: addressData.shipping.lastname,
            whatsapp_notification: addressData.shipping.whatsapp_opt_in,
          };

          dispatch(setShippingDetails(shippingPayload));

          let billingData = {
            billingData: {
              store_id: getState().global.currentStore,
              quote_id: addressData.billing.quote_id,
              fname: addressData.billing.firstname,
              lname: addressData.billing.lastname,
              email: addressData.billing.email,
              cnumber: addressData.billing.customer_id,
              mnumber: addressData.billing.telephone,
              address_id: addressData.billing.address_id,
              shipping_code: 'tablerate_bestway',
              lego_store_id: getState().global.currentStore,
              countryName: addressData.billing.region,
              cityName: addressData.billing.city,
              AptValue: addressData.billing.street,
              companyName: addressData.billing.company,
              address_object: {
                userID: addressData.billing.customer_id,
                userFirstName: addressData.billing.firstname,
                userLastName: addressData.billing.lastname,
                customer_email: addressData.billing.email,
                country_id: addressData.billing.country_id,
                state: addressData.billing.city,
                postcode: addressData.billing.postcode,
                region_id: addressData.billing.region_id,
                carrier_code: addressData.billing.carrier_code,
                city: addressData.billing.city,
                street: addressData.billing.street,
                telephone: addressData.billing.telephone,
                customer_address_type:
                  addressData.billing.customer_address_type,
              },

              shipping: 'false',
              billing: 'true',
            },
          };
          dispatch(setBillingDetails(billingData));
        } else {
          dispatch(
            callActionForPayfortFailed({
              payfortRestoreQuoteFailed: true,
              payfortFailedMessage: res.message,
            })
          );
        }
        dispatch(loadingSpinner({ loading: false }));
      },
      error: (err) => {
        dispatch(
          callActionForPayfortFailed({
            payfortRestoreQuoteFailed: true,
          })
        );
        dispatch(loadingSpinner({ loading: false }));
      },
    };

    API.payfortRestoreQuote(data, cb);
  };
};

export const saveCardPlaceOrder = (payload) => {
  return (dispatch, getState) => {
    const data = {
      store_id: payload.store_id,
      quote_id: payload.quote_id,
      token: payload.card.token,
      card_security_code: payload.card.cvv,
      type: 'web',
    };
    dispatch(loadingSpinner({ loading: true }));
    let cb = {
      success: (res) => {
        if (res.status) {
          if (
            res.order_data.new_quote_id !== '' &&
            getState().login.isUserLoggedIn
          ) {
            let newQuoteId = {
              ...getState().login.customer_details,
              quote_id: res.order_data.new_quote_id,
            };
            dispatch(
              CallActionForUpdateNewQuoteId({
                customer_details: { ...newQuoteId },
              })
            );
          } else {
            dispatch(CallActionForUpdateGuestUserQuoteId({}));
          }

          dispatch({
            type: actionType.SET_VOU_CODE,
            payload: {
              voucherSuccess: '',
              voucher: '',
              voucherError: '',
            },
          });
          dispatch({
            type: actionType.GET_PLACE_ORDER,
            payload: { saved_card_payfort_data: res.payfort_data },
          });
          localStorage.setItem(
            'merchant_reference',
            res.payfort_data.merchant_reference
          );
        } else {
          dispatch({
            type: actionType.GET_PLACE_ORDER,
            payload: {
              placeOrderFailed: true,
              placeOrderMessage: res.message ? res.message : null,
            },
          });
        }
        dispatch(loadingSpinner({ loading: false }));
      },
      error: (err) => {
        dispatch(loadingSpinner({ loading: false }));
        dispatch({
          type: actionType.GET_PLACE_ORDER,
          payload: {
            placeOrderFailed: true,
          },
        });
      },
    };

    API.getPlaceOrder(data, cb);
  };
};
