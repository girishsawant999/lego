import * as actionType from '../actionTypes';
import { API } from '../../api/api';

export const callActionStoreRememberData=(payload)=>{
    
    return{
        type:actionType.REMEMBER_ME,
        payload:payload
    }
}

export const storeRememberData=(payload)=>{
    return dispatch=>{
        dispatch(callActionStoreRememberData({rememberMeData:{...payload}}))
    }
}
