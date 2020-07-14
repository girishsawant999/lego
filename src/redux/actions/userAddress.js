import * as actionType from '../actionTypes';
import { API } from '../../api/api';
import { loadingSpinner } from './globals';

/////////////////////////////////GET STORE LIST////////////////////////////////////

const callActionGetStoreList= (payload) => {

    return {
        type: actionType.GET_STORE_LIST,
        payload: payload
    };
};

export const getStoreList = (payload) => {
    return dispatch => {
        const data = {
            country_id: payload.country_id,
            city: payload.city,
            store_id:payload.store_id
        }
        dispatch(callActionGetStoreList({ storeLoader:true }))
        let cb = {
            success: (res) => {

              let newState = {
                storeList : [...res.data],
                storeLoader:false
              }

                dispatch(callActionGetStoreList({ ...newState }))
            },
            error: (err) => {
                let newState = {
                    storeList : [],
                    storeLoader:false
                }

                dispatch(callActionGetStoreList({ ...newState }))
            }
        }

        API.getStoreList(data, cb)

    }

}

////////////////////////// SORT STORE LIST ////////////////////

export const sortStoreList = (payload) => {
 
    return {
        type: actionType.SORT_STORE_LIST,
        payload: { storeList: [...payload] }
    };
}


const callActionGetCountryList = (payload) => {
    return {
        type: actionType.GET_COUNTRIES,
        payload: payload
    };
};

export const getCountryList = (payload) => {

    return dispatch => {
        const data = {

        }
        dispatch(loadingSpinner({ loading: true }));
        let cb = {
            success: (res) => {
                let cList = res.filter((item, index) => {
                    if (item.hasOwnProperty('available_regions')) {
                        return item;
                    }
                });

                dispatch(callActionGetCountryList({ countryList: [...cList], isContryRec: true }))
                dispatch(loadingSpinner({ loading: false }));
            },
            error: (err) => {
                dispatch(loadingSpinner({ loading: false }));
            }
        }

        API.getCountryList(data, cb)
    }

}