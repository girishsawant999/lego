import * as actionType from '../actionTypes';
import { API } from '../../api/api';
import { ProductSearchEvent, ProductListEvent } from '../../components/utility/googleTagManager';

const callActionGetPlpData = (payload) => {
    return {
        type: actionType.GET_PLP_DATA,
        payload: payload
    };
}

const callActionPlpLoader = (payload) => {
    return {
        type: actionType.GET_PLP_LOADER,
        payload: payload
    };
}

export const getPlpData = (payload) => {

    return (dispatch,getState) => {
        const data = {
            ...payload,
        }
        let products = getState().plp.product;
        products = products && Object.values(products);
        if(payload.page === 1)
        dispatch(callActionPlpLoader({ PlpMessage:"", PlpLoader : true, category_name:"" ,searchWord:""}));
        else
        dispatch(callActionPlpLoader({ PlpMessage:"", PlpNextLoader : true, category_name:"" ,searchWord:"" }));
        let cb = {
            success: (res) => {
                if (res.status === true && res.code === 200 ) { // payload.page === 1
                    dispatch(callActionGetPlpData({ PlpData : res.data, product:res.data.product_data}));
                }
                else {
                    dispatch(callActionGetPlpData({ PlpData:"",  PlpMessage : res.message, category_name: res.breadcrumb[0].name }));
                }
				ProductListEvent(res.data);
                dispatch(callActionPlpLoader({ PlpLoader : false}));
            },
            error: (err) => {
                dispatch(callActionPlpLoader({ PlpNextLoader : false}));
                dispatch(callActionPlpLoader({ PlpLoader : false}));
            }
        }
        API.getPlpData(data, cb)
    }

}

const callActionSearch = (payload) => {
    return {
        type: actionType.SEARCH_RESULT,
        payload: payload
    };
}

export const getSearchData = (payload) => {
    return (dispatch,getState) => {
        const data = {
            ...payload,
        }
        let newState = payload.q
        dispatch(callActionSearch({searchLoader : true ,PlpData : {} ,product:{}, PlpMessage:''}))
        let cb = {
            success: (res) => {
                if(res.status) {
                    dispatch(callActionSearch({PlpData : res.data, product:res.data.product_data, searchWord: newState }))
                } else {
                    dispatch(callActionSearch({PlpData : res.data, product:res.data.product_data, searchWord: newState }))
                }
				ProductSearchEvent(res.data);
                dispatch(callActionSearch({searchLoader : false, searchWord: newState }))
            },
            error: (err) => {
                dispatch(callActionSearch({searchLoader : false, searchWord: newState }))
            }
        }
        API.searchResult(data, cb)
    }

}

export const callActionGetAutoSuggestionProductSearchList = payload => {
   
	return {
		type: actionType.GET_SUGGESTION_API,
		payload: payload,
	};
};



export const getAutoSuggestionProductSearchList = payload => {

	return dispatch => {
        const data = {
            q: payload.q,
            storeId:payload.storeId
        };
       
        let cb = {
            success: res => {
                if (res.status && res.code === 200) {
                    dispatch(callActionGetAutoSuggestionProductSearchList({ autoSerachsuggestionData: res }));
                }else{
                    dispatch(callActionGetAutoSuggestionProductSearchList({ autoSerachsuggestionData: res }));
                }
            },
            error: err => {
               
            },
        };
        API.getAutoSuggestionProduct(data, cb);
        };};
