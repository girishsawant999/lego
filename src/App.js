import React, { Suspense, Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
//import $ from 'jquery'
import { Beforeunload } from 'react-beforeunload'
// import * as actions from '../redux/actions/index'
// import { store } from '../redux/store/store';
// import Header from '../src/common/header/header';
//import Footer from '../src/common/footer/footer';
// import signIn from '../src/common/login/login';
// import signUp from '../src/common/login/register';
// import editProfile from '../src/common/login/editProfile';
// import forgotPassword from '../src/common/login/forgotPassword';
// import resetPassword from '../src/common/login/resetPassword';
// import forgotUser from '../src/common/login/forgotUser';
// import Home from '../src/components/HomeComponent/home';
// import storelocator from '../src/components/storeLocator/storeMain';
// import Plp from '../src/components/Plp/mainplp';
// import Pdp from '../src/components/pdp/mainPdp';
import { Route, Switch } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie';
import en from "react-intl/locale-data/en";
import ar from "react-intl/locale-data/ar"
import cookie from 'react-cookies';
// import Spinner from '../src/components/Spinner/Spinner'
import { IntlProvider, addLocaleData } from 'react-intl';
import localeData from '../src/config/libs/i18n/data.json'
import Axios from 'axios';
// import ThreeDViewDemo from './components/ProductDescriptionPage/ThreeDViewDemo';
// import Cartpage from '../src/components/checkOut/cart';
// import HoldingPage from '../src/components/holdingScreen/holding';
// import CheckOutProcess from '../src/components/checkOutProcess/checkoutprocess';
// import shipping from '../src/components/checkOutProcess/shipping';
// import checkoutContactInfo from '../src/components/checkOutProcess/checkoutContactInfo';
// import checkoutPaymentMethod from '../src/components/checkOutProcess/checkoutPaymentMethod';
import { CLONE_BASE_URL, API_TOKEN } from '../src/api/globalApi';
import * as actions from './redux/actions/index'
import { setChangeStore } from './redux/actions/globals'
import { logoutUser } from './redux/actions/loginAccount'
import { store } from './redux/store/store'
// import AboutUs from '../src/components/StaticPages/AboutUs/AboutUs';
// import PrivacyPolicy from '../src/components/StaticPages/PrivacyPolicy/PrivacyPolicy';
// import termEn from '../src/components/StaticPages/Term&Conditions/TermEn';
// import FaqEn from '../src/components/StaticPages/Faq/faqEn';
// import DeliveryEr from '../src/components/StaticPages/DeliveryInfo/deliveryEn';
// import ContactUs from './components/StaticPages/ContactUs/contact';
// import MyAccountInfo from '../src/components/Myaccount/myAccountInfo';
// import MyOrder from '../src/components/Myaccount/myOrder';
// import Profile from '../src/components/Myaccount/profile';
// import FourZeroFour from '..src/components/fourZeroFour/fourZeroFour';
// import MaintenancePage from '../src/components/fourZeroFour/maintenance';
// import Wishlist from '../src/components/Myaccount/wishlist';
// import OrderHistroy from '../src/components/Myaccount/OrderHistory';
// import Orderdetails from '../src/components/Myaccount/orderdetails';
// import Ordertracking from '../src/components/Myaccount/tracking';
// import OrderNumber from '../src/components/Myaccount/orderNumber';
// import ThankYou from '../src/components/Myaccount/thankYou';
// import Pdpp from '../src/components/mypdp/mypdp';
import { isMobile } from "react-device-detect"
import Spinner2 from "../src/components/Spinner/Spinner2"
// import ScrollToTop from '../components/HOC/ScrollToTop';
// // import StoreChangeLoader from './Spinner/StoreChangeLoader'
// import { setChangeStore } from '../redux/actions/globals';
// import { initialize } from './components/utility/googleAnalytis';
import { initializeGTM } from './components/utility/googleTagManager';
import { active_server } from './api/globalApi';
// import Header from '../src/common/header/header';
const Header = React.lazy(() => import('../src/common/header/header'))

const Footer = React.lazy(() => import('../src/common/footer/footer'))
const Pdpp = React.lazy(() => import('../src/components/mypdp/mypdp'))
const ThankYou = React.lazy(() => import('../src/components/Myaccount/thankYou'))
const OrderNumber = React.lazy(() => import('../src/components/Myaccount/orderNumber'))
const Ordertracking = React.lazy(() => import('../src/components/Myaccount/tracking'))
const Orderdetails = React.lazy(() => import('../src/components/Myaccount/orderdetails'))
const OrderHistroy = React.lazy(() => import('../src/components/Myaccount/OrderHistory'))
const Wishlist = React.lazy(() => import('../src/components/Myaccount/wishlist'))
const MaintenancePage = React.lazy(() => import('../src/components/fourZeroFour/maintenance'))
const FourZeroFour = React.lazy(() => import('../src/components/fourZeroFour/fourZeroFour'))
const Profile = React.lazy(() => import('../src/components/Myaccount/profile'))
const MyOrder = React.lazy(() => import('../src/components/Myaccount/myOrder'))
const MyAccountInfo = React.lazy(() => import('../src/components/Myaccount/myAccountInfo'))
const ContactUs = React.lazy(() => import('./components/StaticPages/ContactUs/contact'))
const DeliveryEr = React.lazy(() => import('../src/components/StaticPages/DeliveryInfo/deliveryEn'))
const FaqEn = React.lazy(() => import('../src/components/StaticPages/Faq/faqEn'))
const termEn = React.lazy(() => import('../src/components/StaticPages/Term&Conditions/TermEn'))
const PrivacyPolicy = React.lazy(() => import('../src/components/StaticPages/PrivacyPolicy/PrivacyPolicy'))
const AboutUs = React.lazy(() => import('../src/components/StaticPages/AboutUs/AboutUs'))
const checkoutPaymentMethod = React.lazy(() => import('../src/components/checkOutProcess/checkoutPaymentMethod'))
const checkoutContactInfo = React.lazy(() => import('../src/components/checkOutProcess/checkoutContactInfo'))
const shipping = React.lazy(() => import('../src/components/checkOutProcess/shipping'))
const CheckOutProcess = React.lazy(() => import('../src/components/checkOutProcess/checkoutprocess'))
const HoldingPage = React.lazy(() => import('../src/components/holdingScreen/holding'))
const Cartpage = React.lazy(() => import('../src/components/checkOut/cart'))
const ThreeDViewDemo = React.lazy(() => import('./components/ProductDescriptionPage/ThreeDViewDemo'))
const Spinner = React.lazy(() => import('../src/components/Spinner/Spinner'))
const Pdp = React.lazy(() => import('../src/components/pdp/mainPdp'))
const Plp = React.lazy(() => import('../src/components/Plp/mainplp'))
const storelocator = React.lazy(() => import('../src/components/storeLocator/storeMain'))
const Home = React.lazy(() => import('../src/components/HomeComponent/home'))
const forgotUser = React.lazy(() => import('../src/common/login/forgotUser'))
const resetPassword = React.lazy(() => import('../src/common/login/resetPassword'))
const forgotPassword = React.lazy(() => import('../src/common/login/forgotPassword'))
const editProfile = React.lazy(() => import('../src/common/login/editProfile'))
const signUp = React.lazy(() => import('../src/common/login/register'))
const signIn = React.lazy(() => import('../src/common/login/login'))
const paymentProcessing = React.lazy(() => import('../src/components/checkOutProcess/paymentProcessing'));
const saveCards = React.lazy(() => import('../src/components/Myaccount/saveCards'));

addLocaleData([...en, ...ar]);
let langLoader = null;
let isScroll = false;
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            language: 'ar',
            dir: 'rtl',
            changeData: false,
            store_id: '',
            toHome: false,
            selectedStore: '',
            isScroll: false
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
        if (lang === 'ar') {
            store_locale = 'ar'
        } else {
            store_locale = 'en'
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

        let storeId;
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
        let quote_id = "guest123"

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
            <Spinner2 />
        </div>);
        let country = "KSA"
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


    doLogoutOnRememberMeStatus = () => {

        let session = sessionStorage.getItem('ref');
        if (session == null) {
            if (store.getState().rememberme.rememberMeData && store.getState().rememberme.rememberMeData.isChecked === false) {
                store.dispatch(logoutUser())
            }
        }
        sessionStorage.setItem('ref', 1);

    }
    componentWillUnmount() {
        window.removeEventListener("load", this.doLogoutOnRememberMeStatus());
    }

    componentDidMount() {
        window.addEventListener("load", this.doLogoutOnRememberMeStatus());
        if (this.state.isScroll === false && isScroll === false) {
            window.addEventListener("scroll", () => {
                if (this.state.isScroll === false && isScroll === false) {
                    isScroll = true;
                    this.setState({
                        isScroll: true
                    })
                }
            });
        }
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
        const customStyle = isMobile ? { minHeight: '70vh' } : { margin: "auto", maxWidth: window.screen.width }
        this.handleDir(language);

        if (langLoader) {
            return (langLoader);
        }

        // if (active_server === 'qa' || active_server === "uat" || active_server === "live") {
        //  console.log = console.warn = console.error = () => { }
        //}
        return (
            <>
                <CookiesProvider>
                    <IntlProvider locale={language} messages={messages}>
                        <BrowserRouter>
                            <Suspense fallback={<div></div>}>
                                <Header handleLanguageSelection={this.handleLanguageSelection} />
                            </Suspense>
                            <div style={customStyle}>
                                <Suspense fallback={<div><Spinner2 /></div>}>
                                    <Switch>
                                        {/* <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route path="/home" component={Home} />
                                        {/* </Suspense> */}
                                        {/* <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/" component={Home} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/" component={Home} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/home" component={Home} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/storelocator" component={storelocator} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route path="/:locale(en|ar)/productlisting/:url_path" component={Plp} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route path="/:locale(en|ar)/product/search" component={Plp} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/three3dview" component={ThreeDViewDemo} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route path="/:locale(en|ar)/productdetails/:url_path" component={Pdp} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/cart" component={Cartpage} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/wishlist" component={Wishlist} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/checkoutprocess" component={CheckOutProcess} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/shipping" component={shipping} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/checkoutContactInfo" component={checkoutContactInfo} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/checkoutPaymentMethod" component={checkoutPaymentMethod} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route path="/:locale(en|ar)/login" component={signIn} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route path="/:locale(en|ar)/register" component={signUp} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/editProfile" component={editProfile} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/forgotPassword" component={forgotPassword} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route path="/:locale(en|ar)/password-rest" component={resetPassword} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/forgotUser" component={forgotUser} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/myaccount-info" component={MyAccountInfo} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/myOrder" component={MyOrder} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/profile" component={Profile} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/fourZeroFour" component={FourZeroFour} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/maintenance" component={MaintenancePage} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/order-status" component={OrderHistroy} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/order-details" component={Orderdetails} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}

                                        <Route exact path="/:locale(en|ar)/paymentProcessing" component={paymentProcessing} />

                                        <Route exact path="/:locale(en|ar)/spinner" component={Spinner} />
                                        {/* </Suspense>
                                    <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/order-tracking" component={Ordertracking} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route path="/:locale(en|ar)/order-number" component={OrderNumber} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route path="/:locale(en|ar)/order-summary" component={ThankYou} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/comming-soon" component={HoldingPage} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/aboutus" component={AboutUs} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/privacy-policy" component={PrivacyPolicy} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/terms-conditions" component={termEn} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/faq" component={FaqEn} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/delivery-information" component={DeliveryEr} />
                                        {/* </Suspense>
                                <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/contact-us" component={ContactUs} />
                                        {/* </Suspense> */}
                                        {/* <Suspense fallback={<div className="mobMinHeight">
                                    <Spinner2 />
                                </div>}> */}
                                        <Route exact path="/:locale(en|ar)/mypdp" component={Pdpp} />
                                        {/* </Suspense> */}
                                        {/* 404 page? */}
                                        {/* <Route component={PageNotFound} /> */}

                                        <Route exact path="/:locale(en|ar)/saveCards" component={saveCards} />
                                    </Switch>
                                </Suspense>
                            </div>
                            {isScroll && this.state.isScroll && <Suspense fallback={<div ></div>}>
                                <Footer />
                            </Suspense>}
                        </BrowserRouter>
                    </IntlProvider>
                </CookiesProvider>
            </>
        )
    }
}

export default App;
