import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';

const initialState = {

    myCartTwoRec: false,
    addNewAddress: false,
    available_address: false,

    is_cart_details_rec: false,
    is_shipping_details_rec: false,
    is_payment_details_rec: false,
    is_order_conf_details_rec: false,
    is_order_placed: false,
    redirectToOrderConfirmation: false,

    cart_count: 0,
    quote_id: 0,
    subtotal: 0,
    subtotal_with_discount: 0,
    discount_amount: 0,
    grand_total: 0,

    payment_code: 'cashondelivery',
    delivery_type: null,

    products: [],
    addressData: [],

    shipping_details: {},
    payment_details: {},
    order_details: {},
    order_summary: {
        order_data: {
            address: {},
            order_summary: {},
            product_details: []
        }
    },

    loader: false,
    update_loader: false,
    orderDetailLoader: false,
    shippingSuccess: false,
    voucherMessage: '',
    my_cart_count:0,

    isPayfortFailed : false,
    saved_card_payfort_data : null,
    placeOrderFailed: false,
    placeOrderMessage: null,
    setPaymentFailed: false,
    setPaymentFailedMsg: null,
    payfortFailedMessage: null,
    payfortRestoreQuoteFailed: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_CART_COUNT:
            return updateObject(state,action.payload);

        case actionType.GET_ITEM_ADDED:
            return updateObject(state, action.payload)

        case actionType.GET_MY_CART:
            return updateObject(state, action.payload)

        case actionType.CLEAR_CART_ITEM:
            return updateObject(state, initialState)

        case actionType.CLEAR_WISHLIST_CART_MESSAGE:
            return updateObject(state,action.payload)

        case actionType.GET_ITEM_WISHLIST_ADDED:
            return updateObject(state,action.payload)

        case actionType.CHANGE_QTY:
            return updateObject(state, action.payload)

        case actionType.REMOVE_ITEM:
            return updateObject(state, action.payload)

        case actionType.QTY_UPDATE_LOADER:
            return updateObject(state, action.payload)

        case actionType.SET_VOU_CODE:
            return updateObject(state, action.payload)

        case actionType.GET_SHIPPING_TYPE:
            return updateObject(state, action.payload)
            
        case actionType.GET_SHIPPING_SUCCESS:
            return updateObject(state, action.payload)

        case actionType.GET_PAYMENT_CHECKOUT:
            return updateObject(state, action.payload)
        
        case actionType.SET_PAYMENT_CHECKOUT:
            return updateObject(state, action.payload)
            
        case actionType.PLACE_ORDER_CHECKOUT:
            return updateObject(state, action.payload)

        case actionType.GET_PLACE_ORDER:
            return updateObject(state, action.payload);

        case actionType.UPDATE_MYCART_QUOTE_ID:
            return updateObject(state, action.payload)
        
        case actionType.PAYFORT_FAILED:
                return updateObject(state, action.payload)

        default:
            return state;
    }
}

export default reducer