import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery'
import {Beforeunload} from 'react-beforeunload'
// import * as actions from '../redux/actions/index'
// import { store } from '../redux/store/store';
import Header from '../src/common/header/header';
import Footer from '../src/common/footer/footer';
import signIn from '../src/common/login/login';
import signUp from '../src/common/login/register';
import editProfile from '../src/common/login/editProfile';
import forgotPassword from '../src/common/login/forgotPassword';
import resetPassword from '../src/common/login/resetPassword';
import forgotUser from '../src/common/login/forgotUser';
import Home from '../src/components/HomeComponent/home';
import storelocator from '../src/components/storeLocator/storeMain';
import Plp from '../src/components/Plp/mainplp';
import Pdp from '../src/components/pdp/mainPdp';
import { Route, Switch } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie';
import en from "react-intl/locale-data/en";
import ar from "react-intl/locale-data/ar"
import cookie from 'react-cookies';
import Spinner from '../src/components/Spinner/Spinner'
import { IntlProvider, addLocaleData } from 'react-intl';
import localeData from '../src/config/libs/i18n/data.json'
import Axios from 'axios';
import ThreeDViewDemo from './components/ProductDescriptionPage/ThreeDViewDemo';
import Cartpage from '../src/components/checkOut/cart';
import HoldingPage from '../src/components/holdingScreen/holding';
import CheckOutProcess from '../src/components/checkOutProcess/checkoutprocess';
import shipping from '../src/components/checkOutProcess/shipping';
import checkoutContactInfo from '../src/components/checkOutProcess/checkoutContactInfo';
import checkoutPaymentMethod from '../src/components/checkOutProcess/checkoutPaymentMethod';
import { CLONE_BASE_URL, API_TOKEN } from '../src/api/globalApi';
import * as actions from './redux/actions/index'
import { setChangeStore } from './redux/actions/globals'
import {logoutUser} from './redux/actions/loginAccount'
import { store } from './redux/store/store'
import AboutUs from '../src/components/StaticPages/AboutUs/AboutUs';
import PrivacyPolicy from '../src/components/StaticPages/PrivacyPolicy/PrivacyPolicy';
import termEn from '../src/components/StaticPages/Term&Conditions/TermEn';
import FaqEn from '../src/components/StaticPages/Faq/faqEn';
import DeliveryEr from '../src/components/StaticPages/DeliveryInfo/deliveryEn';
import ContactUs from './components/StaticPages/ContactUs/contact';
import MyAccountInfo from '../src/components/Myaccount/myAccountInfo';
import MyOrder from '../src/components/Myaccount/myOrder';
import Profile from '../src/components/Myaccount/profile';
import FourZeroFour from '../src/components/fourZeroFour/fourZeroFour';
import MaintenancePage from '../src/components/fourZeroFour/maintenance';
import Wishlist from '../src/components/Myaccount/wishlist';
import OrderHistroy from '../src/components/Myaccount/OrderHistory';
import Orderdetails from '../src/components/Myaccount/orderdetails';
import Ordertracking from '../src/components/Myaccount/tracking';
import OrderNumber from '../src/components/Myaccount/orderNumber';
import ThankYou from '../src/components/Myaccount/thankYou';
import Pdpp from '../src/components/mypdp/mypdp';
import { isMobile } from "react-device-detect"
import Spinner2 from "../src/components/Spinner/Spinner2"
// import ScrollToTop from '../components/HOC/ScrollToTop';
// // import StoreChangeLoader from './Spinner/StoreChangeLoader'
// import { setChangeStore } from '../redux/actions/globals';
// import { initialize } from './components/utility/googleAnalytis';
import { initializeGTM } from './components/utility/googleTagManager';



addLocaleData([...en, ...ar]);
let langLoader = null;
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            language: 'ar',
            dir: 'rtl',
            changeData: false,
            store_id: '',
            toHome: false,
            selectedStore: ''
        }

        // initialize();
        // initializeGTM();
    }
    static getDerivedStateFromProps = (props, state) => {
        if (props.changeData) {
          
            let lang;
            //console.log('statechangeData', state.changeData);

            if (state.changeData) {
                lang = state.language;
                //console.log("true");
            }
            else {
                lang = props.selectedLang;
                //console.log("false");
            }

            //console.log("Lang", lang);

            let toHome = props.toHome;

            let dir = lang === 'en' ? 'ltr' : 'rtl';
            return { language: lang, dir: dir, toHome: toHome }
        }
        return null;
    }

    _changeStoreId = (store_id, quote_id, store_locale) => {
        const API = Axios.create({
            baseURL: CLONE_BASE_URL,
            headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" }
        });
        const reqdata = {
            store_id: store_id,
            quote_id: quote_id
        };

        if (window.location && window.location.search && window.location.search.includes('quote')) {
            const query = new URLSearchParams(window.location.search);
            if (!reqdata.quote_id && query.get("quote")) {
                reqdata.quote_id = query.get("quote");
            }
        }

        API.post('/Storechange', reqdata).then(res => {
            this._redirectWithLocale(store_locale);   // Change URL Location based on new Locale
        }).catch(err => {
            langLoader = false;
            this.forceUpdate();
        });
      // this._redirectWithLocale(store_locale);
        // const API = Axios.create({
        //     baseURL: CLONE_BASE_URL,
        //     headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" }
        // });

        // const reqdata = {
        //     store_id: store_id,
        //     quote_id: quote_id
        // };

        // API.post('/Storechange', reqdata).then(res => {

        //     this._redirectWithLocale(store_locale);   //Change URL Location based on new Locale
        // })

    }

    getStoreId = (country, lang) => {
     
        if (country === '' && country === null) {
            country = 'KSA';
            lang = 'ar'
        }
        let store_locale;
        if(lang==='ar'){
            store_locale='ar'
        }else{
            store_locale='en'
        }
        
        let store_data = country === 'KSA' ? country + "_" + lang : lang;
        // const API = Axios.create({
        //     baseURL: CLONE_BASE_URL,
        //     headers: { Authorization: `Bearer ${API_TOKEN}`, "Content-Type": "application/json" }
        // });

        // const reqdata = {
        //     store_data: store_data
        // };
        
        // API.get('/storeinfo', {
        //     params: {
        //         ...reqdata
        //     }
        // }).then(res => {
           
            let storeId ;
            if (!storeId) {
                if (lang === 'en') {
                    storeId = 2;
                } else if (lang === 'ar') {
                    storeId = 1;
                }
            }
            // localStorage.setItem('tempstoreid', storeId);
            // localStorage.setItem('templang', lang);

            // const days = 1000 * 60 * 60 * 24 * 14;
            // const expires = new Date()
            // expires.setDate(Date.now() + days)
            // const country_name = this.getCountryName(country);
            // const store_locale = lang;

            // cookie.save('storeid', storeId, { path: '/', expires, maxAge: days });
            // cookie.save('language', lang, { path: '/', expires, maxAge: days });
            // cookie.save('country', country, { path: '/', expires, maxAge: days });
            // cookie.save('country_name', country_name, { path: '/', expires, maxAge: days });
            // cookie.save('store_locale', store_locale, { path: '/', expires, maxAge: days });

            // localStorage.setItem('storeid', storeId);
            // localStorage.setItem('store_locale', store_locale);

            this.setState({ selectedStore: store_data, store_id: storeId, language: lang, changeData: true });
            store.dispatch(setChangeStore({ store_id: storeId, language: lang }));

         let { guest_user, login } = store.getState();
            let quote_id="guest123"

             if (login.customer_details.quote_id) {
                 quote_id = login.customer_details.quote_id;
             } else {
                 quote_id = (guest_user.new_quote_id) ? guest_user.new_quote_id : guest_user.temp_quote_id;
             }

            // quote_id = (guest_user.new_quote_id) ? guest_user.new_quote_id : guest_user.temp_quote_id;
            setTimeout(() => {
            this._changeStoreId(storeId, quote_id, store_locale);
                
            }, 1000);

    
    }

    _redirectWithLocale = (newLocale) => {
        
        const curr_pathname = window.location.pathname;
        let new_path = curr_pathname.split('/');
        let new_pathname;
        if (new_path.length > 0) {
            new_path[1] = newLocale;
            new_pathname = new_path.join('/');
            window.location.pathname = new_pathname;
        }

    }

    handleLangChangeByWithoutAPI = (language) => {
        if (language === 'ar') {
            this.setState({ language: language, dir: 'rtl' })
            this._redirectWithLocale('ar')
        } else {
            this.setState({ language: language, dir: 'ltr' })
            this._redirectWithLocale('en')
        }
    }

    handleLanguageSelection = (language) => {
        //console.log('In App Lang sel');
        langLoader = (<div >
            <Spinner2/>
        </div>);
        let country="KSA"
        //country = (cookie.load('country') === null) ? 'KSA' : cookie.load('country');

        // if (cookie.load('country') === undefined) {
        //     country = 'KSA';
        // } else {
        //     country = cookie.load('country');
        // }
        this.getStoreId(country, language);
        this.handleDir(language);
        //this.handleLangChangeByWithoutAPI(language)
    }

    // handleCountrySelection = (country) => {
    //     //console.log('In App country sel',country);

    //     let language;
    //     // language = (cookie.load('language') === null) ? 'ar' : cookie.load('language');
    //     if ((cookie.load('language') === null) || (cookie.load('language') === "undefined")) {
    //         language = 'en';
    //     } else {
    //         language = cookie.load('language');
    //     }

    //     this.getStoreId(country, language);
    //     this.handleDir(language);
    // }

    handleDir = (language) => {
       // cookie.save('langChange', language)
        if (language === 'ar') {
            document.getElementById("dir").classList.add("u-RTL");
            document.getElementById("dir").lang = 'ar';
            document.getElementById("dir").dir = 'rtl';
        } else {
            document.getElementById("dir").lang = 'en';
            document.getElementById("dir").classList.remove("u-RTL");
            document.getElementById("dir").removeAttribute('dir');
        }
    }

    getStoreLocale(storeid) {
        var str_lc;

        if (storeid === '1') {
            str_lc = 'en';
        } else if (storeid === '2') {
            str_lc = 'ar';
        }
        return str_lc;
    }

    getCountryName(country) {
        var country_name;

        switch (country) {
            case 'KSA':
                country_name = 'saudi';
                break;
            
            default:
                country_name = '';
        }
        return country_name;
    }
   
   
    doLogoutOnRememberMeStatus=()=>{
        
        let session = sessionStorage.getItem('ref');
        if (session == null) {
        if(  store.getState().rememberme.rememberMeData && store.getState().rememberme.rememberMeData.isChecked===false){
            store.dispatch(logoutUser())
        }
        }
        sessionStorage.setItem('ref', 1);  
        
    }
    componentWillUnmount(){
     window.removeEventListener("load", this.doLogoutOnRememberMeStatus());
    }
    
    componentDidMount() {
        window.addEventListener("load", this.doLogoutOnRememberMeStatus());
       
        let _storeId = localStorage.getItem('tempstoreid');
        // if (!localStorage.getItem('templang')) {
        //     localStorage.setItem('templang', 'en')
        // }
        // if (_storeId) {
        //     let templang = localStorage.getItem('templang');

        //      this.setState({ store_id: _storeId, language: templang, changeData: true });
        // }
        // else {
        //     localStorage.setItem('tempstoreid', 2);
        // }

        // _storeId = localStorage.getItem('tempstoreid');
        const curr_pathname = window.location.pathname;
        // if (curr_pathname.includes('/ar')) {
        //     this.handleLanguageSelection('ar');
        // }
        // else if ( curr_pathname.includes('/en')) {
        //     this.handleLanguageSelection('en');
        // }

    }

    render() {
        let current_pathname = window.location.pathname;
       // let new_path = current_pathname.split('/');
        // document.getElementById("dir").dir = this.state.dir;
        let { language } = store.getState().global;
        const messages = localeData[language] || localeData.en;
        //let dir = this.props.selectedLang === 'ar' ? 'rtl' : 'ltr';
        const customStyle = isMobile ? {minHeight:'70vh'} : {margin:"auto",maxWidth: window.screen.width}
        this.handleDir(language);
        
        if(langLoader) {
            return (langLoader);
        }
        return (
            <>
                <CookiesProvider>
                    <IntlProvider locale={language} messages={messages}>
                  
                        <BrowserRouter>
                            
                                <Header handleLanguageSelection={this.handleLanguageSelection} />
                                <div style={customStyle}>
                            <Switch>
                                <Route path="/home" component={Home} />
                                <Route exact path="/" component={Home} />
                                <Route exact path="/:locale(en|ar)/" component={Home} />
                                <Route exact path="/:locale(en|ar)/home" component={Home} />
                                <Route exact path="/:locale(en|ar)/storelocator" component={storelocator} />
                                <Route path="/:locale(en|ar)/productlisting/:url_path" component={Plp} />
                                <Route path="/:locale(en|ar)/product/search" component={Plp} />
                                <Route exact path="/:locale(en|ar)/three3dview" component={ThreeDViewDemo} />
                                <Route path="/:locale(en|ar)/productdetails/:url_path" component={Pdp} />
                                <Route exact path="/:locale(en|ar)/cart" component={Cartpage} />
                                <Route exact path="/:locale(en|ar)/wishlist" component={Wishlist} />
                                <Route exact path="/:locale(en|ar)/checkoutprocess" component={CheckOutProcess} />
                                <Route exact path="/:locale(en|ar)/shipping" component={shipping} />
                                <Route exact path="/:locale(en|ar)/checkoutContactInfo" component={checkoutContactInfo} />
                                <Route exact path="/:locale(en|ar)/checkoutPaymentMethod" component={checkoutPaymentMethod} />
                                <Route path="/:locale(en|ar)/login" component={signIn} />
                                <Route path="/:locale(en|ar)/register" component={signUp} />
                                <Route exact path="/:locale(en|ar)/editProfile" component={editProfile} />
                                <Route exact path="/:locale(en|ar)/forgotPassword" component={forgotPassword} />
                                <Route  path="/:locale(en|ar)/password-rest" component={resetPassword} />
                                <Route exact path="/:locale(en|ar)/forgotUser" component={forgotUser} />
                                <Route exact path="/:locale(en|ar)/myaccount-info" component={MyAccountInfo} />
                                <Route exact path="/:locale(en|ar)/myOrder" component={MyOrder} />
                                <Route exact path="/:locale(en|ar)/profile" component={Profile} />
                                <Route exact path="/:locale(en|ar)/fourZeroFour" component={FourZeroFour} />
                                <Route exact path="/:locale(en|ar)/maintenance" component={MaintenancePage} />
                                <Route exact path="/:locale(en|ar)/order-status" component={OrderHistroy} />
                                <Route exact path="/:locale(en|ar)/order-details" component={Orderdetails} />
                                <Route exact path="/:locale(en|ar)/spinner" component={Spinner} />
                                <Route exact path="/:locale(en|ar)/order-tracking" component={Ordertracking} />
                                <Route path="/:locale(en|ar)/order-number" component={OrderNumber} />
                                <Route path="/:locale(en|ar)/order-summary" component={ThankYou} /> 
                                <Route exact path="/:locale(en|ar)/comming-soon" component={HoldingPage} /> 
                                <Route exact path="/:locale(en|ar)/aboutus" component={AboutUs} />                               
                                <Route exact path="/:locale(en|ar)/privacy-policy" component={PrivacyPolicy} />                                
                                <Route exact path="/:locale(en|ar)/terms-conditions" component={termEn} />                               
                                <Route exact path="/:locale(en|ar)/faq" component={FaqEn} />                               
                                <Route exact path="/:locale(en|ar)/delivery-information" component={DeliveryEr} />                               
                                <Route exact path="/:locale(en|ar)/contact-us" component={ContactUs} />
                                <Route exact path="/:locale(en|ar)/mypdp" component={Pdpp} />
                                {/* 404 page? */}
                                {/* <Route component={PageNotFound} /> */}
                            </Switch>
                            </div>
                            <Footer />
                        </BrowserRouter>
                    </IntlProvider>
                </CookiesProvider>
            </>
        )
    }
}

export default App;
