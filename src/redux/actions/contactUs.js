import * as actionType from '../actionTypes';
import { API } from '../../api/api';

const callActionContactUs = (payload) => {
    return {
        type: actionType.CONTACT_US,
        payload: payload
    };
}

export const setContactUsData = (payload) => {

    return (dispatch) => {
        const data = {
            ...payload,
        }
        dispatch(callActionContactUs({ contactUsDetails: {}, contactLoader : true}))
        let cb = {
            success: (res) => {
                if (res.status === true && res.code === 200) {
                    dispatch(callActionContactUs({ contactLoader : false}))
                    dispatch(callActionContactUs({ contactUsDetails: { ...res } }))
                } else {
                    dispatch(callActionContactUs({ contactLoader : false}))
                    dispatch(callActionContactUs({ contactUsDetails: { ...res } }))
                }
            },
            error: (err) => {
                dispatch(callActionContactUs({ contactLoader : false}))
            }
        }
        API.setContactUsData(data, cb)
    }

}

export const onclearContactUsProps=()=>{
    return(dispatch) =>{
        dispatch(callActionContactUs({ contactUsDetails: {} }))
    }
}