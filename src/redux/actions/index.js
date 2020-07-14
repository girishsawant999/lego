export { getStoreIds, loadingSpinner, storeRegion, setChangeStore, getHomePageData,getRecommendedData } from "./globals"
export { getCMSPage } from "./getCMS"
export { setContactUsData, onclearContactUsProps } from "./contactUs"
export { getStoreList, sortStoreList, getCountryList } from "./userAddress"
export { registerUser, loginUser, forgotPassword,logoutUser, resetPassword } from "./loginAccount"
export { getMenu } from "./menu"
export { getWishlist, addToWishlist, removeWishList } from './wishList';
export { getProductDetails, getReviewList, addReview } from './getProductDetails';
export { getOrderHistory, viewOrderDetails, clearState, orderJson } from "./ordersHistoryAndDetails"
export {
	getAccountPageData,
	deleteAddress,
	AddAddress,
	updateAccountInfoData,
	changePassword,
	getAddressBook,
} from "./myaccountInfo"
export { getPlpData,getSearchData, getAutoSuggestionProductSearchList } from './plp';
export { getGuestCartId ,guestAddToCart, startGuestCheckout, updateQuoteID} from "./guestUser"
export {
		getMyCart,
		getCartCount, 
		addToCart, 
		addToCartFromWishList, 
		clearWishListCartMessageState,
		changeQty,
		removeProduct,
		applyVoucode,
		removeVoucode,
		setOrderSummary
	} from "./getMyCart"
export {storeRememberData} from "./rememberme";
export { 
			getAddressFromShippingDetails, 
			setShippingDetails,
			setAddressFromShippingDetails,
			getPaymentDetails,
			setBillingDetails,
			setShippingSuccess
		} from "./shippingDetails";
export { 
		setPaymentDetails,
		placeOrder,
		getPlaceOrder
	 } from './paymentDetails';

export { referFriend } from "./referFriends";
export { notifyMe } from "./notifyMe";