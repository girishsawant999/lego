import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import 'react-web-tabs/dist/react-web-tabs.css';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import Collapsible from 'react-collapsible';
import minIcon from '../../assets/images/minusIcon.png';
import PluIcon from '../../assets/images/PlusIcon.png';
import PlusIcon from '../../assets/images/icons/arrowDown.png';
import minusIcon from '../../assets/images/icons/arrowDown.png';
import paypal from '../../assets/images/icons/paypal.png';
import backarrow from '../../assets/images/leftArrow1.png';
import info from '../../assets/images/icons/info.png';
import processFinish from '../../assets/images/processFinish.png';
import 'bootstrap/dist/css/bootstrap.css';
import Ordersummary from '../checkOutProcess/checkOutProcessorderSummary';
import * as actions from "../../redux/actions/index";
import Spinner2 from "../Spinner/Spinner2";
import { PAY_FORT_URL } from '../../api/globalApi';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import { checkoutEvent } from '../utility/googleTagManager';

const wait = require('../../assets/images/wait.gif');
const Cryptr = require('cryptr');
let cryptr = null;
var _ = require('lodash');
let language = 'en';
let setDeliveryCalled = false;
let Ptype = "CC";
let notEdited = true;
let vouApply = false;
let isClickOnPlaceOrder = false;
let isMsgDisplayed = false;
class CheckoutPaymentMethod extends Component {
    toastId = null;
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            firstNameErr: false,
            lastNameErr: false,
            AptValue: '',
            streetValue: '',
            streetValueErr: false,
            companyName: '',
            zipCode: '',
            zipCodeErr: false,
            country: [],
            selectedCountry: 'SA',
            selectedCountryName: '',
            CityList: [],
            selectedCity: '',
            selectedCityName: '',
            useForBilling: false,
            addressSubmited: false,
            selectedSaveAddr: false,
            setSaveAddr: {},
            chanegeBillingAddr: false,
            voucode: '',
            termsAndCondition: false,
            errTermsAndCondition: ''
        }

        setDeliveryCalled = false;
        Ptype = "CC";
        vouApply = false;
    }

    applyVoucode = (voucode) => {
      if (voucode == '') {
         return;
      }

      notEdited = true;
      vouApply = true;
      this.props.onApplyVoucode({
         store: this.props.globals.currentStore,
         voucode: voucode.toUpperCase(),
         quoteid: this.props.myCart.quote_id,
      });
   }

    toastClosed = (e) => {
        this.toastId = null;
    }
   removeVoucode = (voucode) => {
      if (voucode == '') {
         return;
      }

      notEdited = false;
      vouApply = true;
      this.props.onRemoveVoucode({
         store: this.props.globals.currentStore,
         voucode: voucode.toUpperCase(),
         quoteid: this.props.myCart.quote_id,
      });

      this.setVoucher('');
   }

   setVoucher = (voucode) => {
      this.setState({
         voucode
      })
   }

   openVoucherSection = () => {
    setTimeout(() => {
        vouApply = false;
       let collapses = document.getElementsByClassName('is-closed');
       for (let i = 0 ; i < collapses.length ; i++) {
          collapses[i].click();
       }
    }, 200)
 }

    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.shipping ||  (nextProps.shipping && !nextProps.shipping.isShippingSet && !nextProps.shipping.defaultAddr
            && !nextProps.shipping.isClickAndCollect)) {
            this.props.history.push(`/${this.props.globals.store_locale}/cart`);
        } else if (this.props.myCart && (this.props.myCart.cart_count === 0 || !nextProps.myCart.is_payment_details_rec)) {
             this.props.history.push(`/${this.props.globals.store_locale}/cart`);
        }
    }

    componentDidMount = () => {
        language = this.props.globals.store_locale;
        if (!this.props.shipping ||  (this.props.shipping && !this.props.shipping.isShippingSet && !this.props.shipping.defaultAddr
             && !this.props.shipping.isClickAndCollect) || !this.props.myCart.is_payment_details_rec) {
           this.props.history.push(`/${this.props.globals.store_locale}/cart`);
        } else {
            let { shipping, country } = this.props;
            if (!shipping.isClickAndCollect) {
                this.onChangeCountryFirst(shipping.address_object.country_id, country.countryList,
                     shipping.address_object.region_id, shipping.address_object.state);
            }

            this.redirectToConfirm('payfort_fort_cc', 'CC');
        }

        let item = this.props.myCart.products;
        let productList = [];

        for (let i = 0; i < item.length; i++) {
            productList.push({
                name: item[i].product_name ? item[i].product_name : '',
                id: item[i].sku,
                price: item[i].special_price ? item[i].special_price : item[i].price,
                brand: 'Google',
                category: item[i].category_names,
                quantity: item[i].qty
            })
        }

        checkoutEvent({
            step: 3,
            product: productList
        });
    }

    onChangeCountryFirst(countryId, country, region_id, state) {
        let CountryName,CityList;
        if(countryId) {
            for(var i=0; i < country.length; i++){
                if( country[i] && countryId === country[i].id){
                    CountryName = country[i].full_name_english;
                    CityList = country[i].available_regions;
                }
            }

            this.setState({
                country: country,
                selectedCountry: countryId,
                selectedCountryName: CountryName,
                CityList: CityList,
                selectedCity: region_id,
                selectedCityName: state,
            });
        }

        this.forceUpdate();
    }

    firstNameChange = (e) => { 
        if ((e && e.target.value === '') || !e) {
            this.setState({
                firstName: '',
                firstNameErr: language === 'en' ? 'This is a required field' : 'This is a required field'
            });
        } else {
            this.setState({
                firstName: e.target.value,
                firstNameErr: ''
            });
        }

        this.forceUpdate();
    }

    lastNameChange = (e) => {
        if ((e && e.target.value === '') || !e) {
            this.setState({
                lastName: '',
                lastNameErr: language === 'en' ? 'This is a required field' : 'This is a required field'
            });
        } else {
            this.setState({
                lastName: e.target.value,
                lastNameErr: ''
            });
        }

        this.forceUpdate();
    }

    AptUpdate = (e) => {
        if (e && e.target) {
            this.setState({
                AptValue: e.target.value
            });
        }

        this.forceUpdate();
    }

    streetValueChange = (e) => {
        if ((e && e.target.value === '') || !e) {
            this.setState({
                streetValue: '',
                streetValueErr: language === 'en' ? 'This is a required field' : 'This is a required field'
            });
        } else {
            this.setState({
                streetValue: e.target.value,
                streetValueErr: ''
            });
        }

        this.forceUpdate();
    }

    comapnyNameChange = (e) => {
        if (e && e.target) {
            this.setState({
                companyName: e.target.value
            });
        }

        this.forceUpdate();
    }

    zipCodeChange = (e) => {
        if ((e && e.target.value === '') || !e) {
            this.setState({
                zipCode: e ? e.target.value : this.state.zipCode,
                zipCodeErr: language === 'en' ? 'This is a required field' : 'This is a required field'
            });
        } else {
            this.setState({
                zipCode: e.target.value,
                zipCodeErr: ''
            });
        }

        this.forceUpdate();
    }

    onChangeCountry(e, country) {
        let CountryName,CityList;
        if(e.target.value) {
            for(var i=0; i<country.length; i++){
                if( country[i] && e.target.value === country[i].id){
                    CountryName = country[i].full_name_english;
                    CityList = country[i].available_regions;
                }
            }

            this.setState({
                selectedCountry: e.target.value,
                selectedCountryName:CountryName,
                CityList: CityList,
                selectedCity:CityList[0].id,
                selectedCityName:CityList[0].name,
            });
        }
    }

    onChangeCity(e, city) {
        let cityname;
        if(e.target.value) {
            for(var i=0; i<city.length; i++){
                if( city[i] && e.target.value === city[i].id){
                    cityname = city[i].name;
                }
            }
            this.setState({
                selectedCity: e.target.value,
                selectedCityName: cityname,
            })
        }
    }

    closeOther = (value) => {
        let collapses = document.getElementsByClassName('open');
        for (let i = 0; i < collapses.length; i++) {
           collapses[i].click();
        }
    }

    editShiping = () => {
        this.props.history.push(`/${this.props.globals.store_locale}/shipping`);
    }

    editContact = () => {
        this.props.history.push(`/${this.props.globals.store_locale}/checkoutContactInfo`);
    }

    chanegeBilling = (shipping) => {
        //if (shipping && shipping.isShippingSet) {
            this.setState({
                firstName: shipping.fname,
                lastName: shipping.lname,
                firstNameErr: '',
                lastNameErr: '',
                AptValue: shipping.AptValue,
                streetValue: shipping.address_object.street,
                streetValueErr: '',
                companyName: shipping.companyName,
                zipCode: shipping.address_object.postcode,
                zipCodeErr: '',
                selectedCountry: shipping.address_object.country_id,
                selectedCountryName: shipping.address_object.state,
                selectedCity: shipping.address_object.region_id,
                selectedCityName: shipping.address_object.city,
                chanegeBillingAddr: true
            });

            this.props.setShippingSuccess({ shippingSuccess: false, shipping_code: '' });
    }

    isAllValueFilled = () => {
        const { firstNameErr, lastNameErr, streetValueErr, zipCodeErr } =  this.state;
        let errArr = {
            firstNameErr: firstNameErr,
            lastNameErr: lastNameErr,
            streetValueErr: streetValueErr,
            zipCodeErr: zipCodeErr
        };
        if (firstNameErr === '' && lastNameErr === '' && streetValueErr === '' && zipCodeErr === '') {
                return true;
        } else {
            for (var key in errArr) {
                if (errArr[key] === false) {
                    this.setState({
                        [key]: language === 'en' ? 'This is a required field' : 'This is a required field'
                    })
                }
            }

            return false
        }
    }

    onSubmit = () => {
        if (this.isAllValueFilled()) {
            const { globals, user_details, myCart, guest_user } = this.props;
            const { firstName, lastName, AptValue, streetValue, selectedCountryName, selectedCityName,
                companyName, zipCode, selectedCountry, selectedCity, useForBilling } = this.state;

            let customer_id='';
            let quote_id = "";
            let email = "";
            if (user_details.customer_details.quote_id) {
                customer_id = user_details.customer_details.customer_id
                quote_id = user_details.customer_details.quote_id;
                email = this.props.shipping.email
            } else if(guest_user.new_quote_id){
                quote_id = guest_user.new_quote_id;
            } else{
                quote_id="";
            }

            let billingData = {
                billingData: {
                    "store_id": globals.currentStore,
                    "quote_id": myCart.quote_id,
                    "fname": firstName,
                    "lname": lastName,
                    "email": email,
                    "cnumber": customer_id,
                    "mnumber": this.props.shipping.mnumber,
                    "address_id":"",
                    "shipping_code":"tablerate_bestway",
                    "lego_store_id": globals.currentStore,
                    "countryName": selectedCountryName,
                    "cityName": selectedCityName,
                    "AptValue": AptValue,
                    "companyName": companyName,
                    "address_object": {    
                        "userID": user_details.customer_id || "",
                        "userFirstName": firstName,
                        "userLastName": lastName,
                        "customer_email": email,
                        "country_id": selectedCountry,
                        "state": selectedCountryName,
                        "postcode": zipCode,
                        "region_id": selectedCity,
                        "carrier_code": this.props.shipping.carrier_code,
                        "city": selectedCityName,
                        "street": streetValue,
                        "telephone": this.props.shipping.mnumber,
                        "customer_address_type": "Home"  
                    },
    
                    "shipping" : "false",
                    "billing" : "true"
                }
            }

            setDeliveryCalled = true;
            
            this.props.setBillingDetails(billingData);
            this.props.setAddressFromShippingDetails(billingData.billingData);
            this.setState({
                addressSubmited: true,
                chanegeBillingAddr: false
            });
        }
    }

    redirectToConfirm = (payment_code, type) => {
        let { user_details, globals, guest_user, myCart, shippingSuccess, shipping } = this.props;
        let obj = myCart.payment_details;
        if (!isMsgDisplayed) {
            if (type === 'COD' && shipping.isClickAndCollect) {
                isMsgDisplayed =  true;
                this.toastId = toast((language === 'en' ?
                        'Pay with Card on Delivery cannot be selected for click and collect.' : 'لا يمكن أختيار الدفع عند الاستلام مع خدمة إضغط واستلم من المعرض'), {
                            className: css({
                                color: "red !important",
                                fontSize: "13.5px"
                            }),
        
                            onClose: this.toastClosed,
                            hideProgressBar: true,
                        });
    
                        setTimeout(() => {
                            isMsgDisplayed = false;
                        }, 6000);
            } else if (!(Object.entries(obj).length === 0) && shippingSuccess) {
                let quote_id = "";
                if (user_details.customer_details.quote_id) {
                    quote_id = user_details.customer_details.quote_id;
                } else if(guest_user.new_quote_id){
                    quote_id = guest_user.new_quote_id;
                } else{
                    quote_id="";
                }
                this.props.onSetPaymentDetails({
                    quote_id: quote_id,
                    store_id: globals.currentStore,
                    payment_code: payment_code
                });
    
                Ptype = type;
            }
        }
    }

    placeOrder = async () => {
        // if (this.state.setTermsAndCondition) {
            let { myCart, globals, user_details, guest_user } = this.props;
            let obj = myCart.order_details;
            isClickOnPlaceOrder = false
            // if (!((Object.entries(obj).length === 0) && (obj.constructor === Object))) {
                let quote_id = "";
                if (user_details.customer_details.quote_id) {
                    quote_id = user_details.customer_details.quote_id;
                } else if(guest_user.new_quote_id){
                    quote_id = guest_user.new_quote_id;
                } else{
                    quote_id="";
                }
                if (Ptype == "CC") {
                    await this.props.getPlaceOrder({
                        quote_id: quote_id,
                        store_id: globals.currentStore
                    });
                    isClickOnPlaceOrder = true;
                } else {
                    await this.props.OnplaceOrder({ store_id: globals.currentStore, quote_id: quote_id });
                }
        // } else {
        //     this.setState({
        //         errTermsAndCondition: true
        //     })
        // }
        // }
    }

    payFortPayment = () => {
        const { payfort_data } = this.props;

        fetch(PAY_FORT_URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payfort_data)
        });
    }

    setTermsAndCondition = () => {
        let setTermsAndCondition = !this.state.setTermsAndCondition;
        this.setState({
            setTermsAndCondition,
            errTermsAndCondition: false
        });
    }

    checkOutOfStock = (obj) => {
        let count = 0;
        obj.cart_details.products.map((item, index) => {
            if (item.is_in_stock) {
                if (item.is_in_stock.status == 0 && count == 0) {
                    this.props.OngetMyCart({
                        quote_id: this.props.user_details.customer_details.quote_id,
                        store_id: this.props.globals.currentStore
                    });

                    count++;
                    this.props.history.push(`/${this.props.globals.store_locale}/cart`);
                }
            }
        });
    }

    render() {
        const { shipping, billing, myCart, globals, payfort_data } = this.props;
        let { firstNameErr, firstName, lastName, lastNameErr, AptValue, streetValue, streetValueErr,
            companyName, zipCode, zipCodeErr, chanegeBillingAddr, termsAndCondition } = this.state;
        if (globals.loading) {
            return (
                <div className="mobMinHeight">
                    <Spinner2 />
                </div>
            )
        }

        let obj1 = this.props.myCart.order_details;

        if (!((Object.entries(obj1).length === 0) && (obj1.constructor === Object))) {
            this.checkOutOfStock(obj1);
        }

        if (myCart.voucher && this.state.voucode === '' && notEdited) {
           this.setVoucher(myCart.voucher);
           this.openVoucherSection(0);
        } else if (vouApply) {
            this.openVoucherSection(0);
        }

        // if (payfort_data && payfort_data.isPlaceOrderSuccess) {
        //     this.payFortPayment();
        // }

        let paymentData = null;
        if (payfort_data) {
            paymentData = Object.keys(payfort_data).map(function (key) {
                return <input name={key} id={`payfort_${key}`} value={payfort_data[key]} />
            });
        }

        if (payfort_data && isClickOnPlaceOrder && paymentData != null) {
            setTimeout(() => {
                if (document.getElementById("payfort_access_code").getAttribute("value") != "") {
                    document.getElementById('placeorderbycard').click();
                    isClickOnPlaceOrder = false;
                } else {
                    this.forceUpdate();
                }
            }, 1000);
        }

        const order_summ_obj = this.props.order_summary;
        if (myCart.is_order_placed && Ptype !== 'CC') {
            cryptr = new Cryptr("mihyarOrderId");
            if (!((Object.entries(order_summ_obj).length === 0) && (order_summ_obj.constructor === Object))) {
                return <Redirect to={`/${globals.store_locale}/order-summary?paytype=COD&order_id=${cryptr.encrypt(order_summ_obj.order_id)}`} />
            }
        }
        return (
            <div>
                <ToastContainer />
                <div className="checkoutPaymentMethod">
                    <div className="cart-grid">
                    <div className="container">
                        <div className="row">
                        <div className="col-md-8">

                            <div className="row">
                                <div className="col-md-12 mobPadding">
                                    <div className="StepContainerShipping">
                                        {/* End First Section */}
                                        <div className="step-section">
                                            <div className="StepBadge">
                                                <div className="editInfo">
                                                    <div className="greenIcon">
                                                        <div type="success">
                                                            <img src={processFinish} alt="fininsh" />
                                                        </div>
                                                        <span color="grey_medium" className="editInformation">
                                                        {!shipping.isClickAndCollect && <FormattedMessage id="checkoutpaymentMethod.Shipping" defaultMessage="Shipping" />}
                                                        {shipping.isClickAndCollect && <FormattedMessage id="checkoutContactInfo.ClicknCollect" defaultMessage="Click and Collect" />}
                                                        </span></div>
                                                    <button 
                                                    type="button"
                                                    onClick={() => this.editShiping()}
                                                    className="editOption"><FormattedMessage id="checkoutpaymentMethod.Edit" defaultMessage="Edit" /></button>
                                                </div>
                                            </div>

                                        </div>
                                        {/* End First Section */}
                                        <div className="step-section">
                                            <ul className="editGrid">
                                                {shipping.isShippingSet && <li className="editList">
                                                    <span color="grey">
                                                        <span className="smallTitle"><FormattedMessage id="checkoutContactInfo.ShippingAddress" defaultMessage="Shipping Address" /></span>
                                                    </span>
                                                    <span color="grey_dark">
                                                        <span className="bigDesc">
                                                        {`${shipping.fname} ${shipping.lname}
                                                        ${shipping.address_object.street} ${shipping.cityName} 
                                                        ${shipping.countryName} ${shipping.address_object.postcode}`}
                                                        </span>
                                                    </span>
                                                </li>}
                                                {shipping.defaultAddr && <li className="editList">
                                                    <span color="grey">
                                                        <span className="smallTitle"><FormattedMessage id="checkoutContactInfo.ShippingAddress" defaultMessage="Shipping Address" /></span>
                                                    </span>
                                                    <span color="grey_dark">
                                                        <span className="bigDesc">
                                                        {`${shipping.userFirstName ? shipping.userFirstName : ''} ${shipping.userLastName ? shipping.userLastName : ''} 
                                                                ${shipping.street ? shipping.street : ''}  ${shipping.city ? shipping.city : ''} 
                                                                ${shipping.state ? shipping.state : ''} ${shipping.postcode ? shipping.postcode : ''}`}
                                                        </span>
                                                    </span>
                                                </li>}
                                                {shipping.isClickAndCollect && <li className="editList">
                                                    <span color="grey">
                                                        <span className="smallTitle">
                                                            <FormattedMessage id="checkoutContactInfo.ClicknCollect" defaultMessage="Click and Collect" />
                                                        </span>
                                                    </span>
                                                    <span className="bigDesc">
                                                    {`${shipping.clickAndCollect.setClickAndCollectAddr.name}`}
                                                    <br />{`${shipping.clickAndCollect.setClickAndCollectAddr.address}`}
                                                    <br />{`${shipping.clickAndCollect.setClickAndCollectAddr.phone}`}
                                                    </span>
                                                </li>}
                                                <li className="editList">
                                                    <span color="grey">
                                                    <span className="smallTitle"><FormattedMessage id="checkoutpaymentMethod.ShippingMethod" defaultMessage="Shipping Method" /></span>
                                                    </span>
                                                    <span color="grey_dark">
                                                        <span className="bigDesc"><FormattedMessage id="checkoutpaymentMethod.Standardshipping" defaultMessage="Standard shipping" /></span>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="AddressWrapper">
                                            <div className="StepContainer">
                                                <div className="step-section">
                                                    <div className="StepBadge">
                                                        <div className="editInfo">
                                                            <div className="greenIcon">
                                                                <div type="success">
                                                                    <img src={processFinish} alt="fininsh" />
                                                                </div>
                                                                <span color="grey_medium" className="editInformation"><FormattedMessage id="checkoutpaymentMethod.Contactinformation" defaultMessage="Contact information" /></span></div>
                                                            <button 
                                                            type="button"
                                                            onClick={() => this.editContact()}
                                                            className="editOption"><FormattedMessage id="checkoutpaymentMethod.Edit" defaultMessage="Edit" /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="step-section">
                                                    <ul className="editGrid">
                                                        {(shipping.isShippingSet || shipping.defaultAddr || shipping.isClickAndCollect) && <li className="editList">
                                                            <span color="grey">
                                                                <span className="smallTitle"><FormattedMessage id="checkoutpaymentMethod.Email" defaultMessage="Email" /></span>
                                                            </span>
                                                            <span color="grey_dark">
                                                                <span className="bigDesc">
                                                                {shipping.isClickAndCollect ? shipping.clickAndCollect.email : shipping.email}
                                                                </span>
                                                            </span>
                                                        </li>}
                                                        
                                                        {(shipping.isShippingSet || shipping.defaultAddr || shipping.isClickAndCollect) &&<li className="editList">
                                                            <span color="grey">
                                                                <span className="smallTitle"><FormattedMessage id="checkoutpaymentMethod.Mobilenumber" defaultMessage="Mobile number" /></span>
                                                            </span>
                                                            <span color="grey_dark">
                                                                <span className="bigDesc">
                                                                {shipping.isClickAndCollect ? shipping.clickAndCollect.mnumber : shipping.mnumber}
                                                                </span>
                                                            </span>
                                                        </li>}
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="AddressWrapper">
                                            <div className="StepContainerShipping">
                                                <div className="step-section">

                                                    <div className="StepBadge">
                                                        <div type="disabled" className="StatusIconCircle">
                                                            <span color="grey_medium" className="StatusIconText"><FormattedMessage id="checkoutpaymentMethod.three" defaultMessage="3" /></span>
                                                        </div>
                                                        <span color="grey_medium" className="StatusTitle"><FormattedMessage id="checkoutpaymentMethod.Payment" defaultMessage="Payment" /></span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <hr />
                                                </div>
                                                <div className="step-section">

                                                    <div className="AddressWrapper findAddress">
                                                        <h3 className="step-title"><FormattedMessage id="checkoutpaymentMethod.VIPCode" defaultMessage="Do you have a Gift Card or Promo Code?" /></h3>
                                                        <div className="mob">
                                                            <div className="mobileShow">
                                                                <Collapsible trigger={ <div onClick={()=>
                                                                    this.closeOther(0)} className="Collapsible_text_container border-0">
                                                                    <div className="Collapsible_text footerHeading">
                                                                        <FormattedMessage id="checkoutpaymentMethod.VIPDiscountCode" defaultMessage="Promo Code" />
                                                                    </div>
                                                                    <div className="Collapsible_arrow_container">
                                                                        <img className="Icon" src={PlusIcon} alt="" />
                                                                    </div>
                                                            </div>
                                                            } triggerWhenOpen={
                                                            <div className="Collapsible_text_container open">
                                                                <div className="Collapsible_text footerHeading">
                                                                    <FormattedMessage id="checkoutpaymentMethod.VIPDiscountCode" defaultMessage="Promo Code" />
                                                                </div>
                                                                <div className="Collapsible_arrow_container">
                                                                    <img src={minusIcon} alt="" className="Icon" />
                                                                </div>
                                                            </div>
                                                            }>
                                                            <div style={{ textAlign: 'start' }}>
                                                                <div className="col-12">
                                                                    <div className="py-4">
                                                                        <span className="accordianMainTitle"><FormattedMessage id="checkoutpaymentMethod.discCode" defaultMessage="Got a Promo Code?" /></span>
                                                                        <p className="vipCode"><FormattedMessage id="checkoutpaymentMethod.VIPDiscCode" defaultMessage="Enter your Promo Code" /> </p>
                                                                    </div>
                                                                </div>
                                                                {/* <form className="pb-6"> */}
                                                                    <div className="styled-input pb-2 w-100">
                                                                        <div className="inputControl">
                                                                            <input type="text"
                                                                             onChange={(e) => {
                                                                                notEdited = false;
                                                                                 this.setState({ voucode: e.target.value }) }}
                                                                             value={this.state.voucode} />
                                                                            <label><FormattedMessage id="checkoutpaymentMethod.VIPDiscountCode" defaultMessage="Promo Code" /></label>
                                                                            {/* <div className="greenCheck">
                                                                                <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                                    <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                                </svg>
                                                                            </div> */}
                                                                            <span>
                                                                            </span>
                                                                        </div>
                                                                        {myCart.voucherSuccess && <div style={{color: 'green'}} className="inputControl">{myCart.voucherSuccess}</div>}
                                                                        {myCart.voucherError && <div style={{color: 'red'}} className="inputControl">{myCart.voucherError}</div>}
                                                                            
                                                                    </div>
                                                                    <div className="styled-input w-100 pb-5">
                                                                        <div className="inputControlmb-0">
                                                                        {myCart.discount_amount === 0 && (myCart.voucher_discount === 0 || !myCart.voucher_discount) &&
                                                                        <button 
                                                                            type="button"
                                                                            className="BaseButton"
                                                                            onClick={() => this.applyVoucode(this.state.voucode)}>
                                                                            <FormattedMessage id="checkoutpaymentMethod.Apply" defaultMessage="Apply" />
                                                                            </button>}
                                                                            {myCart.discount_amount !== 0 || myCart.voucher_discount> 0 &&
                                                                            <button kind="secondary" type="submit" className="BaseButton iJHjNV gcJclK" 
                                                                            onClick={() => this.removeVoucode(this.state.voucode)}><FormattedMessage id="checkoutpaymentMethod.Remove" defaultMessage="Remove" /></button>}
                                                                            {/*
                                                                            <div className="styles__ButtonFlexWrapper-rj3029-5 crELmO">
                                                                                <button className="anotherAdress">Can't see your address? Enter it manually</button>
                                                                            </div> */}
                                                                        </div>
                                                                    </div>

                                                                {/* </form> */}
                                                            </div>
                                                            </Collapsible>
                                                            {/* <Collapsible trigger={ <div onClick={()=>
                                                                this.closeOther(0)} className="Collapsible_text_container">
                                                                <div className="Collapsible_text footerHeading">
                                                                    <FormattedMessage id="checkoutpaymentMethod.PayGiftCard" defaultMessage="Pay with Gift Card" />
                                                                </div>
                                                                <div className="Collapsible_arrow_container">
                                                                    <img className="Icon" src={PlusIcon} alt="" />
                                                                </div>
                                                        </div>
                                                        } triggerWhenOpen={
                                                        <div className="Collapsible_text_container open">
                                                            <div className="Collapsible_text footerHeading">
                                                                <FormattedMessage id="checkoutpaymentMethod.PayGiftCard" defaultMessage="Pay with Gift Card" />
                                                            </div>
                                                            <div className="Collapsible_arrow_container">
                                                                <img src={minusIcon} alt="" className="Icon" />
                                                            </div>
                                                        </div>
                                                        }>
                                                        <div style={{ textAlign: 'start' }}>
                                                            <div className="col-12">
                                                                <div className="py-4">
                                                                    <span className="accordianMainTitle"><FormattedMessage id="checkoutpaymentMethod.GiftCardInformation" defaultMessage="Gift Card Information" /></span>
                                                                    <p className="vipCode"><FormattedMessage id="checkoutpaymentMethod.info" defaultMessage="If you have a Gift Card, enter it here. If you would like to redeem more than one Gift Card, enter each number separately and click 'Apply Gift Card'. You may apply up to 3 Gift Cards." /></p>
                                                                </div>
                                                            </div>
                                                            <form className="pb-6">
                                                                <div className="styled-input pb-4 w-100">
                                                                    <div className="inputControl">
                                                                        <input type="text" required />
                                                                        <label><FormattedMessage id="checkoutpaymentMethod.LEGOGiftCardNumber" defaultMessage="LEGO Gift Card Number" /></label>
                                                                        <div className="greenCheck">
                                                                            <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                                <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                            </svg>
                                                                        </div>
                                                                        <span></span>
                                                                    </div>
                                                                </div>
                                                                <div className="styled-input pb-4 w-50">
                                                                    <div className="inputControl">
                                                                        <input type="text" required />
                                                                        <label><FormattedMessage id="checkoutpaymentMethod.PINCode" defaultMessage="PIN Code" /></label>
                                                                        <div className="greenCheck">
                                                                            <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                                <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                            </svg>
                                                                        </div>
                                                                        <span></span>
                                                                    </div>
                                                                </div>
                                                                <div className="styled-input w-100 pb-5">
                                                                    <div className="inputControlmb-0">
                                                                        <button className="BaseButton"><FormattedMessage id="checkoutpaymentMethod.ApplyGiftCard" defaultMessage="Apply Gift Card" /></button>
                                                                        {/*
                                                                        <div className="styles__ButtonFlexWrapper-rj3029-5 crELmO">
                                                                            <button className="anotherAdress">Can't see your address? Enter it manually</button>
                                                                        </div> 
                                                                    </div>
                                                                </div>

                                                            </form>

                                                        </div>
                                                        </Collapsible> */}

                                                    </div>
                                                </div>

                                                <form className="mt-6">
                                                   {!chanegeBillingAddr && !shipping.isClickAndCollect && <div className="step-section">
                                                        <ul className="editGrid">
                                                            {shipping.isShippingSet && !billing && <li className="editList">
                                                                <span className="billingAddress"><FormattedMessage id="checkoutpaymentMethod.BillingAddress" defaultMessage="Billing Address" /></span>
                                                                <p color="grey_dark" className="billSectionEdit">
                                                                <span color="grey_dark">
                                                                    <span className="bigDesc">
                                                                    {`${_.upperFirst(shipping.fname)} ${_.upperFirst(shipping.lname)}
                                                                    ${_.upperFirst(shipping.address_object.street)} ${_.upperFirst(shipping.cityName)} 
                                                                    ${_.upperFirst(shipping.countryName)} ${shipping.address_object.postcode}`}
                                                                    </span>
                                                                </span>
                                                                </p>   
                                                                <button 
                                                                onClick={() => this.chanegeBilling(shipping)}
                                                                type="button" 
                                                                className="editchangeadd">
                                                                <FormattedMessage id="checkoutpaymentMethod.ChangeBilladdr" defaultMessage="Change Billing address" /></button>
                                                            </li>}
                                                            {shipping.defaultAddr && !billing && <li className="editList">
                                                                <span className="billingAddress"><FormattedMessage id="checkoutpaymentMethod.BillingAddress" defaultMessage="Billing Address" /></span>
                                                                <p color="grey_dark" className="billSectionEdit">
                                                                <span color="grey_dark">
                                                                <span className="bigDesc">
                                                                    {`${_.upperFirst(shipping.userFirstName)} ${_.upperFirst(shipping.userLastName)} 
                                                                    ${_.upperFirst(shipping.street)}  ${_.upperFirst(shipping.city)} 
                                                                    ${_.upperFirst(shipping.state)} ${shipping.postcode}`}
                                                                </span>
                                                                </span>
                                                                </p>   
                                                                <button
                                                                    onClick={() => this.chanegeBilling(shipping)}
                                                                 type="button" 
                                                                 className="editchangeadd">
                                                                 <FormattedMessage id="checkoutpaymentMethod.ChangeBilladdr" defaultMessage="Change Billing address" /></button>
                                                            </li>}
                                                            {billing && <li className="editList">
                                                                <span className="billingAddress"><FormattedMessage id="checkoutpaymentMethod.BillingAddress" defaultMessage="Billing Address" /></span>
                                                                <p color="grey_dark" className="billSectionEdit">
                                                                <span color="grey_dark">
                                                                <span className="bigDesc">
                                                                    {`${_.upperFirst(billing.fname)} ${_.upperFirst(billing.lname)}
                                                                    ${_.upperFirst(billing.address_object.street)} ${_.upperFirst(billing.cityName)} 
                                                                    ${_.upperFirst(billing.countryName)} ${billing.address_object.postcode}`}
                                                                    </span>
                                                                </span>
                                                                </p>   
                                                                <button
                                                                    onClick={() => this.chanegeBilling(billing)}
                                                                 type="button" 
                                                                 className="editchangeadd">
                                                                 <FormattedMessage id="checkoutpaymentMethod.ChangeBilladdr" defaultMessage="Change Billing address" /></button>
                                                            </li>}
                                                        </ul>
                                                    </div>}
                                                    
                                                    {chanegeBillingAddr && <div className="step-section">
                                                    
                                                    <div className="AddressWrapper">
                                                    <h3 className="step-title">
                                                    <FormattedMessage id="shipping.EnterBillingaddress" defaultMessage="Enter billing address" /></h3>
                                                    <form className="styles__FormWrapper-rj3029-0 lonvYJ">

                                                <div className="styled-input bUgSOh customField">
                                                        <div className="inputControl">
                                                            <input
                                                                onChange={(e) => this.firstNameChange(e)}
                                                                value={firstName}
                                                                type="text" />
                                                            <label><FormattedMessage id="shipping.FirstName" defaultMessage="First Name" /></label>
                                                            <div className="greenCheck">
                                                                {firstNameErr === '' && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                    <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                </svg>}
                                                                {firstNameErr && firstNameErr.length > 0 && <svg viewBox="0 0 17 17" width="17px" height="17px" className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo" data-di-res-id="a2f523df-4ed24860" data-di-rand="1587975551851">
                                                                    <path d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z" fill="currentColor" fill-rule="evenodd"></path>
                                                                </svg>}
                                                            </div>
                                                            <span class={firstNameErr === false ? "" : firstNameErr === '' ? "greenLine" : "redLine"}></span>
                                                            {firstNameErr && <p class="redValidaion">{firstNameErr}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="styled-input bUgSOh customField">
                                                        <div className="inputControl">
                                                            <input type="text"
                                                                value={lastName}
                                                                onChange={(e) => this.lastNameChange(e)} />
                                                            <label><FormattedMessage id="shipping.LastName" defaultMessage="Last Name" /></label>
                                                            <div className="redClose">
                                                                {lastNameErr === '' && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                    <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                </svg>}
                                                                {lastNameErr && lastNameErr.length > 0 && <svg viewBox="0 0 17 17" width="17px" height="17px" className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo" data-di-res-id="a2f523df-4ed24860" data-di-rand="1587975551851">
                                                                    <path d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z" fill="currentColor" fill-rule="evenodd"></path>
                                                                </svg>}
                                                            </div>
                                                            <span class={lastNameErr === false ? "" : lastNameErr === '' ? "greenLine" : "redLine"}></span>
                                                            {lastNameErr && <p class="redValidaion">{lastNameErr}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="styled-input bUgSOh customField">
                                                        <div className="inputControl">
                                                            <input
                                                                value={AptValue}
                                                                onChange={(e) => this.AptUpdate(e)}
                                                                type="text" />
                                                            <label><FormattedMessage id="shipping.Apt" defaultMessage="Apt / Suite (optional)" /></label>
                                                            <div className="greenCheck">
                                                            {AptValue && AptValue.length > 0 && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                    <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                </svg>}
                                                            </div>
                                                            {AptValue && AptValue.length > 0 && <span class="greenLine"></span>}
                                                             {/* <span class="redLine"></span> */}

                                                        </div>
                                                    </div>
                                                    <div className="styled-input bUgSOh customField">
                                                        <div className="inputControl">
                                                            <input type="text" 
                                                                value={streetValue}
                                                                onChange={(e) => this.streetValueChange(e)} />
                                                            <label><FormattedMessage id="shipping.Streetaddress" defaultMessage="Street address" /></label>
                                                            <div className="redClose">
                                                                {streetValueErr === '' && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                    <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                </svg>}
                                                                {streetValueErr && streetValueErr.length > 0 && <svg viewBox="0 0 17 17" width="17px" height="17px" className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo" data-di-res-id="a2f523df-4ed24860" data-di-rand="1587975551851">
                                                                    <path d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z" fill="currentColor" fill-rule="evenodd"></path>
                                                                </svg>}
                                                            </div>
                                                            <span class={streetValueErr === false ? "" : streetValueErr === '' ? "greenLine" : "redLine"}></span>
                                                            {streetValueErr && <p class="redValidaion">{streetValueErr}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="styled-input bUgSOh customField">
                                                        <div className="inputControl">
                                                            <input 
                                                                value={companyName}
                                                                onChange={(e) => this.comapnyNameChange(e) }
                                                                type="text" />
                                                            <label><FormattedMessage id="shipping.CompanyName" defaultMessage="Company Name (optional)" /></label>
                                                            <div className="greenCheck">
                                                            {companyName && companyName.length > 0 && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                    <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                </svg>}
                                                            </div>
                                                            {companyName && companyName.length > 0 && <span class="greenLine"></span>}
                                                        </div>
                                                    </div>
                                                    <div className="styled-input bUgSOh customField">
                                                        <div className="inputControl">
                                                        <div className="select-down"></div>
                                                            {this.state.country && <div className="">                                                               
                                                                <select name="select" id="select" className="is-touched is-pristine av-valid"
                                                                value={this.state.selectedCountry}
                                                                onChange={(e)=> this.onChangeCountry(e, this.state.country)}>
                                                                {this.state.country.map(c => {
                                                                    return(
                                                                        <option key={c.id} value={c.id}>{c.full_name_english}</option>
                                                                    )
                                                                })}
                                                                </select>
                                                                <span className="label-select"><FormattedMessage id="shipping.Country" defaultMessage="Country" /></span>
                                                                {/* <span className="Select__SelectedValue-sc-155k6kv-1 cvILin">Please select</span> */}
                                                            </div>}
                                                            
                                                        </div>
                                                    </div>
                                                    <div className="styled-input bUgSOh customField">
                                                        <div className="inputControl">
                                                        <div className="select-down"></div>
                                                        {this.state.country && <div className="">                                                               
                                                                <select 
                                                                onChange={(e)=> this.onChangeCity(e,this.state.CityList)}
                                                                name="select" 
                                                                id="select" 
                                                                className="is-touched is-pristine av-valid">
                                                                {this.state.CityList.map(c => {
                                                                    return(
                                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                                        )
                                                                    })}
                                                                </select>
                                                                <span className="label-select"><FormattedMessage id="shipping.State" defaultMessage="State" /></span>
                                                                {/* <span className="Select__SelectedValue-sc-155k6kv-1 cvILin">Please select</span> */}
                                                            </div>}
                                                            
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="styled-input bUgSOh customField">
                                                        <div className="inputControl">
                                                            <input 
                                                                value={zipCode}
                                                                onChange={(e) => this.zipCodeChange(e)}
                                                                type="number" />
                                                            <label><FormattedMessage id="shipping.Zipcode" defaultMessage="Zip code" /></label>
                                                            <div className="redClose">
                                                                {zipCodeErr === '' && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                    <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                </svg>}
                                                                {zipCodeErr && zipCodeErr.length > 0 && <svg viewBox="0 0 17 17" width="17px" height="17px" className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo" data-di-res-id="a2f523df-4ed24860" data-di-rand="1587975551851">
                                                                    <path d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z" fill="currentColor" fill-rule="evenodd"></path>
                                                                </svg>}
                                                            </div>
                                                            <span class={zipCodeErr === false ? "" : zipCodeErr === '' ? "greenLine" : "redLine"}></span>
                                                            {zipCodeErr && <p class="redValidaion">{zipCodeErr}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="styled-input bUgSOh customField w-100 mt-4">
                                                        <div className="SubmitAddress">
                                                        <button type="button" onClick={() => this.onSubmit()} className="dNUJxY"><FormattedMessage id="checkoutpaymentMethod.SubmitAddress" defaultMessage="Submit Address" /></button>
                                                        {/* {isDisabled && <button type="button" className="BaseButton">Submit Address</button>} */}
                                                        {/* <div className="styles__ButtonFlexWrapper-rj3029-5 crELmO">
                                                            <button className="anotherAdress">Search for another address</button>
                                                        </div> */}
                                                        </div>
                                                    </div>
                                                </form>
                                                </div>
                                                </div>}
                                                    <div className="container"> 
                                                    <div class="PaymentPage">                                                   
                                                        <div class="deliverTab">
                                                            <div class="react-tabs">
                                                                    <div class="borderTab">
                                                                        <ul class="react-tabs__tab-list" role="tablist">
                                                                            <li onClick={(e) => this.redirectToConfirm('payfort_fort_cc', 'CC')}
                                                                            class={(Ptype === 'CC' ? "react-tabs__tab--selected " : '') + "react-tabs__tab"}>
                                                                                <span class="title"><span><FormattedMessage id="checkoutpaymentMethod.PayByCard" defaultMessage="Pay By Card" /></span></span>
                                                                                <p><span><FormattedMessage id="checkoutpaymentMethod.youwilldirectedto" defaultMessage="You will be directed to mada, master and visa to complete payment and then returned to Mihyararabia" /></span></p>
                                                                            </li>
                                                                            <li onClick={(e) => this.redirectToConfirm('cashondelivery', 'COD')}
                                                                            class={(Ptype === 'COD' ? "react-tabs__tab--selected " : '') + "react-tabs__tab"}>
                                                                                <span class="title"><span><FormattedMessage id="checkoutpaymentMethod.Paywithcardondelivery" defaultMessage="Pay with card on delivery" /></span></span>
                                                                                <p><span><FormattedMessage id="checkoutpaymentMethod.Paywithcardondeliveryadditional" defaultMessage="Pay with card on delivery. Additional charge will be charged" /></span></p>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    {/* <div class="react-tabs__tab-panel react-tabs__tab-panel--selected">
                                                                        <div class="payByCardOuter">
                                                                            <div class="payByCard">
                                                                                <div class="row">
                                                                                    <div class="col-12">
                                                                                        <p class="totalOuter">
                                                                                            <b>
                                                                                                <span class="title"><span>Total</span></span> : 
                                                                                                {myCart.discount_amount === 0 ? 
                                                                                                <span>{` ${myCart.currency} ${myCart.grand_total}`}</span> :
                                                                                                <span class="totalAmount"><span class="line-through">{`${myCart.currency} ${myCart.grand_total}`} 
                                                                                                </span> {` ${myCart.currency} ${myCart.subtotal}`} </span>
                                                                                            }
                                                                                            </b>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <hr />
                                                                                <p class="agreeConditions">
                                                                                    <span>By Placing your order you agree to our</span><br />
                                                                                    <a href={`/${globals.store_locale}/privacy-policy`}><span>Privacy</span>&nbsp;&amp;&nbsp;<span>Cookie Policy</span></a>&nbsp;and <a href={`/${globals.store_locale}/terms-conditions`}><span>Terms and Conditions</span></a>.
                                                                                </p>
                                                                            </div>
                                                                            <div class="row btnOuter">
                                                                                <div class="col-6 col-md-6 btnOuterInner1">
                                                                                    <a href="">
                                                                                        <button class="continueShopping" type="button">
                                                                                            <span class="t-Button-label"><span>Continue Shopping</span></span>
                                                                                        </button>
                                                                                    </a>
                                                                                </div>
                                                                                <div class="col-6 col-md-6 btnOuterInner2">
                                                                                    <button class="proceed" type="button">
                                                                                        <span class="t-Button-label"><span>Proceed</span></span>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div> */}
                                                                    <div class="react-tabs__tab-panel"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* <div className="container">
                                                        <Tabs defaultTab="one" onChange={(tabId)=> { console.log(tabId) }} >
                                                            <TabList>
                                                                <Tab tabFor="one"><FormattedMessage id="checkoutpaymentMethod.CreditCard" defaultMessage="Credit Card" /></Tab>
                                                                <Tab tabFor="two2"><FormattedMessage id="checkoutpaymentMethod.PayPal" defaultMessage="PayPal" /></Tab>

                                                            </TabList>
                                                            <TabPanel tabId="one">
                                                                <div className="step-section">
                                                                    <div className="AddressWrapper">
                                                                        <div className="accordianForm">
                                                                        
                                                                            <div className="paypalGrid">
                                                                            <h3 className="paypalTitle"><FormattedMessage id="checkoutpaymentMethod.PaywithPayPal" defaultMessage="Pay with PayPal" /></h3>
                                                                            <p className="paypalDesc"><FormattedMessage id="checkoutpaymentMethod.Pay" defaultMessage="You'll be directed to PayPal to enter your payment details and then directed back to the LEGO Shop to confirm your order." /></p>
                                                                            <button className="paypal mb-4"><FormattedMessage id="checkoutpaymentMethod.Paywith" defaultMessage="Pay with" /> <img src={paypal} className="payIcon" alt="paypal" /> </button>
                                                                            </div>
                                                                            <form className="pb-6">
                                                                                <div className="inputControlmb-0 w-100">
                                                                                    <div className="inputControl">
                                                                                        <div className="select-down"></div>
                                                                                        <div className="">
                                                                                            <select name="select" id="select" className="is-touched is-pristine av-valid">
                                                                                                <option><FormattedMessage id="checkoutpaymentMethod.MasterCard" defaultMessage="MasterCard" /></option>
                                                                                                <option><FormattedMessage id="checkoutpaymentMethod.VISA" defaultMessage="VISA" /></option>
                                                                                                <option><FormattedMessage id="checkoutpaymentMethod.AMEX" defaultMessage="AMEX" /></option>
                                                                                                <option><FormattedMessage id="checkoutpaymentMethod.Discover" defaultMessage="Discover" /></option>
                                                                                            </select><span className="label-select"><FormattedMessage id="checkoutpaymentMethod.SelectCard" defaultMessage="Select Card" /></span></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="styled-input w-100">
                                                                                    <div className="inputControl">
                                                                                        <input type="text" required />
                                                                                        <label><FormattedMessage id="checkoutpaymentMethod.CardNumber" defaultMessage="Card Number" /></label>
                                                                                        <div className="greenCheck">
                                                                                            <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                                                <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                                            </svg>
                                                                                        </div>
                                                                                        <span></span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="inputControlmb-0 maxDesign w-50">
                                                                                    <div className="inputControl">
                                                                                        <div className="select-down"></div>
                                                                                        <div className="">
                                                                                            <select name="select" id="select" className="is-touched is-pristine av-valid">
                                                                                                <option>01</option>
                                                                                                <option>02</option>
                                                                                                <option>03</option>
                                                                                                <option>04</option>
                                                                                                <option>05</option>
                                                                                                <option>06</option>
                                                                                                <option>07</option>
                                                                                                <option>08</option>
                                                                                                <option>09</option>
                                                                                                <option>10</option>
                                                                                                <option>11</option>
                                                                                            </select><span className="label-select"><FormattedMessage id="checkoutpaymentMethod.ExpirationMonth" defaultMessage="Expiration Month" /></span></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="inputControlmb-0 maxDesign w-50">
                                                                                    <div className="inputControl">
                                                                                        <div className="select-down"></div>
                                                                                        <div className="">
                                                                                            <select name="select" id="select" className="is-touched is-pristine av-valid">
                                                                                                <option>20</option>
                                                                                                <option>21</option>
                                                                                                <option>22</option>
                                                                                                <option>23</option>
                                                                                                <option>24</option>
                                                                                                <option>25</option>
                                                                                                <option>26</option>
                                                                                                <option>27</option>
                                                                                                <option>28</option>
                                                                                                <option>29</option>
                                                                                            </select><span className="label-select"><FormattedMessage id="checkoutpaymentMethod.ExpirationYear" defaultMessage="Expiration Year" /></span></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="styled-input maxDesign w-50">
                                                                                    <div className="inputControl">
                                                                                        <input type="text" required />
                                                                                        <label><FormattedMessage id="checkoutpaymentMethod.SecurityCode" defaultMessage="Security Code" /></label>
                                                                                        <div className="greenCheck">
                                                                                            <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                                                <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                                            </svg>
                                                                                        </div>
                                                                                        <span></span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="styled-input maxDesign w-50">
                                                                                    <div className="inputControl">
                                                                                        <div className="cvv-icon"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TabPanel>
                                                            <TabPanel tabId="two2">
                                                                <p>Tab 2 content</p>
                                                            </TabPanel>

                                                        </Tabs>

                                                    </div> */}
                                                    {/* <div class="form-group onCheck mb-1 lastcheck">
                                                        <input 
                                                        onClick={() => this.setTermsAndCondition()}
                                                        value={termsAndCondition}
                                                        checked={termsAndCondition}
                                                        class="custCheck customcheckLast" id="tnc" type="checkbox" name="checkbox" />
                                                        <label for="tnc" class="pb-1 form-check-label w-75"> 
                                                        <FormattedMessage id="checkoutpaymentMethod.Iagree" defaultMessage="I agree to the &nbsp;&nbsp;" /> 
                                                                <a href={`/${globals.store_locale}/terms-conditions`} className="linkBlue" rel="noopener noreferrer" data-di-id="di-id-79f1c15e-b7f3aaff"><FormattedMessage id="checkoutpaymentMethod.tnc" defaultMessage="&nbsp;&nbsp;&nbsp;Terms and Conditions" /></a></label>
                                                    </div> */}

                                                    {/* <div className="styled-input bUgSOh w-100 customField">
                                                        <div className="inputControlmb-0">
                                                            <div className="checkboxcheck custom-checkbox mb-4">
                                                                <input type="checkbox" className="custom-control-input" id="p-type1" checked="" />
                                                                <label className="customControlLabel pl-3"><FormattedMessage id="checkoutpaymentMethod.Iagree" defaultMessage="I agree to the " /> 
                                                                <a href={`/${globals.store_locale}/terms-conditions`} className="linkBlue" rel="noopener noreferrer" data-di-id="di-id-79f1c15e-b7f3aaff"> <FormattedMessage id="checkoutpaymentMethod.tnc" defaultMessage="Terms and Conditions" /></a></label>
                                                            </div>
                                                            <span className="infoDescBig"><FormattedMessage id="checkoutpaymentMethod.infoagree" defaultMessage="When you agree to the terms and conditions, you also consent to our use of your personal information to process, deliver and support your order. We may also use your personal information to mail you a product catalog and gather feedback on our services. To see how to control your personal data, please see our privacy policy." /></span>
                                                        </div>
                                                    </div> */}

                                                    <div className="styled-input w-100">
                                                        <div className="inputControlmb-0">
                                                            {!isClickOnPlaceOrder && <button 
                                                            type="button"
                                                            onClick={() => this.placeOrder()}
                                                            className="BaseButton dNUJxY">
                                                            <FormattedMessage id="checkoutpaymentMethod.PlaceOrder" defaultMessage="Place Order" /></button>}
                                                            {/*
                                                            <div className="styles__ButtonFlexWrapper-rj3029-5 crELmO">
                                                                <button className="anotherAdress">Can't see your address? Enter it manually</button>
                                                            </div> */}

                                                            {isClickOnPlaceOrder && <button className="placeOreder BaseButton" type="button" disabled={true}>
                                                                <img src={wait} style={{ width: 25, height: 25, marginTop: -4 }} />
                                                                <span className="t-Button-label"><FormattedMessage id="checkoutpaymentMethod.Pleasewait" defaultMessage="Please wait......." /></span>
                                                            </button>}
                                                        </div>
                                                    </div>

                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            </div>
                            </div>      
                            <div className="col-md-4">
                                <Ordersummary Ptype={Ptype}/>
                            </div>
                            <div className="row">
                        <form
                            id="main-login"
                            onSubmit={() => this.payFortPayment}
                            // action= "https://checkout.payfort.com/FortAPI/paymentPage"
                            action={PAY_FORT_URL}
                            method='post'>
                            <div style={{ display: 'none' }}>
                                {paymentData}
                            </div>
                            <div className="col col-12 apex-col-auto" style={{ display: 'none' }}>
                                <button id="placeorderbycard" type="submit" className="t-Button t-Button--hot t-Button--stretch t-Button--gapTop ">
                                    <span className="t-Button-label">Place Order</span></button>
                            </div>
                        </form>
                    </div>
                        </div>
                    </div>
                    </div>
                </div>               
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		user_details: state.login,
        myCart: state.myCart,
        country: state.country,
        guest_user: state.guest_user,
        shipping: state.shipping,
        billing: state.shipping.billingData,
        shippingSuccess: state.myCart.shippingSuccess,
        order_summary: state.myCart.order_summary,
        payfort_data: state.myCart.payfort_data
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
        getPlaceOrder: (data) => dispatch(actions.getPlaceOrder(data)),
        OngetMyCart: (quoteId) => dispatch(actions.getMyCart(quoteId)),
        OnplaceOrder: (payload) => dispatch(actions.placeOrder(payload)),
        setBillingDetails: (payload) => dispatch(actions.setBillingDetails(payload)),
        setShippingSuccess: (payload) => dispatch(actions.setShippingSuccess(payload)),
        setAddressFromShippingDetails: (payload) => dispatch(actions.setAddressFromShippingDetails(payload)),
        onSetPaymentDetails: (payload) => dispatch(actions.setPaymentDetails(payload)),
        onApplyVoucode: (payload) => dispatch(actions.applyVoucode(payload)),
        onRemoveVoucode: (payload) => dispatch(actions.removeVoucode(payload))
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CheckoutPaymentMethod)));
