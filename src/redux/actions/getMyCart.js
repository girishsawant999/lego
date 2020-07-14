import * as actionType from '../actionTypes';
import { API } from '../../api/api';
import { loadingSpinner } from './globals';
import * as action from './index';
import { AddToCartEvent , RemoveProductCart } from '../../components/utility/googleTagManager';

/////////////////////////////////////////GET CART//////////////////////////////////////////////////
const callActionitem_added = payload => {
	return {
		type: actionType.GET_ITEM_ADDED,
		payload: payload,
	};
};

const callActionWishlistitem_added = payload => {
	return {
		type: actionType.GET_ITEM_WISHLIST_ADDED,
		payload: payload,
	};
};
 

export  const clearWishListCartMessageState=()=>{
    return(dispatch,getState)=>{
        dispatch(callActionWishlistitem_added({item_added:false}))
    }
}
export const addToCart = (payload, myCart , eventObj) => {
	return (dispatch, getState) => {
		const data={...payload}
        dispatch(loadingSpinner({ loading: true }));
		const eventObjCopy = Object.assign(eventObj);
		// dispatch(callActionitem_added({addToCardLoding: false, item_added: false, add_cart_error : false, add_cart_open_popUp: false}));
		let cb = {
			success: (res) => {
                dispatch(getMyCart(myCart));
                AddToCartEvent(eventObjCopy);
                dispatch(loadingSpinner({ loading: false }));
				dispatch(callActionitem_added({addToCardLoding: false, item_added: res, add_cart_error : false, add_cart_open_popUp: true}));
                setTimeout(() => {
					dispatch(callActionitem_added({ 
						addToCartMsg: '',
						add_cart_open_popUp: false }));
				}, 2000);
            },
			error: err => {
                dispatch(callActionitem_added({
					addToCartMsg: err.message, 
					addToCardLoding: false,
					err_message: err.message,
					add_cart_error : true,
					add_cart_open_popUp: true}));
				setTimeout(() => {
					dispatch(callActionitem_added({ 
						addToCartMsg: '',
						add_cart_open_popUp: false,
						add_cart_error: false }));
                }, 2000);

                dispatch(loadingSpinner({ loading: false }));
			},
		};

		API.addToCart(data, cb);
	};
};

export const addToCartFromWishList = (payload, myCart, eventObj) => {
	return (dispatch, getState) => {
		const data={...payload}
		dispatch({
			type: actionType.WISH_LIST_LOADER,
			payload: { wishLoader: true}
		});
		dispatch(callActionWishlistitem_added({addToCardLoding: false, wishlistaddToCartPopop:false,item_added: false, add_cart_error : false, add_cart_open_popUp: true}));
		const eventObjCopy = Object.assign(eventObj);

		let cb = {
			success: (res) => {
                if(res){
                    AddToCartEvent(eventObjCopy);
                    dispatch({
                        type: actionType.WISH_LIST_LOADER,
                        payload: { wishLoader: false}
                    });
                    dispatch(callActionWishlistitem_added({addToCardLoding: false, message:"", wishlistaddToCartPopop:true,item_added: true, add_cart_error : false, add_cart_open_popUp: true}));
    
                }else{

                    dispatch({
                        type: actionType.WISH_LIST_LOADER,
                        payload: { wishLoader: false}
                    });
                    dispatch(callActionWishlistitem_added({addToCardLoding:  false, message:res.message, wishlistaddToCartPopop:true,item_added: true, add_cart_error : false, add_cart_open_popUp: true}));
    
                }
				
				
			},
			error: err => {
				dispatch({
                    type: actionType.WISH_LIST_LOADER,
                    payload: { wishLoader: false}
				});
				dispatch(callActionWishlistitem_added({addToCardLoding: false,message:err.message,wishlistaddToCartPopop:false, item_added: true, add_cart_error : false, add_cart_open_popUp: true}));

			},
		};

		API.addToCart(data, cb);
	};
};
/////////////////////////////////////////////UPDATE CART//////////////////////////////////////////////////


//////////////////////////////////////////// Get My cart /////////////////////////////////
export const callActionForMyCart = (payload) => {
    return {
        type: actionType.GET_MY_CART,
        payload: payload
    };
}

export const clearCartItem = () => {
    return {
        type: actionType.CLEAR_CART_ITEM,
        payload: {}
    }
}

export const getMyCart = (payload, isCallPayment = false, voucher = '') => {
    //console.log('get my cart : ', payload)
    return (dispatch, getState) => {
        const data = {
            quote_id: payload.quote_id,
            store_id: payload.store_id,
		}
		dispatch(loadingSpinner({ loading: true }));
        // if (payload.applyVoucode === undefined) {
        //     dispatch({
        //         type: actionType.LOADING_SPINNER,
        //         payload: { loading: true, shippingLoader: true, text: 'cart start' }
        //     });
        // }

        // dispatch({
        //     type: actionType.SET_VOU_CODE,
        //     payload: { voucher: '', removevouher: false, voucherError: null, voucherSuccess: null }
        // })

        // dispatch({
        //     type: actionType.CARD_LOADER,
        //     payload: { loader: true }
        // });

        let cb = {
            success: (res) => {
                if ((res.status) && (res.code === 200) && ('data' in res)) {
                    let newState = {
                        ...res.data,
                        is_cart_details_rec: true,
                    }
                    // if (payload.applyVoucode === undefined) {
                    //     newState.voucher_discount = null;
                    //     newState.voucherError = null;
                    //     newState.shipping_amount = 0;
                    // }
                    dispatch(callActionForMyCart(newState));
                    dispatch(loadingSpinner({ loading: false }));
                    if (isCallPayment || getState().myCart.my_cart_count <= 1) {
                        dispatch(getPaymentDetailsAfterVou({
                            quote_id: data.quote_id,
                            store_id: data.store_id,
                        }));
                    }
                   
                    const payload={quote_id:res.data.quote_id}
                    dispatch(getCartCount(payload))

                } else if ((res.status) && (res.code === 200) && (!('data' in res))) {
					dispatch(clearCartItem())
					dispatch(loadingSpinner({ loading: false }));
                }

                dispatch(loadingSpinner({ loading: false }));
                // if (isCallPayment) {
                //     dispatch(action.getMyCartAfterVoucher({
                //         store_id: payload.store_id,
                //         quote_id: payload.quote_id,
                //         voucher: voucher
                //     }));
                // }
                // if (payload.applyVoucode === undefined && !isCallPayment) {
                //     dispatch(loadingSpinner({ loading: false }))
                // }
                // dispatch({
                //     type: actionType.CARD_LOADER,
                //     payload: { loader: false }
                // });
                // dispatch({
                //     type: actionType.ADD_TO_CARD_LOADER,
                //     payload: { addToCardLoader: false }
                // });

                // if (!isCallPayment) {
                //     dispatch({
                //         type: actionType.LOADING_SPINNER,
                //         payload: { loading: false, text: 'cart end' }
                //     });

                // }

                // dispatch({
                //     type: actionType.QTY_UPDATE_LOADER,
                //     payload: { update_loader: false }
                // });
            },
            error: (err) => {
				dispatch(callActionForMyCart(err.data))
				dispatch(loadingSpinner({ loading: false }));
                // if (payload.applyVoucode === undefined) {
                //     dispatch(loadingSpinner({ loading: false, text: 'cart error' }))
                // }
                // dispatch({
                //     type: actionType.CARD_LOADER,
                //     payload: { loader: false }
                // });
                // dispatch({
                //     type: actionType.ADD_TO_CARD_LOADER,
                //     payload: { addToCardLoader: false }
                // });
                // dispatch({
                //     type: actionType.QTY_UPDATE_LOADER,
                //     payload: { update_loader: false }
                // });
            }
        }
        
        API.getMyCartApi(data, cb)
    }
}

const callActionForGetPaymentDetails = (payload) => {
    return {
        type: actionType.GET_PAYMENT_CHECKOUT,
        payload: payload
    };
};

export const getPaymentDetailsAfterVou = (payload) => {
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
/////////////////////////////////GET CART COUNT/////////////////////

const callActionForGetCartCount=(payload)=>{
    return{
        type:actionType.GET_CART_COUNT,
        payload:payload
    }
}

export const getCartCount=(payload)=>{
    return (dispatch, getState) => {
        const data = {
            quote_id: payload.quote_id
        }
		

        let cb = {
            success: (res) => {
         
                if ((res.status)  && ('data' in res)) {
                  
                   dispatch(callActionForGetCartCount({my_cart_count:res.data.cart_count})) 

                } else if ((res.status) && (res.code === 200) && (!('data' in res))) {
                    dispatch(callActionForGetCartCount({my_cart_count:res.data.cart_count}))
                }
                
            },
            error: (err) => {
                dispatch(callActionForGetCartCount({my_cart_count:0}))
            }
        }
        
        API.getCartCount(data, cb)
    }

}

/////////////////////////////////////////////UPDATE CART//////////////////////////////////////////////////
export const changeQtyState = (payload) => {

    return {
        type: actionType.CHANGE_QTY,
        payload: payload
    };

}

export const changeQty = (payload) => {
    return (dispatch, getState) => {
        let prodArray = getState().myCart.products;
        let newProduct = payload.product;
        let newQty = payload.quantity;

        if (payload.type === 'inc') {
            newQty = payload.qty + 1;

        } else if ((payload.type === 'dec') && (newQty > 1)) {
            newQty = payload.qty - 1;
        }

        let data = {
            product_id: newProduct.id,
            quote_id: getState().myCart.quote_id,
            qty: newQty,
            sku: newProduct.sku,
            // store_id: getState().global.currentStore,
        }
        dispatch(loadingSpinner({ loading: true }));

        let cb = {
            success: (res) => {
                if (res.status) {
                    if (payload.type === 'inc') {
                        newProduct.qty = res.data.cart_count;
                    } else if ((payload.type === 'dec') && (newProduct.qty > 1)) {
                        newProduct.qty = res.data.cart_count;
                    }

                    let data = { ...res }

                    dispatch(changeQtyState({ products: prodArray, update_qty_response: data }))
                    dispatch(getMyCart({
                        quote_id: getState().myCart.quote_id,
                        store_id: getState().global.currentStore,
                    }));

                }
                // dispatch(loadingSpinner({ loading: false }))
            },
            error: (err) => {
                dispatch(changeQtyState(err.data))
                dispatch(loadingSpinner({ loading: false }))
            }
        }

        API.updateCart(data, cb)
    }
}

////////////////////////////////////////REMOVE PRODUCT CART/////////////////////////////////////////

export const removeProductState = (payload) => {
    //console.log(payload);
    return {
        type: actionType.REMOVE_ITEM,
        payload: payload
    };

}

export const removeProduct = (payload) => {
    return (dispatch, getState) => {
        let prodArray = getState().myCart.products;
        let newPorduct = payload.product;
        // let allProduct = [...getState().myCart.products];
        let removeProd = Object.assign(payload.product);

        let data = {
            sku: newPorduct.sku,
            quote_id: getState().myCart.quote_id,
        }
        dispatch(loadingSpinner({ loading: true }))
        dispatch(removeProductState({ removeloader: true, itemremoved: {} }))
        let cb = {
            success: (res) => {
                if (res.status) {
                    prodArray.splice(payload.index, 1)
                    dispatch(removeProductState({ products: [...prodArray], removeloader: false, itemremoved: {...res} }))
                    RemoveProductCart({
                        product: [{
                            name: removeProd.product_name,
                            id: removeProd.sku,
                            price: removeProd.special_price ? removeProd.special_price : removeProd.price,
                            brand: 'Google',
                            category: '',
                            quantity: removeProd.qty
                        }]
                    });
                }

                dispatch(getMyCart({
                    quote_id: getState().myCart.quote_id,
                    store_id: getState().global.currentStore,
                }));
                // dispatch(loadingSpinner({ loading: false }))
            },
            error: (err) => {
                dispatch(removeProductState(err.data))
                dispatch(loadingSpinner({ loading: false }))
            }
        }


        API.deleteCart(data, cb);

    }
}

export const applyVoucode = (payload) => {
    return (dispatch,getState) => {
        const data = {
            ...payload
        }

        dispatch(loadingSpinner({ loading: true }))
        let cb = {
            success: (res) => {
                if (res.status) {
                    let obj = {
                        quote_id: getState().myCart.quote_id,
                        store_id: getState().global.currentStore,
                    };
                    dispatch(getMyCart(obj, true, payload.voucode));
                    // dispatch(action.getMyCartAfterVoucher({
                    //     store_id: payload.store,
                    //     quote_id: payload.quoteid,
                    //     voucher: payload.voucode
                    // }));
                    // dispatch(loadingSpinner({ loading: false }))
                    dispatch({
                        type: actionType.SET_VOU_CODE,
                        payload: { voucherError: "" , voucherSuccess: res.message, voucher: payload.voucode }
                    }) 
                //    localStorage.setItem('voucherCode', payload.voucode);
                } else {
                    dispatch(loadingSpinner({ loading: false }))
                    dispatch({
                        type: actionType.SET_VOU_CODE,
                        payload: { voucherSuccess: '', voucher: payload.voucode, removevouher: false, voucherError: res.message }
                    });
                }
            },
            error: (err) => {
                dispatch(loadingSpinner({ loading: false }))
                dispatch({
                    type: actionType.SET_VOU_CODE,
                    payload: { voucher: payload.voucode, removevouher: false }
                });
            }
        }

        API.applyVoucode(data, cb);
    }
}

export const removeVoucode = (payload) => {
    return dispatch => {
        const data = {
            store: payload.store,
            voucode: payload.voucode,
            quoteid: payload.quoteid
        }

        dispatch(loadingSpinner({ loading: true }))
        let cb = {
            success: (res) => {
                if (res.status) {
                    let obj = {
                        quote_id: payload.quoteid,
                        store_id: payload.store,
                    };
                    dispatch(getMyCart(obj, true, ''));
                    // dispatch(action.getMyCartAfterVoucher({
                    //     store_id: payload.store,
                    //     quote_id: payload.quoteid
                    // }));
                    // dispatch(loadingSpinner({ loading: false }))
                    dispatch({
                        type: actionType.SET_VOU_CODE,
                        payload: { voucher: '', removevouher: false, voucherError: null, voucherSuccess: res.message }
                    })
                    // localStorage.removeItem('voucherCode');
                    setTimeout(() => {
                        dispatch({
                            type: actionType.SET_VOU_CODE,
                            payload: { voucherSuccess: null }
                        })
                    }, 8000)
                } else {
                    dispatch(loadingSpinner({ loading: false }))
                    dispatch({
                        type: actionType.SET_VOU_CODE,
                        payload: { voucher: payload.voucode, removevouher: true, voucherError: res.message }
                    })
                }
            },
            error: (err) => {
                dispatch(loadingSpinner({ loading: false }))
                dispatch({
                    type: actionType.SET_VOU_CODE,
                    payload: { voucher: payload.voucode, removevouher: true }
                })
            }
        }

        API.removeVoucode(data, cb);
    }
}


export const setOrderSummary = (payload) => {
    return dispatch => {
        const data = {
            store_id: payload.store_id,
            order_id: payload.order_id
        }
        dispatch(loadingSpinner({ loading: true }))
        let cb = {
            success: res => {
               
                dispatch({
                    type: actionType.SET_ORDER_SUMMARY_DATA,
                    payload: { order_summary: { order_data: res.order_data } }
                })
                dispatch(loadingSpinner({ loading: false }))
                dispatch(clearCartItem());
            },
            error: err => {
                dispatch(loadingSpinner({ loading: false }))
            },
        };

        API.getOrderSummary(data, cb);
    }
}
