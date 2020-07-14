import * as actionType from '../actionTypes';
import { API } from '../../api/api';
import { loadingSpinner } from "./globals";
import { store } from '../store/store';
/////////////////////////////////GET WISHLIST////////////////////////////////////

var wishdata = {}
const callActionGetWishlist = (payload) => {

    return {
        type: actionType.GET_WISHLIST_ITEM,
        payload: payload
    };
}

export const callProductWishDetail = payload => {
    return ({
        type: actionType.PRODUCT_WISH_DETAIL,
        payload: payload
    })
}

export const getWishlist = (payload) => {

    return (dispatch) => {
        const data = {
            ...payload,
        }
        wishdata = payload;
        dispatch({
            type: actionType.WISH_LIST_LOADER,
            payload: { wishLoader: true, wishResult:false}
        });
        let cb = {
            success: (res) => {
                dispatch({
                    type: actionType.WISH_LIST_LOADER,
                    payload: { wishLoader: false, wishResult:true}
                });
                setTimeout(() => {
                    dispatch({
                        type: actionType.WISH_LIST_LOADER,
                        payload: { wishLoader: false, wishResult:false}
                    });
                }, 1000);
                if (res.status === true && res.code === 200) {

                    if (res.data !== null) {
                        dispatch(callActionGetWishlist({ products: [...res.data] }))

                    } else {
                        dispatch(callActionGetWishlist({ products: [] }))

                    }

                }
            },
            error: (err) => {
                dispatch({
                    type: actionType.WISH_LIST_LOADER,
                    payload: { wishLoader: false, wishResult:false}
                });
            }
        }

        API.getWishList(data, cb)

    }

}


/////////////////////////////////REMOVE WISHLIST////////////////////////////////////

const callActionForRemoveWishlist = (payload) => {

    return {
        type: actionType.REMOVE_PRODUCT_FROM_WISHLIST,
        payload: payload
    };
}

export const removeWishList = (payload) => {
    return (dispatch, getState) => {
        let prodArray = getState().wishList.products;
        const data = {
            wishilistitemid: payload.wishilistitemid
        }
        let { global, login } = store.getState();
        wishdata = {
			customerid: login.customer_details.customer_id,
			store_id: global.currentStore,
        };
        let message = wishdata.store_id === 2 ? ' Item has been removed from Wish List ' : 'تم إزالة المنتج من  قائمة الأمنيات'

		dispatch(callProductWishDetail({wishListLoader : true , removewishlist: '', addwishlist: '',  wishListMessage : message}));
        dispatch(loadingSpinner({ loading: true }));
        dispatch({
            type: actionType.WISH_LIST_LOADER,
            payload: { wishLoader: true}
        });
        let cb = {
            success: (res) => {
                dispatch({
                    type: actionType.WISH_LIST_LOADER,
                    payload: { wishLoader: false}
                });
                dispatch(loadingSpinner({ loading: false }));
                if (res.status === true && res.code === 200) {
					dispatch(getWishlist({...wishdata}));
                    // if (payload.index !== -1) {
                    //     prodArray.splice(payload.index, 1);
                    //     dispatch(callActionForRemoveWishlist({ products: [...prodArray] }))
                    // }
                    dispatch(callProductWishDetail({ wishListLoader : false , addwishlist: false, removewishlist: true, productWishDetail: { is_in_wishlist: false, wishlist_itemid: null } }))
                }
            },
            error: (err) => {
		        dispatch(callProductWishDetail({wishListLoader : false }));
                dispatch({
                    type: actionType.WISH_LIST_LOADER,
                    payload: { wishLoader: false}
                });
                dispatch(loadingSpinner({ loading: false }));
            }
        }

        API.removeWishList(data, cb)
    }

}

export const addToWishlist = payload => {
	return (dispatch,getState) => {
		const data = {
			customer_id: payload.customer_id,
			product_id: payload.product_id,
        };

        let { global } = store.getState();
        wishdata = {
			customerid: payload.customer_id,
			store_id: global.currentStore,
        };
        
        let message = wishdata.store_id === 2 ? ' Item has been Added To Wish List  ' : 'تم إضافة المنتج إلى قائمة الأمنيات'
        
        dispatch(loadingSpinner({ loading: true }));
		dispatch(callProductWishDetail({wishListLoader : true , removewishlist: '', addwishlist: '', wishListMessage : message }));

		let cb = {
			success: res => {
                dispatch(loadingSpinner({ loading: false }));
				if (res.status && res.code === 200) {
					dispatch(getWishlist({...wishdata}));
					dispatch(callProductWishDetail({wishListLoader : false, removewishlist: false, addwishlist: true, productWishDetail: { is_in_wishlist: res.is_in_wishlist, wishlist_itemid: res.wishlist_itemid,message: res.message, flage: true } }));
                } else {
					dispatch(callProductWishDetail({ addwishlist: true, removewishlist: false,  productWishDetail: { is_in_wishlist : '', wishlist_itemid: '',message: res.message, flage: false } }));
				}
			},
			error: err => {
		        dispatch(callProductWishDetail({wishListLoader : false }));
                dispatch(loadingSpinner({ loading: false }));
             },
		};
		API.addToWishlist(data, cb);
	};
};