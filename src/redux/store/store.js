
//redux
import { createStore, compose, combineReducers, applyMiddleware } from 'redux';

// Redux Persist
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import globalReducer from '../reducers/globalReducer';
import thunk from 'redux-thunk';
import contactUsReducer from '../reducers/contactUsReducer'
import loginAccountReducer from '../reducers/loginAccountReducer';
import MenuReducer from '../reducers/MenuReducer';
import orderHistoryReducer from '../reducers/orderHistoryReducer';
import myAccountInfoReducer from "../reducers/myAccountInfoReducer";
import GuestUserReducer from '../reducers/guestUserReducer';
import MyCartReducer from "../reducers/myCartReducer";
import plpReducer from "../reducers/plpReducer";
import productReducer from "../reducers/productReducer";
import remembermeReducer from "../reducers/rememberMeReducer";
import countryReducer from "../reducers/countryReducer";
import shippingReducer from "../reducers/shippingReducer";
import referFriendReducer from "../reducers/referFriendReducer";
import notifyReducer from "../reducers/notifyMeReducer";
import wishlistUpdated from "../reducers/wishlistReducerUpdated";
const AppRootReducer = combineReducers({
    plp:plpReducer,
    global: globalReducer,
    guest_user: GuestUserReducer,
    contactUsDetails: contactUsReducer,
    login: loginAccountReducer,
    menu: MenuReducer,
    orders: orderHistoryReducer,
    wishlistUpdated: wishlistUpdated,
    account: myAccountInfoReducer,
    myCart:MyCartReducer,
    product: productReducer,
    rememberme:remembermeReducer,
    country: countryReducer,
    shipping: shippingReducer,
    referfriend: referFriendReducer,
    notify: notifyReducer,
})

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_USER') {
        storage.removeItem('persist:root')
        if ((state !== null) && (state !== undefined)) {
            Object.keys(state).map((s) => {
                if ((s !== 'global') && (s !== 'menu')) {
                    state[s] = undefined;
                }
            })
        }
        //window.location.reload();
    }
    return AppRootReducer(state, action);
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['login', 'global','rememberme', 'static', 'guest_user'],
    stateReconciler: autoMergeLevel2,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));
