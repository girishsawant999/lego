import * as actionType from '../actionTypes';
import { API } from '../../api/api';

const callActionGetMenu = (payload) => {
    return {
        type: actionType.GET_MENU_DATA,
        payload: payload
    };
}

export const getMenu = (payload) => {
    return (dispatch) => {
        const data = {
            ...payload,
        }
        let cb = {
            success: (res) => {
                if (res.status === true && res.code === 200) {
                    dispatch(callActionGetMenu({
                        logoSlider : res.header_data,
                        menus: res.data
                    }));
                }
            },
            error: (err) => {
                dispatch(callActionGetMenu({
                    logoSlider : [],
                    menus: []
                }));
            }
        }
        API.getMenu(data, cb)
    }

}
