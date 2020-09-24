import { API } from '../../api/api';
import { AddToCartEvent } from '../../components/utility/googleTagManager';
import * as actionType from '../actionTypes';
import { getMyCart } from './getMyCart';
import { loadingSpinner } from './globals';

/////////////////////////////////GET GUEST CART ID////////////////////////////////////

const callActionGetGuestCartId = (payload) => {
  return {
    type: actionType.GUEST_USER_CART_ID,
    payload: payload,
  };
};

export const getGuestCartId = () => {
  return (dispatch) => {
    let data = {};

    let cb = {
      success: (res) => {
        // console.log('LOCAL getGuestCartId:', res);
        if (res !== null) {
          dispatch(callActionGetGuestCartId({ temp_quote_id: res }));
        }
      },
      error: (err) => {
        //console.log(err);
      },
    };

    API.getGuestCartId(data, cb);
  };
};

export const callActionForGuestAddToCart = (payload) => {
  //console.log('callActionForGuestAddToCart', payload);
  return {
    type: actionType.GUEST_ADD_TO_CART,
    payload: payload,
  };
};

/////////////////////////////////GET GUEST CART////////////////////////////////////

// const callActionForGetGuestCart = (payload) => {
//     return {
//         type: actionType.REMOVE_PRODUCT_FROM_WISHLIST,
//         payload: payload
//     };
// }
const callActionitem_added = (payload) => {
  return {
    type: actionType.GET_ITEM_ADDED,
    payload: payload,
  };
};

export const guestAddToCart = (payload, myCart, eventObj) => {
  // console.log("GUEST ADD2CART:", payload);
  return (dispatch, getState) => {
    const data = {
      cart_item: payload.cart_item,
    };
    const eventObjCopy = Object.assign(eventObj);
    dispatch(loadingSpinner({ loading: true }));
    let cb = {
      success: (res) => {
        //myCart.quote_id = res.quote_id;
        AddToCartEvent(eventObjCopy);
        dispatch(callActionForGuestAddToCart({ new_quote_id: res.quote_id }));
        myCart.quote_id = res.quote_id;
        dispatch(getMyCart(myCart));
        dispatch(loadingSpinner({ loading: false }));
        dispatch(
          callActionitem_added({
            addToCardLoding: false,
            item_added: res,
            add_cart_error: false,
            add_cart_open_popUp: true,
          })
        );
        setTimeout(() => {
          dispatch(
            callActionitem_added({
              addToCartMsg: '',
              add_cart_open_popUp: false,
            })
          );
        }, 2000);
        //dispatch(loadingSpinner({ loading: false }));
        // dispatch(onChangeQuantity());
        // if(length !== ''){
        // 	dispatch(setLength({
        // 		item_id: res.item_id,
        // 		length: length
        // 	}));
        // }
        // dispatch(callActionitem_added({addToCardLoding: false, item_added: res, add_cart_error : false, add_cart_open_popUp: true}));
      },
      error: (err) => {
        // dispatch(getMyCart(myCart));
        dispatch(loadingSpinner({ loading: false }));
        // dispatch({
        // 	type: actionType.ADD_TO_CARD_LOADER,
        // 	payload: { addToCardLoader: false }
        // });
        dispatch(
          callActionitem_added({
            addToCartMsg: err.message,
            addToCardLoding: false,
            item_added: err.message,
            add_cart_error: true,
            add_cart_open_popUp: true,
          })
        );
        setTimeout(() => {
          dispatch(
            callActionitem_added({
              addToCartMsg: '',
              add_cart_open_popUp: false,
              add_cart_error: false,
            })
          );
        }, 2000);
      },
    };

    let store_code;
    if (getState().global.currentStore) {
      store_code = getState().global.currentStore;
    } else {
      store_code = getState().global.currentStore;
    }
    API.guestAddToCart(data, cb, store_code, getState().global.store_locale);
  };
};
////////////////////////////////////////////////

export const startGuestCheckout = () => {
  return {
    type: actionType.START_GUEST_CHECKOUT,
    payload: { startGuestCheckout: true },
  };
};

export const updateQuoteID = (new_quote_id) => {
  return (dispatch, getState) => {
    dispatch(
      getMyCart({
        store_id: getState().global.currentStore,
        quote_id: new_quote_id,
      })
    );
    dispatch({
      type: actionType.UPDATE_GUEST_USER_NEW_QUOTE_ID_PAYFORT,
      payload: { new_quote_id: new_quote_id },
    });
    dispatch({
      type: actionType.UPDATE_MYCART_QUOTE_ID,
      payload: { quote_id: new_quote_id },
    });
  };
};
