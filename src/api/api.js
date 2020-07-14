import axios from "axios"
import { buildHeader, ipInfoHeader } from "./helpers"
import {
	live,
	BASE_URL,
	BASE_URL_1,
	TOKEN_URL,
	COUNTRY_URL,
	CART_URL,
	GUEST_CART_URL,
	STATIC_PAGES_URL,
	CUST_EDIT,
} from "../api/globalApi"
//App API's

const GET_DISCOVER_CMS_PAGE = { type: "GET", url: STATIC_PAGES_URL }
const SET_CONTACT_US_DATA = { type: "POST", url: BASE_URL + "setContactUsData" }
const GET_HOME_PAGE_DATA = { type: "GET", url: BASE_URL + "homepage" }
const GET_STORE_LIST = { type: "GET", url: BASE_URL + "storelocator/" }
const REGISTER_SAVE_U = { type: "POST", url: BASE_URL + "register/" }
const LOGIN_USER = { type: "POST", url: BASE_URL + "login/" }
const FORGOT_PASS = { type: "POST", url: BASE_URL + "forgotpassword/" }
const RESET_PASS = { type: "POST", url: BASE_URL + "resetpassword/" }

const GET_ORDER_HISTORY = { type: 'POST', url: BASE_URL + 'orderhistory/' };
const GET_ORDER_DETAILS_IN_PROFILE = { type: 'POST', url: BASE_URL + 'orderview/' };

const ADD_TO_REFERFRIEND = { type: 'POST', url: BASE_URL + 'referfriend/' };
const ADD_TO_WISHLIST = { type: 'POST', url: BASE_URL + 'addtowishlist/' };
const REMOVE_FROM_WISHLIST = { type: 'POST', url: BASE_URL + 'removewishlistitem/' };
const GET_WISHLIST_ITEM = { type: 'POST', url: BASE_URL + 'wishlistitems/' };
const GET_ACCOUNT_INFO = { type: "GET", url: BASE_URL_1 + "customers/" }
const DELETE_ADDRESS = { type: 'POST', url: BASE_URL + 'deleteaddress/' };
const ADD_ADDRESS = { type: "POST", url: BASE_URL + "addaddress/" }
const CHANGE_PASSWORD = { type: "POST", url: BASE_URL_1 + "customers/me/password" }
const GET_PRODUCT_DETAILS = { type: "GET", url: BASE_URL + "productbyid/" }
const ADDRESS_BOOK = { type: "POST", url: BASE_URL + "addressbook/" }
const GET_GUEST_CART_ID = { type: 'POST', url: GUEST_CART_URL + 'V1/guest-carts/' };
const GET_CART_COUNT = { type: "POST", url: BASE_URL + "cartcount/" }
const GET_MY_CART_API = { type: 'POST', url: BASE_URL + 'mycart/' };
const GET_RECOMENDED_DATA = { type: "GET", url: BASE_URL + "recommended" };
const GET_REVIEW_LIST = { type: "POST", url: BASE_URL + "reviewslist" };
const ADD_REVIEW = { type: "POST", url: BASE_URL + "addreview" }
const UPDATE_CART = { type: 'POST', url: BASE_URL + 'updatecart/' };
const DELETE_CART = { type: 'POST', url: BASE_URL + 'deletecart/' };
const SET_VOU_CODE = { type: 'POST', url: BASE_URL + 'checkvoucher' };
const REMOVE_VOU_CODE = { type: 'POST', url: BASE_URL + 'removevoucher' };
const GET_SHIPPING_TYPE = { type: 'POST', url: BASE_URL + 'getdelivery/' };
const GET_COUNTRY_LIST = { type: 'GET', url: COUNTRY_URL + 'countries/' };
const SET_DELIVERY_ADDRESS = { type: 'POST', url: BASE_URL+'setdelivery/'};
const GET_PAYMENT_DETAILS_CHECKOUT = { type: 'POST', url: BASE_URL + 'getpayment/' };
const SET_PAYMENT_DETAILS_CHECKOUT = { type: 'POST', url: BASE_URL + 'setPayment/' };
const PLACE_ORDER = { type: 'POST', url: BASE_URL + 'placeorder/' };
const GET_PLACE_ORDER = { type: 'POST', url: BASE_URL + 'placeorder/' };
const SET_ORDER_JSON = { type: 'POST', url: BASE_URL + 'OrderJson' };
const GET_SUMMARY_DATA = { type: 'POST', url: BASE_URL + 'OrderSummary/' };
const NOTIFY_ME = { type: 'POST', url: BASE_URL + 'notifyme/' }

export const API = {
	getCartCount: (data, cb) => request(data, cb, GET_CART_COUNT),
	addToCart: (data, cb) => {
		let ADD_TO_CARD_API = CART_URL + 'V1/carts/mine/items';
		request(data, cb, { type: 'POST', url: ADD_TO_CARD_API });
	},
	getGuestCartId: (data, cb) => request(data, cb, GET_GUEST_CART_ID),
	guestAddToCart: (data, cb) => {
		let GUEST_ADD_TO_CART_LINK = GUEST_CART_URL + '/V1/guest-carts/' + data.cart_item.quote_id + '/items';
		// request(data, cb, GUEST_ADD_TO_CART_LINK);
		request(data, cb, { type: 'POST', url: GUEST_ADD_TO_CART_LINK });
	},
	getMyCartApi: (data, cb) => request(data, cb, GET_MY_CART_API),
	updateCart: (data, cb) => request(data, cb, UPDATE_CART),
	deleteCart: (data, cb) => request(data, cb, DELETE_CART),

	getCMSPage: (data, cb, url_key) => {
		let GET_DISCOVER_CMS_PAGE_LINK = `${GET_DISCOVER_CMS_PAGE.url}${url_key}`
		request(data, cb, { type: "GET", url: GET_DISCOVER_CMS_PAGE_LINK })
	},
	getMenu: (data, cb) => {
		let GET_MENU_DATA = `${BASE_URL}menu?store=${data.store_id}`
		request({}, cb, { type: "GET", url: GET_MENU_DATA })
	},
	setContactUsData: (data, cb) => request(data, cb, SET_CONTACT_US_DATA),
	getHomePageData: (data, cb) => request(data, cb, GET_HOME_PAGE_DATA),
	getStoreList: (data, cb) => request(data, cb, GET_STORE_LIST),
	registerSave: (data, cb) => request(data, cb, REGISTER_SAVE_U),
	loginUser: (data, cb) => request(data, cb, LOGIN_USER),
	forgotPassword: (data, cb) => request(data, cb, FORGOT_PASS),
	resetpassword: (data, cb) => request(data, cb, RESET_PASS),

	getOrderHistory: (data, cb) => request(data, cb, GET_ORDER_HISTORY),
	getOrderDetailsInProfile: (data, cb) => request(data, cb, GET_ORDER_DETAILS_IN_PROFILE),

	addreferFriend: (data, cb) => request(data, cb, ADD_TO_REFERFRIEND),
	addToWishlist: (data, cb) => request(data, cb, ADD_TO_WISHLIST),
	getWishList: (data, cb) => request(data, cb, GET_WISHLIST_ITEM),
	removeWishList: (data, cb) => request(data, cb, REMOVE_FROM_WISHLIST),
	getAutoSuggestionProduct: (data, cb) => {
		let GET_PRODUCT_DETAILS = `${BASE_URL}searchautosuggest/?q=${data.q}&storeid=${data.storeId}`;
		request({}, cb, { type: 'GET', url: GET_PRODUCT_DETAILS });
	},
	getAccountPageData: (data, cb, url_key) => {
		let GET_ACCOUNT_INFO_LINK = `${GET_ACCOUNT_INFO.url}${url_key}`
		request(data, cb, { type: "GET", url: GET_ACCOUNT_INFO_LINK })
	},

	getPlpData: (data, cb) => {
		let GET_PLP_DATA = `${BASE_URL}productlisting/?url_key=${data.url_key}&storeid=${data.store_id}&page=${data.page}`
		request(data, cb, { type: "GET", url: GET_PLP_DATA })
	},
	searchResult: (data, cb) => {
		let SEARCH_RESULT = `${BASE_URL}searchresult/?q=${data.q}&storeid=${data.storeId}`
		request(data, cb, { type: "GET", url: SEARCH_RESULT })
	},

	deleteAddress: (data, cb) => request(data, cb, DELETE_ADDRESS),
	updateAccountInfo: (data, cb, url_key) => {
		let UPADATE_ACCOUNT_INFO = `${GET_ACCOUNT_INFO.url}${url_key.customer.id}`
		request(data, cb, { type: "PUT", url: UPADATE_ACCOUNT_INFO })
	},
	addAddress: (data, cb) => { 
		let ADD_ADDRESS = `${BASE_URL}addaddress?store_id=${data.store_id}`

		request(data, cb,  { type: "POST", url: ADD_ADDRESS }) 
	},
	changePassword: (data, cb,customerId) =>{
		const CHANGE_PASSWORD_KEY = { type: "PUT", url: BASE_URL_1 + "customers/me/password" +"?customerId="+customerId}
		request(data, cb, CHANGE_PASSWORD_KEY)} ,
	getAddressBook: (data, cb) => request(data, cb, ADDRESS_BOOK),
	getProductDetails: (data, cb) => request(data, cb, GET_PRODUCT_DETAILS),
	getRecommendedDataData: (data, cb) => request(data, cb, GET_RECOMENDED_DATA),
	getReviewsList: (data, cb) => request(data, cb, GET_REVIEW_LIST),
	addReview: (data, cb) => request(data, cb, ADD_REVIEW),
	applyVoucode: (data, cb) => request(data, cb, SET_VOU_CODE),
	removeVoucode: (data, cb) => request(data, cb, REMOVE_VOU_CODE),
	getShippingType: (data, cb) => request(data, cb, GET_SHIPPING_TYPE),
	getCountryList: (data, cb) => request(data, cb, GET_COUNTRY_LIST),
	setShippingType: (data, cb) => request(data, cb, SET_DELIVERY_ADDRESS),
	getPaymentDetails: (data, cb) => request(data, cb, GET_PAYMENT_DETAILS_CHECKOUT),
	setPaymentDetails: (data, cb) => request(data, cb, SET_PAYMENT_DETAILS_CHECKOUT),
	placeOrder: (data, cb) => request(data, cb, PLACE_ORDER),
	getPlaceOrder: (data, cb) => request(data, cb, GET_PLACE_ORDER),
	setOrderJson: (data, cb) => request(data, cb, SET_ORDER_JSON),
	getOrderSummary: (data, cb) => request(data, cb, GET_SUMMARY_DATA),
	notifyMe: (data,cb) => request(data, cb, NOTIFY_ME),
}

async function request(requestData, cb, featureURL, secureRequest = buildHeader(), urlData = '') {
	const url = featureURL.dynamic ? featureURL.url + '/' + requestData.storeId : featureURL.url;
	if (url === 'http://ipinfo.io/json') {
		secureRequest = ipInfoHeader();
	}

	// if (!live) {
	// 	console.groupCollapsed('API REQUEST');
	// 	console.groupEnd();
	// }
	try {
		let response;
		if (featureURL.type === 'GET') {
			response = await axios.get(url, {
				headers: secureRequest,
				params: requestData,
			});
		} else if ('POST|PATCH|PUT'.includes(featureURL.type)) {
			response = await axios[featureURL.type.toLocaleLowerCase()](url, requestData, {
				headers: secureRequest,
			});
		} else if ('DELETE'.includes(featureURL.type)) {
			response = await axios.create({ headers: secureRequest }).delete(url);
		}
		// if (!live) {
		// 	console.groupCollapsed('API RESPONSE');
		// 	console.groupEnd();
		// }
		if (cb.complete) cb.complete();
		if (response.status == 200) {
			cb.success(response.data);
		} else {
			cb.error(response.data);
		}
	} catch (error) {
		if (cb.complete) cb.complete();
		if (error.response) {
			cb.error(error.response.data);
		} else {
			cb.error(error);
		}
	}
}

function logout() {
	setTimeout(() => { }, 300);
}