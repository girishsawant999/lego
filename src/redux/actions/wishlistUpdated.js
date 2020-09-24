import * as actionType from "../actionTypes"
import { API } from "../../api/api"
import { store } from "../store/store"

const callActionGetWishlist = (payload) => {
	return {
		type: actionType.WISHLIST_UPDATED,
		payload: payload,
	}
}
export const getWishlistUpdated = (payload) => {
	return (dispatch) => {
		const data = {
			...payload,
		}
        dispatch(
			callActionGetWishlist({
				wishlistLoader: true,
				wishlistMessage: "",
				wishlistItemAdded: false,
				wishlistItemRemoved: false,
				wishlistLoadingProductId : null,
			})
		)
		let cb = {
			success: (res) => {
				dispatch(
					callActionGetWishlist({ wishlistProducts: res.data, wishlistCount: res.data.length, wishlistLoader: false })
				)
			},
			error: (err) => {
				dispatch(callActionGetWishlist({ wishlistLoader: false }))
			},
		}
		API.getWishList(data, cb)
	}
}

export const addToWishlistUpdated = (payload) => {
	return (dispatch, getState) => {
		const { global } = store.getState()
		const data = {
			customer_id: payload.customer_id,
			product_id: payload.product_id,
			store_id: global.currentStore,
		}
		let message =
			global.store_locale === "en" ? " Item has been Added To Wish List  " : "تم إضافة المنتج إلى قائمة الأمنيات"
        dispatch(
                callActionGetWishlist({
                    wishlistLoader: true,
                    wishlistMessage: "",
                    wishlistItemAdded: false,
					wishlistItemRemoved: false,
					wishlistLoadingProductId : payload.product_id,
                })
            )
		let cb = {
			success: (res) => {
				dispatch(
					callActionGetWishlist({
						wishlistProducts: res.data,
						wishlistCount: res.data.length,
						wishlistMessage: message,
						wishlistLoader: false,
						wishlistItemAdded: true,
						wishlistItemRemoved: false,
						wishlistLoadingProductId : null,
					})
				)
			},
			error: (err) => {
				dispatch(callActionGetWishlist({ wishlistLoader: false ,wishlistLoadingProductId : null,}))
			},
		}
		API.addToWishlist(data, cb)
	}
}

export const removeWishListUpdated = (payload) => {
	return (dispatch, getState) => {
		const data = {
			wishilistitemid: payload.wishilistitemid,
		}
		const { global, wishlistUpdated } = store.getState()
		let { wishlistProducts } = wishlistUpdated
		wishlistProducts = wishlistProducts.filter(item =>item.wishlist_id != data.wishilistitemid )
		let message =
			global.store_locale === "en" ? " Item has been removed from Wish List " : "تم إزالة المنتج من  قائمة الأمنيات"
		dispatch(
			callActionGetWishlist({
				wishlistLoader: true,
				wishlistMessage: "",
				wishlistItemAdded: false,
				wishlistItemRemoved: false,
				wishlistLoadingProductId : payload.product_id,
			})
		)
		let cb = {
			success: (res) => {
				dispatch(
					callActionGetWishlist({
						wishlistProducts: wishlistProducts,
						wishlistCount: wishlistProducts.length,
						wishlistMessage: message,
						wishlistLoader: false,
						wishlistItemAdded: false,
						wishlistItemRemoved: true,
						wishlistLoadingProductId : null,
					})
				)
			},
			error: (err) => {
				dispatch(callActionGetWishlist({ wishlistLoader: false, wishlistLoadingProductId : null, }))
			},
		}

		API.removeWishList(data, cb)
	}
}
