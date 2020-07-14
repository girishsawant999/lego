import * as actionType from '../actionTypes';
import { updateObject } from '../utilityReducers';

const initialState = {
    orders_history: [],
    is_order_history_rec: false,
    is_order_details_rec: false,
    orders_details: {
        order_summary: {
            subtotal_incl_tax: '',
            discount_amount: '',
            shipping_amount: '',
            cod_charges: '',
            grand_total: '',
            tax_amount: '',
            order_status: '',
        },
        items_ordered: [],
        payment_method: '',
        shipping_type: '',
        shipping_address: {
            firstname: '',
            lastname: '',
            street: '',
            city: '',
            region: '',
            country_id: '',
            telephone: '',
        }
    },
    order_summary: {
        order_data: {
            address: {},
            order_summary: {},
            product_details: [],
            facebook_catnames: []
        }
    }

}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionType.GET_ORDER_HISTORY:
            return updateObject(state, action.payload)

        case actionType.ORDER_DETAILS_VIEW:
            return updateObject(state, action.payload)

        case actionType.CLEAR_STATE:
            return updateObject(state, action.payload)

        case actionType.SET_ORDER_SUMMARY_DATA:
            return updateObject(state, action.payload)

        default:
            return state;
    }

}

export default reducer