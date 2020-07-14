import * as actionType from '../actionTypes';
import { API } from '../../api/api';


/////////////////////////////////GET WISHLIST////////////////////////////////////

const getCMSPageDetails = (payload) => {

    return {
        type: actionType.GET_DISCOVER_CMS,
        payload: payload
    };
}

export const getCMSPage = (payload) => {

    return (dispatch) => {
        dispatch(getCMSPageDetails({ staticPageLoader: true }))
        const data = {
        }
        let cb = {
            success: (res) => {
                dispatch(getCMSPageDetails({ staticPageLoader: false }))
                dispatch(getCMSPageDetails({ discover_more: res }))
            },
            error: (err) => {
                dispatch(getCMSPageDetails({ staticPageLoader: false }))
            }
        }

        API.getCMSPage(data, cb, payload.url_key)

    }

}