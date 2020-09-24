import 'bootstrap/dist/css/bootstrap.css';
import { css } from 'glamor';
import React, { Component, Suspense } from 'react';
import Collapsible from 'react-collapsible';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-web-tabs/dist/react-web-tabs.css';
import { PAY_FORT_URL } from '../../api/globalApi';
import './applepay.css'
import { APPLE_PAY_VERSION_NUMBER } from './ApplePayConfig/ApplePayConfig';
import { requestParamterForApplePaySession } from './ApplePayConfig/ApplePaySessionJson'
import Axios from 'axios';

import {
  default as minusIcon,
  default as PlusIcon,
} from '../../assets/images/icons/arrowDown.png';
import madacards from '../../assets/images/icons/output-onlinepngtools.png';
import processFinish from '../../assets/images/processFinish.png';
// import Ordersummary from '../checkOutProcess/checkOutProcessorderSummary';
import * as actions from '../../redux/actions/index';
import Spinner2 from '../Spinner/Spinner2';
import { checkoutEvent } from '../utility/googleTagManager';
import { createMetaTags } from '../utility/meta';
import $ from 'jquery';

const Ordersummary = React.lazy(() =>
  import('../checkOutProcess/checkOutProcessorderSummary')
);
const wait = require('../../assets/images/wait.gif');
const Cryptr = require('cryptr');
var Luhn = require('luhn-js');
let cryptr = null;
var _ = require('lodash');
let language = 'en';
let setDeliveryCalled = false;
let Ptype = 'CC';
let notEdited = true;
let vouApply = false;
let isClickOnPlaceOrder = false;
let isMsgDisplayed = false;
let scroll = true;
let payfortFailedMessage = null;

const BACKEND_URL_VALIDATE_SESSION = "https://lego-uat.iksulalive.com/"
const messages = defineMessages({
  card_holder_name: {
    id: 'paybycard.CardHoldersName',
    defaultMessage: "Card Holder's Name",
  },
  card_number: {
    id: 'paybycard.CardNumberPlaceholder',
    defaultMessage: 'Dabit/Credit Card Number',
  },
  card_security_code: {
    id: 'paybycard.CVV',
    defaultMessage: 'CVV',
  },
});

const isApplePayAvailable = true;

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
      errTermsAndCondition: '',

      card_holder_name: '',
      card_holder_name_valid: false,
      card_number: '',
      card_number_valid: false,
      expiry_date: '',
      expiry_date_valid: false,
      card_security_code: '',
      card_security_code_valid: false,
      card_type: null,
      save_card: false,

      card: null,
      otherCard: false,
      displayOtherCardTag: true,
    };

    setDeliveryCalled = false;
    Ptype = 'CC';
    vouApply = false;
  }

  componentWillMount() {
    scroll = true;

    if (window.$applePaySession) {
      if (window.$applePaySession.canMakePayments()) {
        isApplePayAvailable = true;
      }
    }
  }

  closeOther11 = (value) => {
    let collapses = document.getElementsByClassName('open');
    for (let i = 0; i < collapses.length; i++) {
      collapses[i].click();
    }
  };

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
  };

  toastClosed = (e) => {
    this.toastId = null;
  };
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
  };

  setVoucher = (voucode) => {
    this.setState({
      voucode,
    });
  };

  openVoucherSection = () => {
    setTimeout(() => {
      vouApply = false;
      let collapses = document.getElementsByClassName('is-closed');
      for (let i = 0; i < collapses.length; i++) {
        collapses[i].click();
      }
    }, 200);
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.myCart.placeOrderFailed) {
      this.props.history.push(`/${this.props.globals.store_locale}/cart`);
    }
    if (nextProps.myCart.setPaymentFailed) {
      this.props.history.push(`/${this.props.globals.store_locale}/cart`);
    }
    if (
      !nextProps.shipping ||
      (nextProps.shipping &&
        !nextProps.shipping.isShippingSet &&
        !nextProps.shipping.defaultAddr &&
        !nextProps.shipping.isClickAndCollect)
    ) {
      this.props.history.push(`/${this.props.globals.store_locale}/cart`);
    } else if (
      this.props.myCart &&
      (this.props.myCart.cart_count === 0 ||
        !nextProps.myCart.is_payment_details_rec)
    ) {
      if (!payfortFailedMessage) {
        this.props.history.push(`/${this.props.globals.store_locale}/cart`);
      }
    }
  };

  componentDidMount = () => {
    isClickOnPlaceOrder = false;
    payfortFailedMessage = null;
    if (
      this.props.location.state &&
      this.props.location.state.isPayfortFailed
    ) {
      payfortFailedMessage = this.props.location.state.message;
      setTimeout(() => {
        this.toastId = toast(payfortFailedMessage, {
          className: css({
            color: 'red !important',
            fontSize: '13.5px',
          }),

          onClose: this.toastClosed,
          hideProgressBar: true,
        });
      }, 300);

      this.props.history.replace(this.props.location.pathname, null);
    }
    language = this.props.globals.store_locale;
    if (
      !this.props.shipping ||
      (this.props.shipping &&
        !this.props.shipping.isShippingSet &&
        !this.props.shipping.defaultAddr &&
        !this.props.shipping.isClickAndCollect) ||
      !this.props.myCart.is_payment_details_rec
    ) {
      this.props.history.push(`/${this.props.globals.store_locale}/cart`);
    } else {
      let { shipping, country } = this.props;
      if (!shipping.isClickAndCollect) {
        this.onChangeCountryFirst(
          shipping.address_object.country_id,
          country.countryList,
          shipping.address_object.region_id,
          shipping.address_object.state
        );
      }

      this.redirectToConfirm('payfort_fort_cc', 'CC', false);
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
        quantity: item[i].qty,
      });
    }

    checkoutEvent({
      step: 3,
      product: productList,
    });
  };

  onChangeCountryFirst(countryId, country, region_id, state) {
    let CountryName, CityList;
    if (countryId) {
      for (var i = 0; i < country.length; i++) {
        if (country[i] && countryId === country[i].id) {
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
        firstNameErr:
          language === 'en'
            ? 'This is a required field'
            : 'This is a required field',
      });
    } else {
      this.setState({
        firstName: e.target.value,
        firstNameErr: '',
      });
    }

    this.forceUpdate();
  };

  lastNameChange = (e) => {
    if ((e && e.target.value === '') || !e) {
      this.setState({
        lastName: '',
        lastNameErr:
          language === 'en'
            ? 'This is a required field'
            : 'This is a required field',
      });
    } else {
      this.setState({
        lastName: e.target.value,
        lastNameErr: '',
      });
    }

    this.forceUpdate();
  };

  AptUpdate = (e) => {
    if (e && e.target) {
      this.setState({
        AptValue: e.target.value,
      });
    }

    this.forceUpdate();
  };

  streetValueChange = (e) => {
    if ((e && e.target.value === '') || !e) {
      this.setState({
        streetValue: '',
        streetValueErr:
          language === 'en'
            ? 'This is a required field'
            : 'This is a required field',
      });
    } else {
      this.setState({
        streetValue: e.target.value,
        streetValueErr: '',
      });
    }

    this.forceUpdate();
  };

  comapnyNameChange = (e) => {
    if (e && e.target) {
      this.setState({
        companyName: e.target.value,
      });
    }

    this.forceUpdate();
  };

  zipCodeChange = (e) => {
    if ((e && e.target.value === '') || !e) {
      this.setState({
        zipCode: e ? e.target.value : this.state.zipCode,
        zipCodeErr:
          language === 'en'
            ? 'This is a required field'
            : 'This is a required field',
      });
    } else {
      this.setState({
        zipCode: e.target.value,
        zipCodeErr: '',
      });
    }

    this.forceUpdate();
  };

  onChangeCountry(e, country) {
    let CountryName, CityList;
    if (e.target.value) {
      for (var i = 0; i < country.length; i++) {
        if (country[i] && e.target.value === country[i].id) {
          CountryName = country[i].full_name_english;
          CityList = country[i].available_regions;
        }
      }

      this.setState({
        selectedCountry: e.target.value,
        selectedCountryName: CountryName,
        CityList: CityList,
        selectedCity: CityList[0].id,
        selectedCityName: CityList[0].name,
      });
    }
  }

  onChangeCity(e, city) {
    let cityname;
    if (e.target.value) {
      for (var i = 0; i < city.length; i++) {
        if (city[i] && e.target.value === city[i].id) {
          cityname = city[i].name;
        }
      }
      this.setState({
        selectedCity: e.target.value,
        selectedCityName: cityname,
      });
    }
  }

  // Start Action on click on apple pay button
  //setp 1 create applePaySession Object

  onApplePayButtonClick = () => {
    this.startApplePaySession();

  }

  startApplePaySession = () => {
    console.log(window.$applePaySession, "window.ApplePaySession")
    var applePaySession = new window.$applePaySession(APPLE_PAY_VERSION_NUMBER, requestParamterForApplePaySession)
    console.log(applePaySession, 'in side the handle pay button ')

    applePaySession.begin();

    setTimeout(() => {
      this._handleApplePayEvents(applePaySession)

    }, 2000);
    console.log('after 2000 sec in side the handle pay button ')

  }




  _handleApplePayEvents = (appleSession) => {
    console.log(appleSession, 'in side the handle pay button ')

    appleSession.onvalidatemerchant = function (event) {
      console.log(event, 'event, in side the handle pay button ')

      this._validateApplePaySession(event.validationURL, function (merchantSession) {
        appleSession.completeMerchantValidation(merchantSession)
      })
    }
    //console.log(' withought in side the handle pay button ')

  }



  _validateApplePaySession = (appleUrl, callback) => {
    console.log('in side the validation pay session ')

    // I'm using AXIOS to do a POST request to the backend but any HTTP client can be used
    Axios.post(
      BACKEND_URL_VALIDATE_SESSION,
      {
        appleUrl
      },
      {
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    )
      .then((response) => {
        console.log(response, "response")
        callback(response.data)
      })
  }

  closeOther = (value) => {
    let collapses = document.getElementsByClassName('open');
    for (let i = 0; i < collapses.length; i++) {
      collapses[i].click();
    }
  };

  editShiping = () => {
    this.props.history.push(`/${this.props.globals.store_locale}/shipping`);
  };

  editContact = () => {
    this.props.history.push(
      `/${this.props.globals.store_locale}/checkoutContactInfo`
    );
  };

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
      chanegeBillingAddr: true,
    });

    this.props.setShippingSuccess({
      shippingSuccess: false,
      shipping_code: '',
    });
  };

  isAllValueFilled = () => {
    const {
      firstNameErr,
      lastNameErr,
      streetValueErr,
      zipCodeErr,
    } = this.state;
    let errArr = {
      firstNameErr: firstNameErr,
      lastNameErr: lastNameErr,
      streetValueErr: streetValueErr,
      zipCodeErr: zipCodeErr,
    };
    if (
      firstNameErr === '' &&
      lastNameErr === '' &&
      streetValueErr === '' &&
      zipCodeErr === ''
    ) {
      return true;
    } else {
      for (var key in errArr) {
        if (errArr[key] === false) {
          this.setState({
            [key]:
              language === 'en'
                ? 'This is a required field'
                : 'This is a required field',
          });
        }
      }

      return false;
    }
  };

  onSubmit = () => {
    if (this.isAllValueFilled()) {
      const { globals, user_details, myCart, guest_user } = this.props;
      const {
        firstName,
        lastName,
        AptValue,
        streetValue,
        selectedCountryName,
        selectedCityName,
        companyName,
        zipCode,
        selectedCountry,
        selectedCity,
        useForBilling,
      } = this.state;

      let customer_id = '';
      let quote_id = '';
      let email = '';
      if (user_details.customer_details.quote_id) {
        customer_id = user_details.customer_details.customer_id;
        quote_id = user_details.customer_details.quote_id;
        email = this.props.shipping.email;
      } else if (guest_user.new_quote_id) {
        quote_id = guest_user.new_quote_id;
      } else {
        quote_id = '';
      }

      let billingData = {
        billingData: {
          store_id: globals.currentStore,
          quote_id: myCart.quote_id,
          fname: firstName,
          lname: lastName,
          email: email,
          cnumber: customer_id,
          mnumber: this.props.shipping.mnumber,
          address_id: '',
          shipping_code: 'tablerate_bestway',
          lego_store_id: globals.currentStore,
          countryName: selectedCountryName,
          cityName: selectedCityName,
          AptValue: AptValue,
          companyName: companyName,
          address_object: {
            userID: user_details.customer_id || '',
            userFirstName: firstName,
            userLastName: lastName,
            customer_email: email,
            country_id: selectedCountry,
            state: selectedCountryName,
            postcode: zipCode,
            region_id: selectedCity,
            carrier_code: this.props.shipping.carrier_code,
            city: selectedCityName,
            street: streetValue,
            telephone: this.props.shipping.mnumber,
            customer_address_type: 'Home',
          },

          shipping: 'false',
          billing: 'true',
        },
      };

      setDeliveryCalled = true;

      this.props.setBillingDetails(billingData);
      this.props.setAddressFromShippingDetails(billingData.billingData);
      this.setState({
        addressSubmited: true,
        chanegeBillingAddr: false,
      });
    }
  };

  redirectToConfirm = (
    payment_code,
    type,
    clearPayfortFailedMessage = true
  ) => {
    if (clearPayfortFailedMessage) {
      payfortFailedMessage = null;
      this.forceUpdate();
    }
    let {
      user_details,
      globals,
      guest_user,
      myCart,
      shippingSuccess,
      shipping,
    } = this.props;
    let obj = myCart.payment_details;
    if (!isMsgDisplayed) {
      if (type === 'COD' && shipping.isClickAndCollect) {
        isMsgDisplayed = true;
        this.toastId = toast(
          language === 'en'
            ? 'Pay with Card on Delivery cannot be selected for click and collect.'
            : 'لا يمكن أختيار الدفع عند الاستلام مع خدمة إضغط واستلم من المعرض',
          {
            className: css({
              color: 'red !important',
              fontSize: '13.5px',
            }),

            onClose: this.toastClosed,
            hideProgressBar: true,
          }
        );

        setTimeout(() => {
          isMsgDisplayed = false;
        }, 6000);
      } else if (!(Object.entries(obj).length === 0) && shippingSuccess) {
        let quote_id = '';
        if (user_details.customer_details.quote_id) {
          quote_id = user_details.customer_details.quote_id;
        } else if (guest_user.new_quote_id) {
          quote_id = guest_user.new_quote_id;
        } else {
          quote_id = '';
        }
        this.props.onSetPaymentDetails({
          quote_id: quote_id,
          store_id: globals.currentStore,
          payment_code: payment_code,
        });

        Ptype = type;
      }
    }
  };

  placeOrder = async () => {
    // if (this.state.setTermsAndCondition) {
    let { myCart, globals, user_details, guest_user } = this.props;
    let obj = myCart.order_details;
    isClickOnPlaceOrder = false;
    // if (!((Object.entries(obj).length === 0) && (obj.constructor === Object))) {
    let quote_id = '';
    if (user_details.customer_details.quote_id) {
      quote_id = user_details.customer_details.quote_id;
    } else if (guest_user.new_quote_id) {
      quote_id = guest_user.new_quote_id;
    } else {
      quote_id = '';
    }
    if (Ptype == 'CC') {
      if (this.state.card) {
        const { card } = this.state;
        if (card.cvv && card.cvv.length === 3) {
          this.props.saveCardPlaceOrder({
            quote_id: quote_id,
            store_id: globals.currentStore,
            card: card,
          });
          this.props.history.push(
            `/${this.props.globals.store_locale}/paymentProcessing?step=PROCESSING`
          );
        } else {
          $('html, body').animate(
            {
              scrollTop:
                $('.bb-red').offset() && $('.bb-red').offset().top - 60,
            },
            500
          );
        }
      } else if (
        this.state.card_holder_name_valid &&
        this.state.card_number_valid &&
        this.state.card_security_code_valid &&
        this.state.expiry_date_valid
      ) {
        await this.props.getPlaceOrder({
          quote_id: quote_id,
          store_id: globals.currentStore,
          save_card: this.state.save_card,
        });
        isClickOnPlaceOrder = true;
      } else {
        $('html, body').animate(
          {
            scrollTop: $('.bb-red').offset() && $('.bb-red').offset().top - 60,
          },
          500
        );
      }
    } else {
      await this.props.OnplaceOrder({
        store_id: globals.currentStore,
        quote_id: quote_id,
      });
    }
    // } else {
    //     this.setState({
    //         errTermsAndCondition: true
    //     })
    // }
    // }
  };

  setTermsAndCondition = () => {
    let setTermsAndCondition = !this.state.setTermsAndCondition;
    this.setState({
      setTermsAndCondition,
      errTermsAndCondition: false,
    });
  };

  checkOutOfStock = (obj) => {
    let count = 0;
    obj.cart_details.products.map((item, index) => {
      if (item.is_in_stock) {
        if (item.is_in_stock.status == 0 && count == 0) {
          this.props.OngetMyCart({
            quote_id: this.props.user_details.customer_details.quote_id,
            store_id: this.props.globals.currentStore,
          });

          count++;
          this.props.history.push(`/${this.props.globals.store_locale}/cart`);
        }
      }
    });
  };

  onChangeHandlePayment = (e) => {
    const tempState = {};
    tempState[e.target.name] = e.target.value;
    this.setState(tempState);
    if (e.target.name === 'expiry_date') {
      if (e.target.value.length === 2 && this.state.expiry_date.length === 1) {
        e.target.value += '/';
      }
      if (
        e.target.value.length === 5 &&
        e.target.value.match(/^((0[1-9])|(1[0-2]))[/]*((1[9])|([2-9][0-9]))$/g)
      ) {
        const today = new Date();
        const tempDate = e.target.value.split('/');
        if (parseInt('20' + tempDate[1]) >= today.getFullYear()) {
          if (
            parseInt('20' + tempDate[1]) === today.getFullYear() &&
            parseInt(tempDate[0]) < today.getMonth() + 1
          ) {
            this.setState({ expiry_date_valid: false });
          } else {
            this.setState({ expiry_date_valid: true });
          }
        } else {
          this.setState({ expiry_date_valid: false });
        }
      } else {
        this.setState({ expiry_date_valid: false });
      }
    } else if (e.target.name === 'card_holder_name') {
      if (e.target.value.match(/^[A-Za-z ]+$/)) {
        this.setState({ card_holder_name_valid: true });
      } else {
        this.setState({ card_holder_name_valid: false });
      }
    } else if (e.target.name === 'card_number') {
      if (e.target.value.length > 16)
        e.target.value = e.target.value.substr(0, 16);
      const isVisa = e.target.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?)$/); // /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
      const isMasterCard = e.target.value.match(/^(?:5[1-5][0-9]{14})$/); // /^(?:5[1-5][0-9]{14})$/;
      const isMada = e.target.value.match(/^(?:529741{10})$/); // /^(?:529741{10})$/ //5297412542005689

      if (isVisa || isMada || isMasterCard) {
        if (Luhn.isValid(e.target.value)) {
          this.setState({ card_number_valid: true });
        }
      } else {
        this.setState({ card_number_valid: false });
      }

      switch (e.target.value.charAt(0)) {
        case '4':
          this.setState({ card_type: 'visa' });
          break;
        case '5':
          if (['529741'].includes(e.target.value.substr(0, 6)))
            this.setState({ card_type: 'mada' });
          else this.setState({ card_type: 'mastercard' });
          break;
        default:
          this.setState({ card_type: null });
      }
    } else if (e.target.name === 'card_security_code') {
      if (e.target.value.length >= 3) {
        this.setState({ card_security_code_valid: true });
      } else {
        this.setState({ card_security_code_valid: false });
      }
    }
  };

  onCardSelected = (card) => {
    this.setState({
      card: card,
      otherCard: false,
      card_holder_name: '',
      card_holder_name_valid: false,
      card_number: '',
      card_number_valid: false,
      expiry_date: '',
      expiry_date_valid: false,
      card_security_code: '',
      card_security_code_valid: false,
      card_type: null,
      save_card: false,
    });
  };

  onOtherCardSelected = () => {
    this.setState({
      card: null,
      otherCard: true,
      card_holder_name: '',
      card_holder_name_valid: false,
      card_number: '',
      card_number_valid: false,
      expiry_date: '',
      expiry_date_valid: false,
      card_security_code: '',
      card_security_code_valid: false,
      card_type: null,
      save_card: false,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (scroll && $('.StatusIconCircle').offset()) {
      scroll = false;
      $('html, body').animate(
        {
          scrollTop: $('.StatusIconCircle').offset().top - 60,
        },
        500
      );
    }
  }

  checkCardType = (num) => {
    switch (num.charAt(0)) {
      case '4':
        return 'visa';
      case '5':
        if (['529741'].includes(num.substr(0, 6))) return 'mada';
        else return 'mastercard';
      default:
        return '';
    }
  };

  render() {
    const { shipping, billing, myCart, globals, payfort_data } = this.props;
    const { formatMessage } = this.props.intl;

    let {
      firstNameErr,
      firstName,
      lastName,
      lastNameErr,
      AptValue,
      streetValue,
      streetValueErr,
      companyName,
      zipCode,
      zipCodeErr,
      chanegeBillingAddr,
      termsAndCondition,
    } = this.state;
    if (globals.loading) {
      return (
        <div className="mobMinHeight">
          <Spinner2 />
        </div>
      );
    }

    let obj1 = this.props.myCart.order_details;

    if (!(Object.entries(obj1).length === 0 && obj1.constructor === Object)) {
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
    const params = [
      'merchant_identifier',
      'access_code',
      'merchant_reference',
      'service_command',
      'language',
      'return_url',
      'signature',
      'card_holder_name',
      'card_number',
      'expiry_date',
      'card_security_code',
    ];
    let finalPayfortData = payfort_data;
    if (this.state.otherCard && finalPayfortData) {
      finalPayfortData = {
        ...finalPayfortData,
        card_holder_name: this.state.card_holder_name,
        card_number: this.state.card_number,
        expiry_date: this.state.expiry_date.split('/').reverse().join(''),
        card_security_code: this.state.card_security_code,
      };
      paymentData = Object.keys(finalPayfortData).map((key) => {
        if (params.includes(key)) {
          return (
            <input
              name={key}
              id={`payfort_${key}`}
              value={finalPayfortData[key]}
            />
          );
        }
      });
    }

    if (
      this.state.otherCard &&
      finalPayfortData &&
      isClickOnPlaceOrder &&
      paymentData != null
    ) {
      setTimeout(() => {
        if (
          document
            .getElementById('payfort_access_code')
            .getAttribute('value') != ''
        ) {
          document.getElementById('placeorderbycard').click();
          isClickOnPlaceOrder = false;
          this.props.history.push(
            `/${this.props.globals.store_locale}/paymentProcessing?step=PROCESSING`
          );
        } else {
          this.forceUpdate();
        }
      }, 1000);
    }

    const order_summ_obj = this.props.order_summary;
    if (myCart.is_order_placed && Ptype !== 'CC') {
      cryptr = new Cryptr('mihyarOrderId');
      if (
        !(
          Object.entries(order_summ_obj).length === 0 &&
          order_summ_obj.constructor === Object
        )
      ) {
        return (
          <Redirect
            to={`/${globals.store_locale
              }/order-summary?paytype=COD&order_id=${cryptr.encrypt(
                order_summ_obj.order_id
              )}`}
          />
        );
      }
    }

    if (
      !this.state.otherCard &&
      myCart.payment_details &&
      myCart.payment_details.payfort_fort_cc &&
      myCart.payment_details.payfort_fort_cc.cards &&
      myCart.payment_details.payfort_fort_cc.cards.length === 0
    ) {
      this.setState({
        otherCard: true,
        card: null,
        displayOtherCardTag: false,
      });
    }

    return (
      <Suspense fallback={<div></div>}>
        <div>
          {createMetaTags(
            this.props.globals.store_locale === 'en'
              ? 'Payment | Official LEGO® Online Check Saudi Arabia'
              : 'الدفع | متجر ليغو أونلاين الرسمي بالسعودية ',
            this.props.globals.store_locale === 'en'
              ? 'Explore the world of LEGO® through games, videos, products and more! Shop awesome LEGO® building toys and brick sets and find the perfect gift for your kid'
              : 'اكتشف عالم ليغو LEGO من خلال الألعاب، والفيديوهات، والمنتجات وأكثر! تسوق مجموعات ألعاب البناء و المكعبات المدهشة من ليغو LEGO واعثر على الهدية المثالية لطفلك',
            this.props.globals.store_locale === 'en'
              ? 'LEGO, Online Store, Saudi Arabia, Bricks, Building Blocks, Construction Toys, Gifts'
              : 'ليغو LEGO، تسوق اونلاين، السعودية، مكعبات، مكعبات بناء، العاب تركيب، هدايا'
          )}
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
                                  <span
                                    color="grey_medium"
                                    className="editInformation">
                                    {!shipping.isClickAndCollect && (
                                      <FormattedMessage
                                        id="checkoutpaymentMethod.Shipping"
                                        defaultMessage="Shipping"
                                      />
                                    )}
                                    {shipping.isClickAndCollect && (
                                      <FormattedMessage
                                        id="checkoutContactInfo.ClicknCollect"
                                        defaultMessage="Click and Collect"
                                      />
                                    )}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => this.editShiping()}
                                  className="editOption">
                                  <FormattedMessage
                                    id="checkoutpaymentMethod.Edit"
                                    defaultMessage="Edit"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* End First Section */}
                          <div className="step-section">
                            <ul className="editGrid">
                              {shipping.isShippingSet && (
                                <li className="editList">
                                  <span color="grey">
                                    <span className="smallTitle">
                                      <FormattedMessage
                                        id="checkoutContactInfo.ShippingAddress"
                                        defaultMessage="Shipping Address"
                                      />
                                    </span>
                                  </span>
                                  <span color="grey_dark">
                                    <span className="bigDesc">
                                      {`${shipping.fname} ${shipping.lname}
                                                        ${shipping.address_object.street} ${shipping.cityName}
                                                        ${shipping.address_object.postcode}`}
                                    </span>
                                  </span>
                                </li>
                              )}
                              {shipping.defaultAddr && (
                                <li className="editList">
                                  <span color="grey">
                                    <span className="smallTitle">
                                      <FormattedMessage
                                        id="checkoutContactInfo.ShippingAddress"
                                        defaultMessage="Shipping Address"
                                      />
                                    </span>
                                  </span>
                                  <span color="grey_dark">
                                    <span className="bigDesc">
                                      {`${shipping.userFirstName
                                        ? shipping.userFirstName
                                        : ''
                                        } ${shipping.userLastName
                                          ? shipping.userLastName
                                          : ''
                                        }
                                                                ${shipping.street
                                          ? shipping.street
                                          : ''
                                        }  ${shipping.city ? shipping.city : ''
                                        }
                                                                ${shipping.postcode
                                          ? shipping.postcode
                                          : ''
                                        }`}
                                    </span>
                                  </span>
                                </li>
                              )}
                              {shipping.isClickAndCollect && (
                                <li className="editList">
                                  <span color="grey">
                                    <span className="smallTitle">
                                      <FormattedMessage
                                        id="checkoutContactInfo.ClicknCollect"
                                        defaultMessage="Click and Collect"
                                      />
                                    </span>
                                  </span>
                                  <span className="bigDesc">
                                    {`${shipping.clickAndCollect.setClickAndCollectAddr.name}`}
                                    <br />
                                    {`${shipping.clickAndCollect.setClickAndCollectAddr.address}`}
                                    <br />
                                    {`${shipping.clickAndCollect.setClickAndCollectAddr.phone}`}
                                  </span>
                                </li>
                              )}
                              <li className="editList">
                                <span color="grey">
                                  <span className="smallTitle">
                                    <FormattedMessage
                                      id="checkoutpaymentMethod.ShippingMethod"
                                      defaultMessage="Shipping Method"
                                    />
                                  </span>
                                </span>
                                <span color="grey_dark">
                                  <span className="bigDesc">
                                    <FormattedMessage
                                      id="checkoutpaymentMethod.Standardshipping"
                                      defaultMessage="Standard shipping"
                                    />
                                  </span>
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
                                        <img
                                          src={processFinish}
                                          alt="fininsh"
                                        />
                                      </div>
                                      <span
                                        color="grey_medium"
                                        className="editInformation">
                                        <FormattedMessage
                                          id="checkoutpaymentMethod.Contactinformation"
                                          defaultMessage="Contact information"
                                        />
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => this.editContact()}
                                      className="editOption">
                                      <FormattedMessage
                                        id="checkoutpaymentMethod.Edit"
                                        defaultMessage="Edit"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="step-section">
                                <ul className="editGrid">
                                  {(shipping.isShippingSet ||
                                    shipping.defaultAddr ||
                                    shipping.isClickAndCollect) && (
                                      <li className="editList">
                                        <span color="grey">
                                          <span className="smallTitle">
                                            <FormattedMessage
                                              id="checkoutpaymentMethod.Email"
                                              defaultMessage="Email"
                                            />
                                          </span>
                                        </span>
                                        <span color="grey_dark">
                                          <span className="bigDesc">
                                            {shipping.isClickAndCollect
                                              ? shipping.clickAndCollect.email
                                              : shipping.email}
                                          </span>
                                        </span>
                                      </li>
                                    )}

                                  {(shipping.isShippingSet ||
                                    shipping.defaultAddr ||
                                    shipping.isClickAndCollect) && (
                                      <li className="editList">
                                        <span color="grey">
                                          <span className="smallTitle">
                                            <FormattedMessage
                                              id="checkoutpaymentMethod.Mobilenumber"
                                              defaultMessage="Mobile number"
                                            />
                                          </span>
                                        </span>
                                        <span color="grey_dark">
                                          <span className="bigDesc">
                                            {shipping.isClickAndCollect
                                              ? shipping.clickAndCollect.mnumber
                                              : shipping.mnumber}
                                          </span>
                                        </span>
                                      </li>
                                    )}
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="AddressWrapper">
                            <div className="StepContainerShipping">
                              <div className="step-section">
                                <div className="StepBadge" id="paymentTab">
                                  <div
                                    type="disabled"
                                    id="PaymentMethod"
                                    className="StatusIconCircle">
                                    <span
                                      color="grey_medium"
                                      className="StatusIconText">
                                      <FormattedMessage
                                        id="checkoutpaymentMethod.three"
                                        defaultMessage="3"
                                      />
                                    </span>
                                  </div>
                                  <span
                                    color="grey_medium"
                                    className="StatusTitle">
                                    <FormattedMessage
                                      id="checkoutpaymentMethod.Payment"
                                      defaultMessage="Payment"
                                    />
                                  </span>
                                </div>
                              </div>
                              <div className="col-12">
                                <hr className="mb-0" />
                              </div>
                              <div className="step-section">
                                <div className="AddressWrapper findAddress">
                                  <h3 className="step-title">
                                    <FormattedMessage
                                      id="checkoutpaymentMethod.VIPCode"
                                      defaultMessage="Do you have a Gift Card or Promo Code?"
                                    />
                                  </h3>
                                  <div className="mob">
                                    <div className="mobileShow">
                                      <Collapsible
                                        trigger={
                                          <div
                                            onClick={() => this.closeOther(0)}
                                            className="Collapsible_text_container border-0">
                                            <div className="Collapsible_text footerHeading">
                                              <FormattedMessage
                                                id="checkoutpaymentMethod.VIPDiscountCode"
                                                defaultMessage="Promo Code"
                                              />
                                            </div>
                                            <div className="Collapsible_arrow_container">
                                              <img
                                                className="Icon"
                                                src={PlusIcon}
                                                alt=""
                                              />
                                            </div>
                                          </div>
                                        }
                                        triggerWhenOpen={
                                          <div className="Collapsible_text_container open">
                                            <div className="Collapsible_text footerHeading">
                                              <FormattedMessage
                                                id="checkoutpaymentMethod.VIPDiscountCode"
                                                defaultMessage="Promo Code"
                                              />
                                            </div>
                                            <div className="Collapsible_arrow_container">
                                              <img
                                                src={minusIcon}
                                                alt=""
                                                className="Icon"
                                              />
                                            </div>
                                          </div>
                                        }>
                                        <div style={{ textAlign: 'start' }}>
                                          <div className="col-12">
                                            <div className="py-4">
                                              <span className="accordianMainTitle">
                                                <FormattedMessage
                                                  id="checkoutpaymentMethod.discCode"
                                                  defaultMessage="Got a Promo Code?"
                                                />
                                              </span>
                                              <p className="vipCode">
                                                <FormattedMessage
                                                  id="checkoutpaymentMethod.VIPDiscCode"
                                                  defaultMessage="Enter your Promo Code"
                                                />{' '}
                                              </p>
                                            </div>
                                          </div>
                                          {/* <form className="pb-6"> */}
                                          <div className="styled-input pb-2 w-100">
                                            <div className="inputControl">
                                              <input
                                                type="text"
                                                onChange={(e) => {
                                                  notEdited = false;
                                                  this.setState({
                                                    voucode: e.target.value,
                                                  });
                                                }}
                                                value={this.state.voucode}
                                              />
                                              <label>
                                                <FormattedMessage
                                                  id="checkoutpaymentMethod.VIPDiscountCode"
                                                  defaultMessage="Promo Code"
                                                />
                                              </label>
                                              {/* <div className="greenCheck">
                                                                                <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                                    <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                                </svg>
                                                                            </div> */}
                                              <span></span>
                                            </div>
                                            {myCart.voucherSuccess && (
                                              <div
                                                style={{ color: 'green' }}
                                                className="inputControl">
                                                {myCart.voucherSuccess}
                                              </div>
                                            )}
                                            {myCart.voucherError && (
                                              <div
                                                style={{ color: 'red' }}
                                                className="inputControl">
                                                {myCart.voucherError}
                                              </div>
                                            )}
                                          </div>
                                          <div className="styled-input w-100 pb-5">
                                            <div className="inputControlmb-0">
                                              {myCart.discount_amount === 0 &&
                                                (myCart.voucher_discount ===
                                                  0 ||
                                                  !myCart.voucher_discount) && (
                                                  <button
                                                    type="button"
                                                    className="BaseButton"
                                                    onClick={() =>
                                                      this.applyVoucode(
                                                        this.state.voucode
                                                      )
                                                    }>
                                                    <FormattedMessage
                                                      id="checkoutpaymentMethod.Apply"
                                                      defaultMessage="Apply"
                                                    />
                                                  </button>
                                                )}
                                              {myCart.discount_amount !== 0 ||
                                                (myCart.voucher_discount >
                                                  0 && (
                                                    <button
                                                      kind="secondary"
                                                      type="submit"
                                                      className="BaseButton iJHjNV gcJclK"
                                                      onClick={() =>
                                                        this.removeVoucode(
                                                          this.state.voucode
                                                        )
                                                      }>
                                                      <FormattedMessage
                                                        id="checkoutpaymentMethod.Remove"
                                                        defaultMessage="Remove"
                                                      />
                                                    </button>
                                                  ))}
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
                                    {!chanegeBillingAddr &&
                                      !shipping.isClickAndCollect && (
                                        <div className="step-section">
                                          <ul className="editGrid">
                                            {shipping.isShippingSet &&
                                              !billing && (
                                                <li className="editList">
                                                  <span className="billingAddress">
                                                    <FormattedMessage
                                                      id="checkoutpaymentMethod.BillingAddress"
                                                      defaultMessage="Billing Address"
                                                    />
                                                  </span>
                                                  <p
                                                    color="grey_dark"
                                                    className="billSectionEdit">
                                                    <span color="grey_dark">
                                                      <span className="bigDesc">
                                                        {`${_.upperFirst(
                                                          shipping.fname
                                                        )} ${_.upperFirst(
                                                          shipping.lname
                                                        )}
                                                                    ${_.upperFirst(
                                                          shipping
                                                            .address_object
                                                            .street
                                                        )} ${_.upperFirst(
                                                          shipping.cityName
                                                        )}
                                                                    ${shipping
                                                            .address_object
                                                            .postcode
                                                          }`}
                                                      </span>
                                                    </span>
                                                  </p>
                                                  <button
                                                    onClick={() =>
                                                      this.chanegeBilling(
                                                        shipping
                                                      )
                                                    }
                                                    type="button"
                                                    className="editchangeadd">
                                                    <FormattedMessage
                                                      id="checkoutpaymentMethod.ChangeBilladdr"
                                                      defaultMessage="Change Billing address"
                                                    />
                                                  </button>
                                                </li>
                                              )}
                                            {shipping.defaultAddr && !billing && (
                                              <li className="editList">
                                                <span className="billingAddress">
                                                  <FormattedMessage
                                                    id="checkoutpaymentMethod.BillingAddress"
                                                    defaultMessage="Billing Address"
                                                  />
                                                </span>
                                                <p
                                                  color="grey_dark"
                                                  className="billSectionEdit">
                                                  <span color="grey_dark">
                                                    <span className="bigDesc">
                                                      {`${_.upperFirst(
                                                        shipping.userFirstName
                                                      )} ${_.upperFirst(
                                                        shipping.userLastName
                                                      )} 
                                                                    ${_.upperFirst(
                                                        shipping.street
                                                      )}  ${_.upperFirst(
                                                        shipping.city
                                                      )}
                                                                    ${shipping.postcode
                                                        }`}
                                                    </span>
                                                  </span>
                                                </p>
                                                <button
                                                  onClick={() =>
                                                    this.chanegeBilling(
                                                      shipping
                                                    )
                                                  }
                                                  type="button"
                                                  className="editchangeadd">
                                                  <FormattedMessage
                                                    id="checkoutpaymentMethod.ChangeBilladdr"
                                                    defaultMessage="Change Billing address"
                                                  />
                                                </button>
                                              </li>
                                            )}
                                            {billing && (
                                              <li className="editList">
                                                <span className="billingAddress">
                                                  <FormattedMessage
                                                    id="checkoutpaymentMethod.BillingAddress"
                                                    defaultMessage="Billing Address"
                                                  />
                                                </span>
                                                <p
                                                  color="grey_dark"
                                                  className="billSectionEdit">
                                                  <span color="grey_dark">
                                                    <span className="bigDesc">
                                                      {`${_.upperFirst(
                                                        billing.fname
                                                      )} ${_.upperFirst(
                                                        billing.lname
                                                      )}
                                                                    ${_.upperFirst(
                                                        billing
                                                          .address_object
                                                          .street
                                                      )} ${_.upperFirst(
                                                        billing.cityName
                                                      )}
                                                                    ${billing
                                                          .address_object
                                                          .postcode
                                                        }`}
                                                    </span>
                                                  </span>
                                                </p>
                                                <button
                                                  onClick={() =>
                                                    this.chanegeBilling(billing)
                                                  }
                                                  type="button"
                                                  className="editchangeadd">
                                                  <FormattedMessage
                                                    id="checkoutpaymentMethod.ChangeBilladdr"
                                                    defaultMessage="Change Billing address"
                                                  />
                                                </button>
                                              </li>
                                            )}
                                          </ul>
                                        </div>
                                      )}

                                    {chanegeBillingAddr && (
                                      <div className="step-section">
                                        <div className="AddressWrapper">
                                          <h3 className="step-title">
                                            <FormattedMessage
                                              id="shipping.EnterBillingaddress"
                                              defaultMessage="Enter billing address"
                                            />
                                          </h3>
                                          <form className="styles__FormWrapper-rj3029-0 lonvYJ">
                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                              <div className="inputControl">
                                                <input
                                                  onChange={(e) =>
                                                    this.firstNameChange(e)
                                                  }
                                                  value={firstName}
                                                  type="text"
                                                />
                                                <label>
                                                  <FormattedMessage
                                                    id="shipping.FirstName"
                                                    defaultMessage="First Name"
                                                  />
                                                </label>
                                                <div className="greenCheck">
                                                  {firstNameErr === '' && (
                                                    <svg
                                                      width="20px"
                                                      height="13px"
                                                      className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO"
                                                      viewBox="0 0 20 13"
                                                      data-di-res-id="8f6a84aa-8d165f58"
                                                      data-di-rand="1587975367013">
                                                      <path
                                                        d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z"
                                                        fill="currentColor"
                                                        fill-rule="evenodd"></path>
                                                    </svg>
                                                  )}
                                                  {firstNameErr &&
                                                    firstNameErr.length > 0 && (
                                                      <svg
                                                        viewBox="0 0 17 17"
                                                        width="17px"
                                                        height="17px"
                                                        className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo"
                                                        data-di-res-id="a2f523df-4ed24860"
                                                        data-di-rand="1587975551851">
                                                        <path
                                                          d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z"
                                                          fill="currentColor"
                                                          fill-rule="evenodd"></path>
                                                      </svg>
                                                    )}
                                                </div>
                                                <span
                                                  class={
                                                    firstNameErr === false
                                                      ? ''
                                                      : firstNameErr === ''
                                                        ? 'greenLine'
                                                        : 'redLine'
                                                  }></span>
                                                {firstNameErr && (
                                                  <p className="redValidaion">
                                                    {firstNameErr}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                              <div className="inputControl">
                                                <input
                                                  type="text"
                                                  value={lastName}
                                                  onChange={(e) =>
                                                    this.lastNameChange(e)
                                                  }
                                                />
                                                <label>
                                                  <FormattedMessage
                                                    id="shipping.LastName"
                                                    defaultMessage="Last Name"
                                                  />
                                                </label>
                                                <div className="redClose">
                                                  {lastNameErr === '' && (
                                                    <svg
                                                      width="20px"
                                                      height="13px"
                                                      className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO"
                                                      viewBox="0 0 20 13"
                                                      data-di-res-id="8f6a84aa-8d165f58"
                                                      data-di-rand="1587975367013">
                                                      <path
                                                        d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z"
                                                        fill="currentColor"
                                                        fill-rule="evenodd"></path>
                                                    </svg>
                                                  )}
                                                  {lastNameErr &&
                                                    lastNameErr.length > 0 && (
                                                      <svg
                                                        viewBox="0 0 17 17"
                                                        width="17px"
                                                        height="17px"
                                                        className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo"
                                                        data-di-res-id="a2f523df-4ed24860"
                                                        data-di-rand="1587975551851">
                                                        <path
                                                          d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z"
                                                          fill="currentColor"
                                                          fill-rule="evenodd"></path>
                                                      </svg>
                                                    )}
                                                </div>
                                                <span
                                                  class={
                                                    lastNameErr === false
                                                      ? ''
                                                      : lastNameErr === ''
                                                        ? 'greenLine'
                                                        : 'redLine'
                                                  }></span>
                                                {lastNameErr && (
                                                  <p className="redValidaion">
                                                    {lastNameErr}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                              <div className="inputControl">
                                                <input
                                                  value={AptValue}
                                                  onChange={(e) =>
                                                    this.AptUpdate(e)
                                                  }
                                                  type="text"
                                                />
                                                <label>
                                                  <FormattedMessage
                                                    id="shipping.Apt"
                                                    defaultMessage="Apt / Suite (optional)"
                                                  />
                                                </label>
                                                <div className="greenCheck">
                                                  {AptValue &&
                                                    AptValue.length > 0 && (
                                                      <svg
                                                        width="20px"
                                                        height="13px"
                                                        className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO"
                                                        viewBox="0 0 20 13"
                                                        data-di-res-id="8f6a84aa-8d165f58"
                                                        data-di-rand="1587975367013">
                                                        <path
                                                          d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z"
                                                          fill="currentColor"
                                                          fill-rule="evenodd"></path>
                                                      </svg>
                                                    )}
                                                </div>
                                                {AptValue &&
                                                  AptValue.length > 0 && (
                                                    <span className="greenLine"></span>
                                                  )}
                                                {/* <span className="redLine"></span> */}
                                              </div>
                                            </div>
                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                              <div className="inputControl">
                                                <input
                                                  type="text"
                                                  value={streetValue}
                                                  onChange={(e) =>
                                                    this.streetValueChange(e)
                                                  }
                                                />
                                                <label>
                                                  <FormattedMessage
                                                    id="shipping.Streetaddress"
                                                    defaultMessage="Street address"
                                                  />
                                                </label>
                                                <div className="redClose">
                                                  {streetValueErr === '' && (
                                                    <svg
                                                      width="20px"
                                                      height="13px"
                                                      className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO"
                                                      viewBox="0 0 20 13"
                                                      data-di-res-id="8f6a84aa-8d165f58"
                                                      data-di-rand="1587975367013">
                                                      <path
                                                        d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z"
                                                        fill="currentColor"
                                                        fill-rule="evenodd"></path>
                                                    </svg>
                                                  )}
                                                  {streetValueErr &&
                                                    streetValueErr.length >
                                                    0 && (
                                                      <svg
                                                        viewBox="0 0 17 17"
                                                        width="17px"
                                                        height="17px"
                                                        className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo"
                                                        data-di-res-id="a2f523df-4ed24860"
                                                        data-di-rand="1587975551851">
                                                        <path
                                                          d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z"
                                                          fill="currentColor"
                                                          fill-rule="evenodd"></path>
                                                      </svg>
                                                    )}
                                                </div>
                                                <span
                                                  class={
                                                    streetValueErr === false
                                                      ? ''
                                                      : streetValueErr === ''
                                                        ? 'greenLine'
                                                        : 'redLine'
                                                  }></span>
                                                {streetValueErr && (
                                                  <p className="redValidaion">
                                                    {streetValueErr}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                              <div className="inputControl">
                                                <input
                                                  value={companyName}
                                                  onChange={(e) =>
                                                    this.comapnyNameChange(e)
                                                  }
                                                  type="text"
                                                />
                                                <label>
                                                  <FormattedMessage
                                                    id="shipping.CompanyName"
                                                    defaultMessage="Company Name (optional)"
                                                  />
                                                </label>
                                                <div className="greenCheck">
                                                  {companyName &&
                                                    companyName.length > 0 && (
                                                      <svg
                                                        width="20px"
                                                        height="13px"
                                                        className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO"
                                                        viewBox="0 0 20 13"
                                                        data-di-res-id="8f6a84aa-8d165f58"
                                                        data-di-rand="1587975367013">
                                                        <path
                                                          d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z"
                                                          fill="currentColor"
                                                          fill-rule="evenodd"></path>
                                                      </svg>
                                                    )}
                                                </div>
                                                {companyName &&
                                                  companyName.length > 0 && (
                                                    <span className="greenLine"></span>
                                                  )}
                                              </div>
                                            </div>
                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                              <div className="inputControl">
                                                <div className="select-down"></div>
                                                {this.state.country && (
                                                  <div className="">
                                                    <select
                                                      name="select"
                                                      id="select"
                                                      className="is-touched is-pristine av-valid"
                                                      value={
                                                        this.state
                                                          .selectedCountry
                                                      }
                                                      onChange={(e) =>
                                                        this.onChangeCountry(
                                                          e,
                                                          this.state.country
                                                        )
                                                      }>
                                                      {this.state.country &&
                                                        this.state.country.map(
                                                          (c) => {
                                                            return (
                                                              <option
                                                                key={c.id}
                                                                value={c.id}>
                                                                {
                                                                  c.full_name_english
                                                                }
                                                              </option>
                                                            );
                                                          }
                                                        )}
                                                    </select>
                                                    <label className="label-select">
                                                      <FormattedMessage
                                                        id="shipping.Country"
                                                        defaultMessage="Country"
                                                      />
                                                    </label>
                                                    {/* <span className="Select__SelectedValue-sc-155k6kv-1 cvILin">Please select</span> */}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                              <div className="inputControl">
                                                <div className="select-down"></div>
                                                {this.state.country && (
                                                  <div className="">
                                                    <select
                                                      onChange={(e) =>
                                                        this.onChangeCity(
                                                          e,
                                                          this.state.CityList
                                                        )
                                                      }
                                                      name="select"
                                                      id="select"
                                                      value={
                                                        this.state.selectedCity
                                                      }
                                                      className="is-touched is-pristine av-valid">
                                                      {this.state.CityList &&
                                                        this.state.CityList.map(
                                                          (c) => {
                                                            return (
                                                              <option
                                                                key={c.id}
                                                                value={c.id}>
                                                                {c.name}
                                                              </option>
                                                            );
                                                          }
                                                        )}
                                                    </select>
                                                    <label className="label-select">
                                                      <FormattedMessage
                                                        id="shipping.State"
                                                        defaultMessage="State"
                                                      />
                                                    </label>
                                                    {/* <span className="Select__SelectedValue-sc-155k6kv-1 cvILin">Please select</span> */}
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                              <div className="inputControl">
                                                <input
                                                  value={zipCode}
                                                  onChange={(e) =>
                                                    this.zipCodeChange(e)
                                                  }
                                                  type="number"
                                                />
                                                <label>
                                                  <FormattedMessage
                                                    id="shipping.Zipcode"
                                                    defaultMessage="Zip code"
                                                  />
                                                </label>
                                                <div className="redClose">
                                                  {zipCodeErr === '' && (
                                                    <svg
                                                      width="20px"
                                                      height="13px"
                                                      className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO"
                                                      viewBox="0 0 20 13"
                                                      data-di-res-id="8f6a84aa-8d165f58"
                                                      data-di-rand="1587975367013">
                                                      <path
                                                        d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z"
                                                        fill="currentColor"
                                                        fill-rule="evenodd"></path>
                                                    </svg>
                                                  )}
                                                  {zipCodeErr &&
                                                    zipCodeErr.length > 0 && (
                                                      <svg
                                                        viewBox="0 0 17 17"
                                                        width="17px"
                                                        height="17px"
                                                        className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo"
                                                        data-di-res-id="a2f523df-4ed24860"
                                                        data-di-rand="1587975551851">
                                                        <path
                                                          d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z"
                                                          fill="currentColor"
                                                          fill-rule="evenodd"></path>
                                                      </svg>
                                                    )}
                                                </div>
                                                <span
                                                  class={
                                                    zipCodeErr === false
                                                      ? ''
                                                      : zipCodeErr === ''
                                                        ? 'greenLine'
                                                        : 'redLine'
                                                  }></span>
                                                {zipCodeErr && (
                                                  <p className="redValidaion">
                                                    {zipCodeErr}
                                                  </p>
                                                )}
                                              </div>
                                            </div>

                                            <div className="styled-input bUgSOh customField w-100 mt-4">
                                              <div className="SubmitAddress">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    this.onSubmit()
                                                  }
                                                  className="dNUJxY">
                                                  <FormattedMessage
                                                    id="checkoutpaymentMethod.SubmitAddress"
                                                    defaultMessage="Submit Address"
                                                  />
                                                </button>
                                                {/* {isDisabled && <button type="button" className="BaseButton">Submit Address</button>} */}
                                                {/* <div className="styles__ButtonFlexWrapper-rj3029-5 crELmO">
                                                            <button className="anotherAdress">Search for another address</button>
                                                        </div> */}
                                              </div>
                                            </div>
                                          </form>
                                        </div>
                                      </div>
                                    )}

                                    {/* Payment by card */}
                                    <div className="CardPayment">
                                      <div className="container">
                                        <p className="HeadingPayOption">
                                          <FormattedMessage
                                            id="paybycard.ChoosePaymentOption"
                                            defaultMessage="Choose payment option"
                                          />
                                        </p>

                                        {payfortFailedMessage && (
                                          <div className="paymentFailedMessage">
                                            {payfortFailedMessage}
                                          </div>
                                        )}

                                        <div className="row">
                                          <div className="col-md-12">
                                            <div
                                              style={
                                                Ptype === 'CC'
                                                  ? {
                                                    'box-shadow':
                                                      '0 -2px 4px #168bda78, 0 2px 6px #168bda87',
                                                  }
                                                  : {}
                                              }>
                                              <Collapsible
                                                open={Ptype === 'CC'}
                                                trigger={
                                                  <div
                                                    onClick={() => {
                                                      this.closeOther11(0);
                                                      if (Ptype !== 'CC')
                                                        this.redirectToConfirm(
                                                          'payfort_fort_cc',
                                                          'CC'
                                                        );
                                                    }}
                                                    className="Collapsible_text_container border-0">
                                                    <div className="Collapsible_text">
                                                      <p className="titleHeading">
                                                        <FormattedMessage
                                                          id="creditCCLabel"
                                                          defaultMessage="Credit card / mada bank Card"
                                                        />
                                                      </p>
                                                      <div className="cardList">
                                                        <div className="iYKNAh">
                                                          <div className="PaymentMethodsstyles__IconWrap-jtzizl-1">
                                                            <ul className="cardlistimg">
                                                              <span>
                                                                <img
                                                                  src={
                                                                    madacards
                                                                  }
                                                                  className="MadaCard"
                                                                  alt="apple"
                                                                />
                                                              </span>
                                                              <svg
                                                                width="50px"
                                                                className="master Footerstyles__StyledIcon-sc-1eplnel-6 jauHmx"
                                                                viewBox="0 0 48 30"
                                                                data-di-res-id="acbdee86-cf30fe49"
                                                                data-di-rand="1588938960140">
                                                                <g
                                                                  stroke="none"
                                                                  stroke-width="1"
                                                                  fill="none"
                                                                  fill-rule="evenodd">
                                                                  <g
                                                                    transform="translate(-1095.000000, -950.000000)"
                                                                    fill-rule="nonzero">
                                                                    <g transform="translate(1095.000000, 950.000000)">
                                                                      <g>
                                                                        <rect
                                                                          fill="#0E4595"
                                                                          x="0"
                                                                          y="0"
                                                                          width="48"
                                                                          height="30"
                                                                          rx="2.56"></rect>
                                                                        <polygon
                                                                          fill="#FFFFFF"
                                                                          points="17.804608 21.2884076 19.939648 8.81942675 23.354688 8.81942675 21.218176 21.2884076 17.804608 21.2884076"></polygon>
                                                                        <path
                                                                          d="M33.555712,9.08840764 C32.879104,8.83579618 31.818944,8.56471338 30.49504,8.56471338 C27.12064,8.56471338 24.74368,10.2557962 24.72352,12.6795541 C24.704448,14.4712739 26.420352,15.4706369 27.715712,16.0671338 C29.044992,16.6782166 29.49184,17.0680255 29.485568,17.6138217 C29.47712,18.4494904 28.424,18.8314013 27.442496,18.8314013 C26.075584,18.8314013 25.34944,18.6424841 24.227904,18.176879 L23.787904,17.9787898 L23.308544,20.7700637 C24.10624,21.1181529 25.581184,21.4197452 27.112576,21.4353503 C30.702336,21.4353503 33.032576,19.7635032 33.0592,17.1752866 C33.072128,15.7569427 32.162304,14.6774522 30.192128,13.7875159 C28.998464,13.2107643 28.267392,12.8257325 28.2752,12.2417834 C28.2752,11.7235032 28.893888,11.169172 30.230784,11.169172 C31.347584,11.1519745 32.156544,11.3943949 32.786752,11.646879 L33.092672,11.790828 L33.555712,9.08828025"
                                                                          fill="#FFFFFF"></path>
                                                                        <path
                                                                          d="M42.34336,8.81942675 L39.70464,8.81942675 C38.887104,8.81942675 38.275392,9.04152866 37.916352,9.85343949 L32.844672,21.2803822 L36.430592,21.2803822 C36.430592,21.2803822 37.017024,19.7438854 37.149632,19.4066242 C37.541504,19.4066242 41.025024,19.4119745 41.523136,19.4119745 C41.625216,19.8484076 41.938496,21.2803185 41.938496,21.2803185 L45.107328,21.2803822 L42.343296,8.81929936 L42.34336,8.81942675 Z M38.156608,16.870828 C38.43904,16.1523567 39.517248,13.3852866 39.517248,13.3852866 C39.497024,13.4184076 39.797568,12.6633121 39.970048,12.1951592 L40.200832,13.2703185 C40.200832,13.2703185 40.85472,16.2465605 40.99136,16.8707643 L38.156608,16.8707643 L38.156608,16.870828 Z"
                                                                          fill="#FFFFFF"></path>
                                                                        <path
                                                                          d="M14.905792,8.81942675 L11.562432,17.3223567 L11.206144,15.5944586 C10.583744,13.6024841 8.644544,11.4443949 6.476672,10.3638854 L9.533696,21.2685987 L13.14688,21.2644586 L18.523136,8.81955414 L14.905856,8.81955414"
                                                                          fill="#FFFFFF"></path>
                                                                        <path
                                                                          d="M8.44288,8.81942675 L2.93632,8.81942675 L2.892608,9.0788535 C7.176768,10.1109554 10.011456,12.6051592 11.18816,15.6020382 L9.990848,9.87210191 C9.784128,9.08261146 9.184448,8.84700637 8.442816,8.81949045"
                                                                          fill="#F2AE14"></path>
                                                                      </g>
                                                                    </g>
                                                                  </g>
                                                                </g>
                                                              </svg>
                                                              <svg
                                                                width="50px"
                                                                className="Footerstyles__StyledIcon-sc-1eplnel-6 jauHmx"
                                                                viewBox="0 0 48 30"
                                                                data-di-res-id="e0b91613-f924f21f"
                                                                data-di-rand="1588938960139">
                                                                <g
                                                                  stroke="none"
                                                                  stroke-width="1"
                                                                  fill="none"
                                                                  fill-rule="evenodd">
                                                                  <g
                                                                    transform="translate(-1183.000000, -950.000000)"
                                                                    fill-rule="nonzero">
                                                                    <g transform="translate(1183.000000, 950.000000)">
                                                                      <g>
                                                                        <path
                                                                          d="M46.2182857,29.9396226 L1.61980952,29.9396226 C0.728952381,29.9396226 0,29.2175472 0,28.3350943 L0,1.6045283 C0,0.722075472 0.728952381,0 1.61980952,0 L46.2182857,0 C47.1091429,0 47.8380952,0.722075472 47.8380952,1.6045283 L47.8380952,28.3350943 C47.8380952,29.2175472 47.1091429,29.9396226 46.2182857,29.9396226 Z"
                                                                          fill="#010101"></path>
                                                                        <g transform="translate(7.428571, 2.075472)">
                                                                          <path
                                                                            d="M5.99790476,25.3679245 L5.99790476,23.6750943 C5.99790476,23.0396226 5.61180952,22.6177358 4.95314286,22.6120755 C4.60685714,22.6064151 4.24914286,22.7132075 3.9992381,23.0901887 C3.81180952,22.7920755 3.51657143,22.6120755 3.10209524,22.6120755 C2.81257143,22.6120755 2.50590476,22.6907547 2.28457143,23.0058491 L2.28457143,22.6796226 L1.73942857,22.6796226 L1.73942857,25.3679245 L2.29028571,25.3679245 L2.29028571,23.8267925 C2.29028571,23.36 2.57409524,23.1124528 2.97733333,23.1124528 C3.36914286,23.1124528 3.59047619,23.3654717 3.59047619,23.8211321 L3.59047619,25.3677358 L4.14133333,25.3677358 L4.14133333,23.8266038 C4.14133333,23.3598113 4.43657143,23.1122642 4.82838095,23.1122642 C5.23142857,23.1122642 5.4472381,23.365283 5.4472381,23.8209434 L5.4472381,25.3675472 L5.99790476,25.3675472 L5.99790476,25.3679245 Z M14.8438095,22.679434 L13.8558095,22.679434 L13.8558095,21.8639623 L13.3051429,21.8639623 L13.3051429,22.679434 L12.731619,22.679434 L12.731619,23.1686792 L13.3051429,23.1686792 L13.3051429,24.4398113 C13.3051429,25.0641509 13.5266667,25.435283 14.2249524,25.435283 C14.480381,25.435283 14.7758095,25.3566038 14.9630476,25.2271698 L14.7925714,24.7490566 C14.6165714,24.8503774 14.423619,24.9009434 14.2702857,24.9009434 C13.9750476,24.9009434 13.8558095,24.7209434 13.8558095,24.4509434 L13.8558095,23.1686792 L14.8438095,23.1686792 L14.8438095,22.679434 Z M19.88,22.6120755 C19.5394286,22.6120755 19.2952381,22.7696226 19.1419048,23.0058491 L19.1419048,22.6796226 L18.6024762,22.6796226 L18.6024762,25.3679245 L19.147619,25.3679245 L19.147619,23.8550943 C19.147619,23.4107547 19.3634286,23.1239623 19.7495238,23.1239623 C19.8687619,23.1239623 19.9937143,23.1407547 20.1186667,23.1915094 L20.300381,22.685283 C20.1695238,22.6345283 19.9992381,22.6120755 19.88,22.6120755 L19.88,22.6120755 Z M12.2660952,22.8932075 C11.9822857,22.7075472 11.5904762,22.6120755 11.1588571,22.6120755 C10.4718095,22.6120755 10.051619,22.9326415 10.051619,23.4669811 C10.051619,23.9056604 10.3582857,24.17 10.9657143,24.2543396 L11.244,24.2937736 C11.567619,24.3386792 11.743619,24.4513208 11.743619,24.6030189 C11.743619,24.8111321 11.5051429,24.9460377 11.1020952,24.9460377 C10.676381,24.9460377 10.3980952,24.8166038 10.1994286,24.6649057 L9.92114286,25.0867925 C10.3241905,25.3792453 10.8068571,25.4354717 11.096381,25.4354717 C11.8798095,25.4354717 12.3114286,25.0754717 12.3114286,24.5637736 C12.3114286,24.0913208 11.9820952,23.849434 11.3859048,23.7650943 L11.107619,23.7256604 C10.8521905,23.6918868 10.6249524,23.6132075 10.6249524,23.4332075 C10.6249524,23.2364151 10.8407619,23.1013208 11.164381,23.1013208 C11.5106667,23.1013208 11.8457143,23.2307547 12.0102857,23.3318868 L12.2660952,22.8932075 Z M20.4988571,24.0237736 C20.4988571,24.8392453 21.0495238,25.4354717 21.924,25.4354717 C22.3327619,25.4354717 22.6053333,25.3454717 22.9005714,25.1149057 L22.6167619,24.6930189 C22.3952381,24.850566 22.1624762,24.9349057 21.9070476,24.9349057 C21.4358095,24.9292453 21.0666667,24.5637736 21.0666667,24.0237736 C21.0666667,23.4837736 21.4358095,23.1183019 21.9070476,23.1126415 C22.1626667,23.1126415 22.3954286,23.1969811 22.6167619,23.3545283 L22.9005714,22.9326415 C22.6053333,22.7020755 22.3327619,22.6120755 21.924,22.6120755 C21.0497143,22.6120755 20.4988571,23.2081132 20.4988571,24.0237736 L20.4988571,24.0237736 Z M16.6834286,22.6120755 C15.8885714,22.6120755 15.3434286,23.1801887 15.3434286,24.0181132 C15.3434286,24.8730189 15.9112381,25.4354717 16.7232381,25.4354717 C17.132,25.4354717 17.5066667,25.3341509 17.836,25.0586792 L17.5464762,24.659434 C17.3194286,24.839434 17.0299048,24.940566 16.7573333,24.940566 C16.3769524,24.940566 15.9908571,24.7267925 15.9226667,24.2432075 L17.9497143,24.2432075 C17.9554286,24.1701887 17.9611429,24.0969811 17.9611429,24.0183019 C17.9552381,23.18 17.4441905,22.6120755 16.6834286,22.6120755 L16.6834286,22.6120755 Z M16.672,23.1126415 C17.0750476,23.1126415 17.347619,23.3713208 17.3874286,23.7932075 L15.9224762,23.7932075 C15.9737143,23.399434 16.2348571,23.1126415 16.672,23.1126415 L16.672,23.1126415 Z M9.32495238,24.0237736 L9.32495238,22.6796226 L8.77980952,22.6796226 L8.77980952,23.0058491 C8.59238095,22.7639623 8.28590476,22.6120755 7.89980952,22.6120755 C7.13904762,22.6120755 6.55980952,23.2026415 6.55980952,24.0237736 C6.55980952,24.8449057 7.13904762,25.4354717 7.89980952,25.4354717 C8.28590476,25.4354717 8.59238095,25.2835849 8.77980952,25.0418868 L8.77980952,25.3681132 L9.32495238,25.3681132 L9.32495238,24.0237736 Z M7.12761905,24.0237736 C7.12761905,23.5175472 7.4512381,23.1126415 7.97352381,23.1126415 C8.47314286,23.1126415 8.80247619,23.5007547 8.80247619,24.0237736 C8.80247619,24.5467925 8.47314286,24.9349057 7.97352381,24.9349057 C7.45142857,24.934717 7.12761905,24.5298113 7.12761905,24.0237736 L7.12761905,24.0237736 Z M28.0788571,22.6120755 C27.7382857,22.6120755 27.4940952,22.7696226 27.3407619,23.0058491 L27.3407619,22.6796226 L26.8013333,22.6796226 L26.8013333,25.3679245 L27.3464762,25.3679245 L27.3464762,23.8550943 C27.3464762,23.4107547 27.5622857,23.1239623 27.948381,23.1239623 C28.067619,23.1239623 28.1925714,23.1407547 28.3175238,23.1915094 L28.4992381,22.685283 C28.368381,22.6345283 28.1979048,22.6120755 28.0788571,22.6120755 L28.0788571,22.6120755 Z M32.452,24.9779245 C32.4899048,24.9779245 32.5253333,24.9849057 32.5586667,24.9988679 C32.5918095,25.0128302 32.6209524,25.0318868 32.6459048,25.0560377 C32.6706667,25.0801887 32.6902857,25.1084906 32.7045714,25.1411321 C32.7188571,25.1735849 32.7260952,25.2081132 32.7260952,25.244717 C32.7260952,25.2813208 32.7188571,25.3158491 32.7045714,25.3481132 C32.6902857,25.3803774 32.6706667,25.4086792 32.6459048,25.4328302 C32.6209524,25.4569811 32.592,25.4762264 32.5586667,25.4903774 C32.5253333,25.5045283 32.4899048,25.5116981 32.452,25.5116981 C32.4133333,25.5116981 32.3771429,25.5045283 32.3434286,25.4903774 C32.3097143,25.4762264 32.2805714,25.4569811 32.256,25.4328302 C32.2312381,25.4086792 32.2118095,25.3803774 32.1975238,25.3481132 C32.1832381,25.3158491 32.1761905,25.2813208 32.1761905,25.244717 C32.1761905,25.2081132 32.1832381,25.1735849 32.1975238,25.1411321 C32.2118095,25.1086792 32.2312381,25.0803774 32.256,25.0560377 C32.2805714,25.0316981 32.3097143,25.0126415 32.3434286,24.9988679 C32.3771429,24.9849057 32.4133333,24.9779245 32.452,24.9779245 Z M32.452,25.4528302 C32.4811429,25.4528302 32.5081905,25.4473585 32.5333333,25.4364151 C32.5584762,25.4254717 32.580381,25.410566 32.5992381,25.3918868 C32.6182857,25.3732075 32.6329524,25.3511321 32.6438095,25.3258491 C32.6546667,25.300566 32.66,25.2735849 32.66,25.244717 C32.66,25.2158491 32.6546667,25.1888679 32.6438095,25.1635849 C32.6329524,25.1383019 32.6182857,25.1162264 32.5992381,25.0975472 C32.580381,25.0786792 32.5582857,25.0641509 32.5333333,25.0533962 C32.5081905,25.0426415 32.4811429,25.0373585 32.452,25.0373585 C32.4224762,25.0373585 32.3948571,25.0426415 32.3691429,25.0533962 C32.3434286,25.0641509 32.3209524,25.0786792 32.3020952,25.0975472 C32.2832381,25.1162264 32.2681905,25.1383019 32.2575238,25.1635849 C32.2466667,25.1888679 32.2413333,25.2158491 32.2413333,25.244717 C32.2413333,25.2735849 32.2466667,25.300566 32.2575238,25.3258491 C32.2681905,25.3511321 32.2832381,25.3732075 32.3020952,25.3918868 C32.3209524,25.410566 32.3434286,25.4254717 32.3691429,25.4364151 C32.3948571,25.4473585 32.4224762,25.4528302 32.452,25.4528302 Z M32.4678095,25.12 C32.5,25.12 32.5247619,25.1269811 32.5420952,25.1413208 C32.5594286,25.1554717 32.5681905,25.174717 32.5681905,25.1992453 C32.5681905,25.2198113 32.5613333,25.2366038 32.5474286,25.25 C32.5335238,25.2632075 32.5139048,25.2715094 32.488381,25.2745283 L32.5702857,25.3681132 L32.5062857,25.3681132 L32.4302857,25.275283 L32.4059048,25.275283 L32.4059048,25.3681132 L32.352381,25.3681132 L32.352381,25.1201887 L32.4678095,25.1201887 L32.4678095,25.12 Z M32.4057143,25.1664151 L32.4057143,25.2324528 L32.4670476,25.2324528 C32.4811429,25.2324528 32.492381,25.2298113 32.5007619,25.2243396 C32.5091429,25.2188679 32.5133333,25.210566 32.5133333,25.1992453 C32.5133333,25.1883019 32.5091429,25.1801887 32.5007619,25.174717 C32.492381,25.1692453 32.4811429,25.1666038 32.4670476,25.1666038 L32.4057143,25.1666038 L32.4057143,25.1664151 Z M25.9893333,24.0237736 L25.9893333,22.6796226 L25.4441905,22.6796226 L25.4441905,23.0058491 C25.2567619,22.7639623 24.9502857,22.6120755 24.5641905,22.6120755 C23.8034286,22.6120755 23.2241905,23.2026415 23.2241905,24.0237736 C23.2241905,24.8449057 23.8032381,25.4354717 24.5641905,25.4354717 C24.9502857,25.4354717 25.2569524,25.2835849 25.4441905,25.0418868 L25.4441905,25.3681132 L25.9893333,25.3681132 L25.9893333,24.0237736 Z M23.792,24.0237736 C23.792,23.5175472 24.115619,23.1126415 24.6379048,23.1126415 C25.1375238,23.1126415 25.4668571,23.5007547 25.4668571,24.0237736 C25.4668571,24.5467925 25.1375238,24.9349057 24.6379048,24.9349057 C24.115619,24.934717 23.792,24.5298113 23.792,24.0237736 L23.792,24.0237736 Z M31.468381,24.0237736 L31.468381,21.5998113 L30.9232381,21.5998113 L30.9232381,23.0058491 C30.7358095,22.7639623 30.4293333,22.6120755 30.0430476,22.6120755 C29.2822857,22.6120755 28.7030476,23.2026415 28.7030476,24.0237736 C28.7030476,24.8449057 29.2822857,25.4354717 30.0430476,25.4354717 C30.4291429,25.4354717 30.7358095,25.2835849 30.9232381,25.0418868 L30.9232381,25.3681132 L31.468381,25.3681132 L31.468381,24.0237736 Z M29.2710476,24.0237736 C29.2710476,23.5175472 29.5946667,23.1126415 30.1171429,23.1126415 C30.6167619,23.1126415 30.9460952,23.5007547 30.9460952,24.0237736 C30.9460952,24.5467925 30.6167619,24.9349057 30.1171429,24.9349057 C29.5946667,24.934717 29.2710476,24.5298113 29.2710476,24.0237736 Z"
                                                                            fill="#FFFFFF"></path>
                                                                          <g>
                                                                            <rect
                                                                              fill="#F16122"
                                                                              x="11.632"
                                                                              y="2.22132075"
                                                                              width="9.82647619"
                                                                              height="15.8992453"></rect>
                                                                            <path
                                                                              d="M12.6464762,10.1709434 C12.6464762,6.9454717 14.1710476,4.07283019 16.5453333,2.22132075 C14.8089524,0.867358491 12.6180952,0.0594339623 10.2369524,0.0594339623 C4.59980952,0.0594339623 0.0299047619,4.58660377 0.0299047619,10.1709434 C0.0299047619,15.755283 4.59980952,20.2824528 10.2369524,20.2824528 C12.6180952,20.2824528 14.8089524,19.474717 16.5453333,18.120566 C14.1710476,16.2692453 12.6464762,13.3966038 12.6464762,10.1709434 Z"
                                                                              fill="#E91D25"></path>
                                                                            <path
                                                                              d="M32.1202215,17.0436704 L32.1202215,16.2152225 L32.2743743,16.2152225 L32.2743743,16.0460731 L31.8819048,16.0460731 L31.8819048,16.2152225 L32.0360576,16.2152225 L32.0360576,17.0441509 L32.1202215,17.0441509 L32.1202215,17.0436704 Z M32.8819048,17.0436704 L32.8819048,16.0441509 L32.761639,16.0441509 L32.6232115,16.7313206 L32.4847841,16.0441509 L32.3645183,16.0441509 L32.3645183,17.0436704 L32.4495681,17.0436704 L32.4495681,16.289706 L32.5793577,16.9398742 L32.6672868,16.9398742 L32.7970764,16.2882644 L32.7970764,17.0436704 L32.8819048,17.0436704 Z"
                                                                              fill="#F79E1D"></path>
                                                                            <path
                                                                              d="M33.0605714,10.1709434 C33.0605714,15.755283 28.4906667,20.2824528 22.8535238,20.2824528 C20.472381,20.2824528 18.2815238,19.474717 16.5451429,18.120566 C18.9194286,16.2690566 20.4438095,13.3964151 20.4438095,10.1709434 C20.4438095,6.9454717 18.9192381,4.07283019 16.5451429,2.22132075 C18.2815238,0.867358491 20.4721905,0.0594339623 22.8535238,0.0594339623 C28.4908571,0.0594339623 33.0605714,4.58660377 33.0605714,10.1709434 Z"
                                                                              fill="#F79E1D"></path>
                                                                          </g>
                                                                        </g>
                                                                      </g>
                                                                    </g>
                                                                  </g>
                                                                </g>
                                                              </svg>
                                                            </ul>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="Collapsible_arrow_container">
                                                      <img
                                                        className="Icon"
                                                        src={PlusIcon}
                                                        alt=""
                                                      />
                                                    </div>
                                                  </div>
                                                }
                                                triggerWhenOpen={
                                                  <div className="Collapsible_text_container open">
                                                    <div className="Collapsible_text">
                                                      <p className="titleHeading">
                                                        <FormattedMessage
                                                          id="creditCCLabel"
                                                          defaultMessage="Credit card / mada bank Card"
                                                        />
                                                      </p>
                                                      <div className="cardList">
                                                        <div className="iYKNAh">
                                                          <div className="PaymentMethodsstyles__IconWrap-jtzizl-1">
                                                            <ul className="cardlistimg">
                                                              <span>
                                                                <img
                                                                  src={
                                                                    madacards
                                                                  }
                                                                  className="MadaCard"
                                                                  alt="apple"
                                                                />
                                                              </span>
                                                              <svg
                                                                width="50px"
                                                                className="Footerstyles__StyledIcon-sc-1eplnel-6 jauHmx master"
                                                                viewBox="0 0 48 30"
                                                                data-di-res-id="acbdee86-cf30fe49"
                                                                data-di-rand="1588938960140">
                                                                <g
                                                                  stroke="none"
                                                                  stroke-width="1"
                                                                  fill="none"
                                                                  fill-rule="evenodd">
                                                                  <g
                                                                    transform="translate(-1095.000000, -950.000000)"
                                                                    fill-rule="nonzero">
                                                                    <g transform="translate(1095.000000, 950.000000)">
                                                                      <g>
                                                                        <rect
                                                                          fill="#0E4595"
                                                                          x="0"
                                                                          y="0"
                                                                          width="48"
                                                                          height="30"
                                                                          rx="2.56"></rect>
                                                                        <polygon
                                                                          fill="#FFFFFF"
                                                                          points="17.804608 21.2884076 19.939648 8.81942675 23.354688 8.81942675 21.218176 21.2884076 17.804608 21.2884076"></polygon>
                                                                        <path
                                                                          d="M33.555712,9.08840764 C32.879104,8.83579618 31.818944,8.56471338 30.49504,8.56471338 C27.12064,8.56471338 24.74368,10.2557962 24.72352,12.6795541 C24.704448,14.4712739 26.420352,15.4706369 27.715712,16.0671338 C29.044992,16.6782166 29.49184,17.0680255 29.485568,17.6138217 C29.47712,18.4494904 28.424,18.8314013 27.442496,18.8314013 C26.075584,18.8314013 25.34944,18.6424841 24.227904,18.176879 L23.787904,17.9787898 L23.308544,20.7700637 C24.10624,21.1181529 25.581184,21.4197452 27.112576,21.4353503 C30.702336,21.4353503 33.032576,19.7635032 33.0592,17.1752866 C33.072128,15.7569427 32.162304,14.6774522 30.192128,13.7875159 C28.998464,13.2107643 28.267392,12.8257325 28.2752,12.2417834 C28.2752,11.7235032 28.893888,11.169172 30.230784,11.169172 C31.347584,11.1519745 32.156544,11.3943949 32.786752,11.646879 L33.092672,11.790828 L33.555712,9.08828025"
                                                                          fill="#FFFFFF"></path>
                                                                        <path
                                                                          d="M42.34336,8.81942675 L39.70464,8.81942675 C38.887104,8.81942675 38.275392,9.04152866 37.916352,9.85343949 L32.844672,21.2803822 L36.430592,21.2803822 C36.430592,21.2803822 37.017024,19.7438854 37.149632,19.4066242 C37.541504,19.4066242 41.025024,19.4119745 41.523136,19.4119745 C41.625216,19.8484076 41.938496,21.2803185 41.938496,21.2803185 L45.107328,21.2803822 L42.343296,8.81929936 L42.34336,8.81942675 Z M38.156608,16.870828 C38.43904,16.1523567 39.517248,13.3852866 39.517248,13.3852866 C39.497024,13.4184076 39.797568,12.6633121 39.970048,12.1951592 L40.200832,13.2703185 C40.200832,13.2703185 40.85472,16.2465605 40.99136,16.8707643 L38.156608,16.8707643 L38.156608,16.870828 Z"
                                                                          fill="#FFFFFF"></path>
                                                                        <path
                                                                          d="M14.905792,8.81942675 L11.562432,17.3223567 L11.206144,15.5944586 C10.583744,13.6024841 8.644544,11.4443949 6.476672,10.3638854 L9.533696,21.2685987 L13.14688,21.2644586 L18.523136,8.81955414 L14.905856,8.81955414"
                                                                          fill="#FFFFFF"></path>
                                                                        <path
                                                                          d="M8.44288,8.81942675 L2.93632,8.81942675 L2.892608,9.0788535 C7.176768,10.1109554 10.011456,12.6051592 11.18816,15.6020382 L9.990848,9.87210191 C9.784128,9.08261146 9.184448,8.84700637 8.442816,8.81949045"
                                                                          fill="#F2AE14"></path>
                                                                      </g>
                                                                    </g>
                                                                  </g>
                                                                </g>
                                                              </svg>
                                                              <svg
                                                                width="50px"
                                                                className="Footerstyles__StyledIcon-sc-1eplnel-6 jauHmx"
                                                                viewBox="0 0 48 30"
                                                                data-di-res-id="e0b91613-f924f21f"
                                                                data-di-rand="1588938960139">
                                                                <g
                                                                  stroke="none"
                                                                  stroke-width="1"
                                                                  fill="none"
                                                                  fill-rule="evenodd">
                                                                  <g
                                                                    transform="translate(-1183.000000, -950.000000)"
                                                                    fill-rule="nonzero">
                                                                    <g transform="translate(1183.000000, 950.000000)">
                                                                      <g>
                                                                        <path
                                                                          d="M46.2182857,29.9396226 L1.61980952,29.9396226 C0.728952381,29.9396226 0,29.2175472 0,28.3350943 L0,1.6045283 C0,0.722075472 0.728952381,0 1.61980952,0 L46.2182857,0 C47.1091429,0 47.8380952,0.722075472 47.8380952,1.6045283 L47.8380952,28.3350943 C47.8380952,29.2175472 47.1091429,29.9396226 46.2182857,29.9396226 Z"
                                                                          fill="#010101"></path>
                                                                        <g transform="translate(7.428571, 2.075472)">
                                                                          <path
                                                                            d="M5.99790476,25.3679245 L5.99790476,23.6750943 C5.99790476,23.0396226 5.61180952,22.6177358 4.95314286,22.6120755 C4.60685714,22.6064151 4.24914286,22.7132075 3.9992381,23.0901887 C3.81180952,22.7920755 3.51657143,22.6120755 3.10209524,22.6120755 C2.81257143,22.6120755 2.50590476,22.6907547 2.28457143,23.0058491 L2.28457143,22.6796226 L1.73942857,22.6796226 L1.73942857,25.3679245 L2.29028571,25.3679245 L2.29028571,23.8267925 C2.29028571,23.36 2.57409524,23.1124528 2.97733333,23.1124528 C3.36914286,23.1124528 3.59047619,23.3654717 3.59047619,23.8211321 L3.59047619,25.3677358 L4.14133333,25.3677358 L4.14133333,23.8266038 C4.14133333,23.3598113 4.43657143,23.1122642 4.82838095,23.1122642 C5.23142857,23.1122642 5.4472381,23.365283 5.4472381,23.8209434 L5.4472381,25.3675472 L5.99790476,25.3675472 L5.99790476,25.3679245 Z M14.8438095,22.679434 L13.8558095,22.679434 L13.8558095,21.8639623 L13.3051429,21.8639623 L13.3051429,22.679434 L12.731619,22.679434 L12.731619,23.1686792 L13.3051429,23.1686792 L13.3051429,24.4398113 C13.3051429,25.0641509 13.5266667,25.435283 14.2249524,25.435283 C14.480381,25.435283 14.7758095,25.3566038 14.9630476,25.2271698 L14.7925714,24.7490566 C14.6165714,24.8503774 14.423619,24.9009434 14.2702857,24.9009434 C13.9750476,24.9009434 13.8558095,24.7209434 13.8558095,24.4509434 L13.8558095,23.1686792 L14.8438095,23.1686792 L14.8438095,22.679434 Z M19.88,22.6120755 C19.5394286,22.6120755 19.2952381,22.7696226 19.1419048,23.0058491 L19.1419048,22.6796226 L18.6024762,22.6796226 L18.6024762,25.3679245 L19.147619,25.3679245 L19.147619,23.8550943 C19.147619,23.4107547 19.3634286,23.1239623 19.7495238,23.1239623 C19.8687619,23.1239623 19.9937143,23.1407547 20.1186667,23.1915094 L20.300381,22.685283 C20.1695238,22.6345283 19.9992381,22.6120755 19.88,22.6120755 L19.88,22.6120755 Z M12.2660952,22.8932075 C11.9822857,22.7075472 11.5904762,22.6120755 11.1588571,22.6120755 C10.4718095,22.6120755 10.051619,22.9326415 10.051619,23.4669811 C10.051619,23.9056604 10.3582857,24.17 10.9657143,24.2543396 L11.244,24.2937736 C11.567619,24.3386792 11.743619,24.4513208 11.743619,24.6030189 C11.743619,24.8111321 11.5051429,24.9460377 11.1020952,24.9460377 C10.676381,24.9460377 10.3980952,24.8166038 10.1994286,24.6649057 L9.92114286,25.0867925 C10.3241905,25.3792453 10.8068571,25.4354717 11.096381,25.4354717 C11.8798095,25.4354717 12.3114286,25.0754717 12.3114286,24.5637736 C12.3114286,24.0913208 11.9820952,23.849434 11.3859048,23.7650943 L11.107619,23.7256604 C10.8521905,23.6918868 10.6249524,23.6132075 10.6249524,23.4332075 C10.6249524,23.2364151 10.8407619,23.1013208 11.164381,23.1013208 C11.5106667,23.1013208 11.8457143,23.2307547 12.0102857,23.3318868 L12.2660952,22.8932075 Z M20.4988571,24.0237736 C20.4988571,24.8392453 21.0495238,25.4354717 21.924,25.4354717 C22.3327619,25.4354717 22.6053333,25.3454717 22.9005714,25.1149057 L22.6167619,24.6930189 C22.3952381,24.850566 22.1624762,24.9349057 21.9070476,24.9349057 C21.4358095,24.9292453 21.0666667,24.5637736 21.0666667,24.0237736 C21.0666667,23.4837736 21.4358095,23.1183019 21.9070476,23.1126415 C22.1626667,23.1126415 22.3954286,23.1969811 22.6167619,23.3545283 L22.9005714,22.9326415 C22.6053333,22.7020755 22.3327619,22.6120755 21.924,22.6120755 C21.0497143,22.6120755 20.4988571,23.2081132 20.4988571,24.0237736 L20.4988571,24.0237736 Z M16.6834286,22.6120755 C15.8885714,22.6120755 15.3434286,23.1801887 15.3434286,24.0181132 C15.3434286,24.8730189 15.9112381,25.4354717 16.7232381,25.4354717 C17.132,25.4354717 17.5066667,25.3341509 17.836,25.0586792 L17.5464762,24.659434 C17.3194286,24.839434 17.0299048,24.940566 16.7573333,24.940566 C16.3769524,24.940566 15.9908571,24.7267925 15.9226667,24.2432075 L17.9497143,24.2432075 C17.9554286,24.1701887 17.9611429,24.0969811 17.9611429,24.0183019 C17.9552381,23.18 17.4441905,22.6120755 16.6834286,22.6120755 L16.6834286,22.6120755 Z M16.672,23.1126415 C17.0750476,23.1126415 17.347619,23.3713208 17.3874286,23.7932075 L15.9224762,23.7932075 C15.9737143,23.399434 16.2348571,23.1126415 16.672,23.1126415 L16.672,23.1126415 Z M9.32495238,24.0237736 L9.32495238,22.6796226 L8.77980952,22.6796226 L8.77980952,23.0058491 C8.59238095,22.7639623 8.28590476,22.6120755 7.89980952,22.6120755 C7.13904762,22.6120755 6.55980952,23.2026415 6.55980952,24.0237736 C6.55980952,24.8449057 7.13904762,25.4354717 7.89980952,25.4354717 C8.28590476,25.4354717 8.59238095,25.2835849 8.77980952,25.0418868 L8.77980952,25.3681132 L9.32495238,25.3681132 L9.32495238,24.0237736 Z M7.12761905,24.0237736 C7.12761905,23.5175472 7.4512381,23.1126415 7.97352381,23.1126415 C8.47314286,23.1126415 8.80247619,23.5007547 8.80247619,24.0237736 C8.80247619,24.5467925 8.47314286,24.9349057 7.97352381,24.9349057 C7.45142857,24.934717 7.12761905,24.5298113 7.12761905,24.0237736 L7.12761905,24.0237736 Z M28.0788571,22.6120755 C27.7382857,22.6120755 27.4940952,22.7696226 27.3407619,23.0058491 L27.3407619,22.6796226 L26.8013333,22.6796226 L26.8013333,25.3679245 L27.3464762,25.3679245 L27.3464762,23.8550943 C27.3464762,23.4107547 27.5622857,23.1239623 27.948381,23.1239623 C28.067619,23.1239623 28.1925714,23.1407547 28.3175238,23.1915094 L28.4992381,22.685283 C28.368381,22.6345283 28.1979048,22.6120755 28.0788571,22.6120755 L28.0788571,22.6120755 Z M32.452,24.9779245 C32.4899048,24.9779245 32.5253333,24.9849057 32.5586667,24.9988679 C32.5918095,25.0128302 32.6209524,25.0318868 32.6459048,25.0560377 C32.6706667,25.0801887 32.6902857,25.1084906 32.7045714,25.1411321 C32.7188571,25.1735849 32.7260952,25.2081132 32.7260952,25.244717 C32.7260952,25.2813208 32.7188571,25.3158491 32.7045714,25.3481132 C32.6902857,25.3803774 32.6706667,25.4086792 32.6459048,25.4328302 C32.6209524,25.4569811 32.592,25.4762264 32.5586667,25.4903774 C32.5253333,25.5045283 32.4899048,25.5116981 32.452,25.5116981 C32.4133333,25.5116981 32.3771429,25.5045283 32.3434286,25.4903774 C32.3097143,25.4762264 32.2805714,25.4569811 32.256,25.4328302 C32.2312381,25.4086792 32.2118095,25.3803774 32.1975238,25.3481132 C32.1832381,25.3158491 32.1761905,25.2813208 32.1761905,25.244717 C32.1761905,25.2081132 32.1832381,25.1735849 32.1975238,25.1411321 C32.2118095,25.1086792 32.2312381,25.0803774 32.256,25.0560377 C32.2805714,25.0316981 32.3097143,25.0126415 32.3434286,24.9988679 C32.3771429,24.9849057 32.4133333,24.9779245 32.452,24.9779245 Z M32.452,25.4528302 C32.4811429,25.4528302 32.5081905,25.4473585 32.5333333,25.4364151 C32.5584762,25.4254717 32.580381,25.410566 32.5992381,25.3918868 C32.6182857,25.3732075 32.6329524,25.3511321 32.6438095,25.3258491 C32.6546667,25.300566 32.66,25.2735849 32.66,25.244717 C32.66,25.2158491 32.6546667,25.1888679 32.6438095,25.1635849 C32.6329524,25.1383019 32.6182857,25.1162264 32.5992381,25.0975472 C32.580381,25.0786792 32.5582857,25.0641509 32.5333333,25.0533962 C32.5081905,25.0426415 32.4811429,25.0373585 32.452,25.0373585 C32.4224762,25.0373585 32.3948571,25.0426415 32.3691429,25.0533962 C32.3434286,25.0641509 32.3209524,25.0786792 32.3020952,25.0975472 C32.2832381,25.1162264 32.2681905,25.1383019 32.2575238,25.1635849 C32.2466667,25.1888679 32.2413333,25.2158491 32.2413333,25.244717 C32.2413333,25.2735849 32.2466667,25.300566 32.2575238,25.3258491 C32.2681905,25.3511321 32.2832381,25.3732075 32.3020952,25.3918868 C32.3209524,25.410566 32.3434286,25.4254717 32.3691429,25.4364151 C32.3948571,25.4473585 32.4224762,25.4528302 32.452,25.4528302 Z M32.4678095,25.12 C32.5,25.12 32.5247619,25.1269811 32.5420952,25.1413208 C32.5594286,25.1554717 32.5681905,25.174717 32.5681905,25.1992453 C32.5681905,25.2198113 32.5613333,25.2366038 32.5474286,25.25 C32.5335238,25.2632075 32.5139048,25.2715094 32.488381,25.2745283 L32.5702857,25.3681132 L32.5062857,25.3681132 L32.4302857,25.275283 L32.4059048,25.275283 L32.4059048,25.3681132 L32.352381,25.3681132 L32.352381,25.1201887 L32.4678095,25.1201887 L32.4678095,25.12 Z M32.4057143,25.1664151 L32.4057143,25.2324528 L32.4670476,25.2324528 C32.4811429,25.2324528 32.492381,25.2298113 32.5007619,25.2243396 C32.5091429,25.2188679 32.5133333,25.210566 32.5133333,25.1992453 C32.5133333,25.1883019 32.5091429,25.1801887 32.5007619,25.174717 C32.492381,25.1692453 32.4811429,25.1666038 32.4670476,25.1666038 L32.4057143,25.1666038 L32.4057143,25.1664151 Z M25.9893333,24.0237736 L25.9893333,22.6796226 L25.4441905,22.6796226 L25.4441905,23.0058491 C25.2567619,22.7639623 24.9502857,22.6120755 24.5641905,22.6120755 C23.8034286,22.6120755 23.2241905,23.2026415 23.2241905,24.0237736 C23.2241905,24.8449057 23.8032381,25.4354717 24.5641905,25.4354717 C24.9502857,25.4354717 25.2569524,25.2835849 25.4441905,25.0418868 L25.4441905,25.3681132 L25.9893333,25.3681132 L25.9893333,24.0237736 Z M23.792,24.0237736 C23.792,23.5175472 24.115619,23.1126415 24.6379048,23.1126415 C25.1375238,23.1126415 25.4668571,23.5007547 25.4668571,24.0237736 C25.4668571,24.5467925 25.1375238,24.9349057 24.6379048,24.9349057 C24.115619,24.934717 23.792,24.5298113 23.792,24.0237736 L23.792,24.0237736 Z M31.468381,24.0237736 L31.468381,21.5998113 L30.9232381,21.5998113 L30.9232381,23.0058491 C30.7358095,22.7639623 30.4293333,22.6120755 30.0430476,22.6120755 C29.2822857,22.6120755 28.7030476,23.2026415 28.7030476,24.0237736 C28.7030476,24.8449057 29.2822857,25.4354717 30.0430476,25.4354717 C30.4291429,25.4354717 30.7358095,25.2835849 30.9232381,25.0418868 L30.9232381,25.3681132 L31.468381,25.3681132 L31.468381,24.0237736 Z M29.2710476,24.0237736 C29.2710476,23.5175472 29.5946667,23.1126415 30.1171429,23.1126415 C30.6167619,23.1126415 30.9460952,23.5007547 30.9460952,24.0237736 C30.9460952,24.5467925 30.6167619,24.9349057 30.1171429,24.9349057 C29.5946667,24.934717 29.2710476,24.5298113 29.2710476,24.0237736 Z"
                                                                            fill="#FFFFFF"></path>
                                                                          <g>
                                                                            <rect
                                                                              fill="#F16122"
                                                                              x="11.632"
                                                                              y="2.22132075"
                                                                              width="9.82647619"
                                                                              height="15.8992453"></rect>
                                                                            <path
                                                                              d="M12.6464762,10.1709434 C12.6464762,6.9454717 14.1710476,4.07283019 16.5453333,2.22132075 C14.8089524,0.867358491 12.6180952,0.0594339623 10.2369524,0.0594339623 C4.59980952,0.0594339623 0.0299047619,4.58660377 0.0299047619,10.1709434 C0.0299047619,15.755283 4.59980952,20.2824528 10.2369524,20.2824528 C12.6180952,20.2824528 14.8089524,19.474717 16.5453333,18.120566 C14.1710476,16.2692453 12.6464762,13.3966038 12.6464762,10.1709434 Z"
                                                                              fill="#E91D25"></path>
                                                                            <path
                                                                              d="M32.1202215,17.0436704 L32.1202215,16.2152225 L32.2743743,16.2152225 L32.2743743,16.0460731 L31.8819048,16.0460731 L31.8819048,16.2152225 L32.0360576,16.2152225 L32.0360576,17.0441509 L32.1202215,17.0441509 L32.1202215,17.0436704 Z M32.8819048,17.0436704 L32.8819048,16.0441509 L32.761639,16.0441509 L32.6232115,16.7313206 L32.4847841,16.0441509 L32.3645183,16.0441509 L32.3645183,17.0436704 L32.4495681,17.0436704 L32.4495681,16.289706 L32.5793577,16.9398742 L32.6672868,16.9398742 L32.7970764,16.2882644 L32.7970764,17.0436704 L32.8819048,17.0436704 Z"
                                                                              fill="#F79E1D"></path>
                                                                            <path
                                                                              d="M33.0605714,10.1709434 C33.0605714,15.755283 28.4906667,20.2824528 22.8535238,20.2824528 C20.472381,20.2824528 18.2815238,19.474717 16.5451429,18.120566 C18.9194286,16.2690566 20.4438095,13.3964151 20.4438095,10.1709434 C20.4438095,6.9454717 18.9192381,4.07283019 16.5451429,2.22132075 C18.2815238,0.867358491 20.4721905,0.0594339623 22.8535238,0.0594339623 C28.4908571,0.0594339623 33.0605714,4.58660377 33.0605714,10.1709434 Z"
                                                                              fill="#F79E1D"></path>
                                                                          </g>
                                                                        </g>
                                                                      </g>
                                                                    </g>
                                                                  </g>
                                                                </g>
                                                              </svg>
                                                            </ul>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="Collapsible_arrow_container">
                                                      <img
                                                        src={minusIcon}
                                                        alt=""
                                                        className="Icon"
                                                      />
                                                    </div>
                                                  </div>
                                                }>
                                                <div className="cardList">
                                                  {myCart.payment_details &&
                                                    myCart.payment_details
                                                      .payfort_fort_cc &&
                                                    myCart.payment_details
                                                      .payfort_fort_cc.cards &&
                                                    myCart.payment_details.payfort_fort_cc.cards.map(
                                                      (card) => {
                                                        return (
                                                          <>
                                                            <div
                                                              className="row alignV"
                                                              onClick={() =>
                                                                this.onCardSelected(
                                                                  card
                                                                )
                                                              }>
                                                              <div className="col-md-1 col-2">
                                                                {this.checkCardType(
                                                                  card.card_number
                                                                ) === 'mada' ? (
                                                                    <span>
                                                                      <img
                                                                        src={
                                                                          madacards
                                                                        }
                                                                        width="35"
                                                                        className="MadaCard mada-card"
                                                                        alt="apple"
                                                                      />
                                                                    </span>
                                                                  ) : this.checkCardType(
                                                                    card.card_number
                                                                  ) ===
                                                                    'visa' ? (
                                                                      <svg
                                                                        width="35"
                                                                        className="Footerstyles__StyledIcon-sc-1eplnel-6 jauHmx"
                                                                        viewBox="0 0 48 30"
                                                                        data-di-res-id="acbdee86-cf30fe49"
                                                                        data-di-rand="1588938960140">
                                                                        <g
                                                                          stroke="none"
                                                                          stroke-width="1"
                                                                          fill="none"
                                                                          fill-rule="evenodd">
                                                                          <g
                                                                            transform="translate(-1095.000000, -950.000000)"
                                                                            fill-rule="nonzero">
                                                                            <g transform="translate(1095.000000, 950.000000)">
                                                                              <g>
                                                                                <rect
                                                                                  fill="#0E4595"
                                                                                  x="0"
                                                                                  y="0"
                                                                                  width="48"
                                                                                  height="30"
                                                                                  rx="2.56"></rect>
                                                                                <polygon
                                                                                  fill="#FFFFFF"
                                                                                  points="17.804608 21.2884076 19.939648 8.81942675 23.354688 8.81942675 21.218176 21.2884076 17.804608 21.2884076"></polygon>
                                                                                <path
                                                                                  d="M33.555712,9.08840764 C32.879104,8.83579618 31.818944,8.56471338 30.49504,8.56471338 C27.12064,8.56471338 24.74368,10.2557962 24.72352,12.6795541 C24.704448,14.4712739 26.420352,15.4706369 27.715712,16.0671338 C29.044992,16.6782166 29.49184,17.0680255 29.485568,17.6138217 C29.47712,18.4494904 28.424,18.8314013 27.442496,18.8314013 C26.075584,18.8314013 25.34944,18.6424841 24.227904,18.176879 L23.787904,17.9787898 L23.308544,20.7700637 C24.10624,21.1181529 25.581184,21.4197452 27.112576,21.4353503 C30.702336,21.4353503 33.032576,19.7635032 33.0592,17.1752866 C33.072128,15.7569427 32.162304,14.6774522 30.192128,13.7875159 C28.998464,13.2107643 28.267392,12.8257325 28.2752,12.2417834 C28.2752,11.7235032 28.893888,11.169172 30.230784,11.169172 C31.347584,11.1519745 32.156544,11.3943949 32.786752,11.646879 L33.092672,11.790828 L33.555712,9.08828025"
                                                                                  fill="#FFFFFF"></path>
                                                                                <path
                                                                                  d="M42.34336,8.81942675 L39.70464,8.81942675 C38.887104,8.81942675 38.275392,9.04152866 37.916352,9.85343949 L32.844672,21.2803822 L36.430592,21.2803822 C36.430592,21.2803822 37.017024,19.7438854 37.149632,19.4066242 C37.541504,19.4066242 41.025024,19.4119745 41.523136,19.4119745 C41.625216,19.8484076 41.938496,21.2803185 41.938496,21.2803185 L45.107328,21.2803822 L42.343296,8.81929936 L42.34336,8.81942675 Z M38.156608,16.870828 C38.43904,16.1523567 39.517248,13.3852866 39.517248,13.3852866 C39.497024,13.4184076 39.797568,12.6633121 39.970048,12.1951592 L40.200832,13.2703185 C40.200832,13.2703185 40.85472,16.2465605 40.99136,16.8707643 L38.156608,16.8707643 L38.156608,16.870828 Z"
                                                                                  fill="#FFFFFF"></path>
                                                                                <path
                                                                                  d="M14.905792,8.81942675 L11.562432,17.3223567 L11.206144,15.5944586 C10.583744,13.6024841 8.644544,11.4443949 6.476672,10.3638854 L9.533696,21.2685987 L13.14688,21.2644586 L18.523136,8.81955414 L14.905856,8.81955414"
                                                                                  fill="#FFFFFF"></path>
                                                                                <path
                                                                                  d="M8.44288,8.81942675 L2.93632,8.81942675 L2.892608,9.0788535 C7.176768,10.1109554 10.011456,12.6051592 11.18816,15.6020382 L9.990848,9.87210191 C9.784128,9.08261146 9.184448,8.84700637 8.442816,8.81949045"
                                                                                  fill="#F2AE14"></path>
                                                                              </g>
                                                                            </g>
                                                                          </g>
                                                                        </g>
                                                                      </svg>
                                                                    ) : this.checkCardType(
                                                                      card.card_number
                                                                    ) ===
                                                                      'mastercard' ? (
                                                                        <svg
                                                                          width="35"
                                                                          className="Footerstyles__StyledIcon-sc-1eplnel-6 jauHmx master"
                                                                          viewBox="0 0 48 30"
                                                                          data-di-res-id="e0b91613-f924f21f"
                                                                          data-di-rand="1588938960139">
                                                                          <g
                                                                            stroke="none"
                                                                            stroke-width="1"
                                                                            fill="none"
                                                                            fill-rule="evenodd">
                                                                            <g
                                                                              transform="translate(-1183.000000, -950.000000)"
                                                                              fill-rule="nonzero">
                                                                              <g transform="translate(1183.000000, 950.000000)">
                                                                                <g>
                                                                                  <path
                                                                                    d="M46.2182857,29.9396226 L1.61980952,29.9396226 C0.728952381,29.9396226 0,29.2175472 0,28.3350943 L0,1.6045283 C0,0.722075472 0.728952381,0 1.61980952,0 L46.2182857,0 C47.1091429,0 47.8380952,0.722075472 47.8380952,1.6045283 L47.8380952,28.3350943 C47.8380952,29.2175472 47.1091429,29.9396226 46.2182857,29.9396226 Z"
                                                                                    fill="#010101"></path>
                                                                                  <g transform="translate(7.428571, 2.075472)">
                                                                                    <path
                                                                                      d="M5.99790476,25.3679245 L5.99790476,23.6750943 C5.99790476,23.0396226 5.61180952,22.6177358 4.95314286,22.6120755 C4.60685714,22.6064151 4.24914286,22.7132075 3.9992381,23.0901887 C3.81180952,22.7920755 3.51657143,22.6120755 3.10209524,22.6120755 C2.81257143,22.6120755 2.50590476,22.6907547 2.28457143,23.0058491 L2.28457143,22.6796226 L1.73942857,22.6796226 L1.73942857,25.3679245 L2.29028571,25.3679245 L2.29028571,23.8267925 C2.29028571,23.36 2.57409524,23.1124528 2.97733333,23.1124528 C3.36914286,23.1124528 3.59047619,23.3654717 3.59047619,23.8211321 L3.59047619,25.3677358 L4.14133333,25.3677358 L4.14133333,23.8266038 C4.14133333,23.3598113 4.43657143,23.1122642 4.82838095,23.1122642 C5.23142857,23.1122642 5.4472381,23.365283 5.4472381,23.8209434 L5.4472381,25.3675472 L5.99790476,25.3675472 L5.99790476,25.3679245 Z M14.8438095,22.679434 L13.8558095,22.679434 L13.8558095,21.8639623 L13.3051429,21.8639623 L13.3051429,22.679434 L12.731619,22.679434 L12.731619,23.1686792 L13.3051429,23.1686792 L13.3051429,24.4398113 C13.3051429,25.0641509 13.5266667,25.435283 14.2249524,25.435283 C14.480381,25.435283 14.7758095,25.3566038 14.9630476,25.2271698 L14.7925714,24.7490566 C14.6165714,24.8503774 14.423619,24.9009434 14.2702857,24.9009434 C13.9750476,24.9009434 13.8558095,24.7209434 13.8558095,24.4509434 L13.8558095,23.1686792 L14.8438095,23.1686792 L14.8438095,22.679434 Z M19.88,22.6120755 C19.5394286,22.6120755 19.2952381,22.7696226 19.1419048,23.0058491 L19.1419048,22.6796226 L18.6024762,22.6796226 L18.6024762,25.3679245 L19.147619,25.3679245 L19.147619,23.8550943 C19.147619,23.4107547 19.3634286,23.1239623 19.7495238,23.1239623 C19.8687619,23.1239623 19.9937143,23.1407547 20.1186667,23.1915094 L20.300381,22.685283 C20.1695238,22.6345283 19.9992381,22.6120755 19.88,22.6120755 L19.88,22.6120755 Z M12.2660952,22.8932075 C11.9822857,22.7075472 11.5904762,22.6120755 11.1588571,22.6120755 C10.4718095,22.6120755 10.051619,22.9326415 10.051619,23.4669811 C10.051619,23.9056604 10.3582857,24.17 10.9657143,24.2543396 L11.244,24.2937736 C11.567619,24.3386792 11.743619,24.4513208 11.743619,24.6030189 C11.743619,24.8111321 11.5051429,24.9460377 11.1020952,24.9460377 C10.676381,24.9460377 10.3980952,24.8166038 10.1994286,24.6649057 L9.92114286,25.0867925 C10.3241905,25.3792453 10.8068571,25.4354717 11.096381,25.4354717 C11.8798095,25.4354717 12.3114286,25.0754717 12.3114286,24.5637736 C12.3114286,24.0913208 11.9820952,23.849434 11.3859048,23.7650943 L11.107619,23.7256604 C10.8521905,23.6918868 10.6249524,23.6132075 10.6249524,23.4332075 C10.6249524,23.2364151 10.8407619,23.1013208 11.164381,23.1013208 C11.5106667,23.1013208 11.8457143,23.2307547 12.0102857,23.3318868 L12.2660952,22.8932075 Z M20.4988571,24.0237736 C20.4988571,24.8392453 21.0495238,25.4354717 21.924,25.4354717 C22.3327619,25.4354717 22.6053333,25.3454717 22.9005714,25.1149057 L22.6167619,24.6930189 C22.3952381,24.850566 22.1624762,24.9349057 21.9070476,24.9349057 C21.4358095,24.9292453 21.0666667,24.5637736 21.0666667,24.0237736 C21.0666667,23.4837736 21.4358095,23.1183019 21.9070476,23.1126415 C22.1626667,23.1126415 22.3954286,23.1969811 22.6167619,23.3545283 L22.9005714,22.9326415 C22.6053333,22.7020755 22.3327619,22.6120755 21.924,22.6120755 C21.0497143,22.6120755 20.4988571,23.2081132 20.4988571,24.0237736 L20.4988571,24.0237736 Z M16.6834286,22.6120755 C15.8885714,22.6120755 15.3434286,23.1801887 15.3434286,24.0181132 C15.3434286,24.8730189 15.9112381,25.4354717 16.7232381,25.4354717 C17.132,25.4354717 17.5066667,25.3341509 17.836,25.0586792 L17.5464762,24.659434 C17.3194286,24.839434 17.0299048,24.940566 16.7573333,24.940566 C16.3769524,24.940566 15.9908571,24.7267925 15.9226667,24.2432075 L17.9497143,24.2432075 C17.9554286,24.1701887 17.9611429,24.0969811 17.9611429,24.0183019 C17.9552381,23.18 17.4441905,22.6120755 16.6834286,22.6120755 L16.6834286,22.6120755 Z M16.672,23.1126415 C17.0750476,23.1126415 17.347619,23.3713208 17.3874286,23.7932075 L15.9224762,23.7932075 C15.9737143,23.399434 16.2348571,23.1126415 16.672,23.1126415 L16.672,23.1126415 Z M9.32495238,24.0237736 L9.32495238,22.6796226 L8.77980952,22.6796226 L8.77980952,23.0058491 C8.59238095,22.7639623 8.28590476,22.6120755 7.89980952,22.6120755 C7.13904762,22.6120755 6.55980952,23.2026415 6.55980952,24.0237736 C6.55980952,24.8449057 7.13904762,25.4354717 7.89980952,25.4354717 C8.28590476,25.4354717 8.59238095,25.2835849 8.77980952,25.0418868 L8.77980952,25.3681132 L9.32495238,25.3681132 L9.32495238,24.0237736 Z M7.12761905,24.0237736 C7.12761905,23.5175472 7.4512381,23.1126415 7.97352381,23.1126415 C8.47314286,23.1126415 8.80247619,23.5007547 8.80247619,24.0237736 C8.80247619,24.5467925 8.47314286,24.9349057 7.97352381,24.9349057 C7.45142857,24.934717 7.12761905,24.5298113 7.12761905,24.0237736 L7.12761905,24.0237736 Z M28.0788571,22.6120755 C27.7382857,22.6120755 27.4940952,22.7696226 27.3407619,23.0058491 L27.3407619,22.6796226 L26.8013333,22.6796226 L26.8013333,25.3679245 L27.3464762,25.3679245 L27.3464762,23.8550943 C27.3464762,23.4107547 27.5622857,23.1239623 27.948381,23.1239623 C28.067619,23.1239623 28.1925714,23.1407547 28.3175238,23.1915094 L28.4992381,22.685283 C28.368381,22.6345283 28.1979048,22.6120755 28.0788571,22.6120755 L28.0788571,22.6120755 Z M32.452,24.9779245 C32.4899048,24.9779245 32.5253333,24.9849057 32.5586667,24.9988679 C32.5918095,25.0128302 32.6209524,25.0318868 32.6459048,25.0560377 C32.6706667,25.0801887 32.6902857,25.1084906 32.7045714,25.1411321 C32.7188571,25.1735849 32.7260952,25.2081132 32.7260952,25.244717 C32.7260952,25.2813208 32.7188571,25.3158491 32.7045714,25.3481132 C32.6902857,25.3803774 32.6706667,25.4086792 32.6459048,25.4328302 C32.6209524,25.4569811 32.592,25.4762264 32.5586667,25.4903774 C32.5253333,25.5045283 32.4899048,25.5116981 32.452,25.5116981 C32.4133333,25.5116981 32.3771429,25.5045283 32.3434286,25.4903774 C32.3097143,25.4762264 32.2805714,25.4569811 32.256,25.4328302 C32.2312381,25.4086792 32.2118095,25.3803774 32.1975238,25.3481132 C32.1832381,25.3158491 32.1761905,25.2813208 32.1761905,25.244717 C32.1761905,25.2081132 32.1832381,25.1735849 32.1975238,25.1411321 C32.2118095,25.1086792 32.2312381,25.0803774 32.256,25.0560377 C32.2805714,25.0316981 32.3097143,25.0126415 32.3434286,24.9988679 C32.3771429,24.9849057 32.4133333,24.9779245 32.452,24.9779245 Z M32.452,25.4528302 C32.4811429,25.4528302 32.5081905,25.4473585 32.5333333,25.4364151 C32.5584762,25.4254717 32.580381,25.410566 32.5992381,25.3918868 C32.6182857,25.3732075 32.6329524,25.3511321 32.6438095,25.3258491 C32.6546667,25.300566 32.66,25.2735849 32.66,25.244717 C32.66,25.2158491 32.6546667,25.1888679 32.6438095,25.1635849 C32.6329524,25.1383019 32.6182857,25.1162264 32.5992381,25.0975472 C32.580381,25.0786792 32.5582857,25.0641509 32.5333333,25.0533962 C32.5081905,25.0426415 32.4811429,25.0373585 32.452,25.0373585 C32.4224762,25.0373585 32.3948571,25.0426415 32.3691429,25.0533962 C32.3434286,25.0641509 32.3209524,25.0786792 32.3020952,25.0975472 C32.2832381,25.1162264 32.2681905,25.1383019 32.2575238,25.1635849 C32.2466667,25.1888679 32.2413333,25.2158491 32.2413333,25.244717 C32.2413333,25.2735849 32.2466667,25.300566 32.2575238,25.3258491 C32.2681905,25.3511321 32.2832381,25.3732075 32.3020952,25.3918868 C32.3209524,25.410566 32.3434286,25.4254717 32.3691429,25.4364151 C32.3948571,25.4473585 32.4224762,25.4528302 32.452,25.4528302 Z M32.4678095,25.12 C32.5,25.12 32.5247619,25.1269811 32.5420952,25.1413208 C32.5594286,25.1554717 32.5681905,25.174717 32.5681905,25.1992453 C32.5681905,25.2198113 32.5613333,25.2366038 32.5474286,25.25 C32.5335238,25.2632075 32.5139048,25.2715094 32.488381,25.2745283 L32.5702857,25.3681132 L32.5062857,25.3681132 L32.4302857,25.275283 L32.4059048,25.275283 L32.4059048,25.3681132 L32.352381,25.3681132 L32.352381,25.1201887 L32.4678095,25.1201887 L32.4678095,25.12 Z M32.4057143,25.1664151 L32.4057143,25.2324528 L32.4670476,25.2324528 C32.4811429,25.2324528 32.492381,25.2298113 32.5007619,25.2243396 C32.5091429,25.2188679 32.5133333,25.210566 32.5133333,25.1992453 C32.5133333,25.1883019 32.5091429,25.1801887 32.5007619,25.174717 C32.492381,25.1692453 32.4811429,25.1666038 32.4670476,25.1666038 L32.4057143,25.1666038 L32.4057143,25.1664151 Z M25.9893333,24.0237736 L25.9893333,22.6796226 L25.4441905,22.6796226 L25.4441905,23.0058491 C25.2567619,22.7639623 24.9502857,22.6120755 24.5641905,22.6120755 C23.8034286,22.6120755 23.2241905,23.2026415 23.2241905,24.0237736 C23.2241905,24.8449057 23.8032381,25.4354717 24.5641905,25.4354717 C24.9502857,25.4354717 25.2569524,25.2835849 25.4441905,25.0418868 L25.4441905,25.3681132 L25.9893333,25.3681132 L25.9893333,24.0237736 Z M23.792,24.0237736 C23.792,23.5175472 24.115619,23.1126415 24.6379048,23.1126415 C25.1375238,23.1126415 25.4668571,23.5007547 25.4668571,24.0237736 C25.4668571,24.5467925 25.1375238,24.9349057 24.6379048,24.9349057 C24.115619,24.934717 23.792,24.5298113 23.792,24.0237736 L23.792,24.0237736 Z M31.468381,24.0237736 L31.468381,21.5998113 L30.9232381,21.5998113 L30.9232381,23.0058491 C30.7358095,22.7639623 30.4293333,22.6120755 30.0430476,22.6120755 C29.2822857,22.6120755 28.7030476,23.2026415 28.7030476,24.0237736 C28.7030476,24.8449057 29.2822857,25.4354717 30.0430476,25.4354717 C30.4291429,25.4354717 30.7358095,25.2835849 30.9232381,25.0418868 L30.9232381,25.3681132 L31.468381,25.3681132 L31.468381,24.0237736 Z M29.2710476,24.0237736 C29.2710476,23.5175472 29.5946667,23.1126415 30.1171429,23.1126415 C30.6167619,23.1126415 30.9460952,23.5007547 30.9460952,24.0237736 C30.9460952,24.5467925 30.6167619,24.9349057 30.1171429,24.9349057 C29.5946667,24.934717 29.2710476,24.5298113 29.2710476,24.0237736 Z"
                                                                                      fill="#FFFFFF"></path>
                                                                                    <g>
                                                                                      <rect
                                                                                        fill="#F16122"
                                                                                        x="11.632"
                                                                                        y="2.22132075"
                                                                                        width="9.82647619"
                                                                                        height="15.8992453"></rect>
                                                                                      <path
                                                                                        d="M12.6464762,10.1709434 C12.6464762,6.9454717 14.1710476,4.07283019 16.5453333,2.22132075 C14.8089524,0.867358491 12.6180952,0.0594339623 10.2369524,0.0594339623 C4.59980952,0.0594339623 0.0299047619,4.58660377 0.0299047619,10.1709434 C0.0299047619,15.755283 4.59980952,20.2824528 10.2369524,20.2824528 C12.6180952,20.2824528 14.8089524,19.474717 16.5453333,18.120566 C14.1710476,16.2692453 12.6464762,13.3966038 12.6464762,10.1709434 Z"
                                                                                        fill="#E91D25"></path>
                                                                                      <path
                                                                                        d="M32.1202215,17.0436704 L32.1202215,16.2152225 L32.2743743,16.2152225 L32.2743743,16.0460731 L31.8819048,16.0460731 L31.8819048,16.2152225 L32.0360576,16.2152225 L32.0360576,17.0441509 L32.1202215,17.0441509 L32.1202215,17.0436704 Z M32.8819048,17.0436704 L32.8819048,16.0441509 L32.761639,16.0441509 L32.6232115,16.7313206 L32.4847841,16.0441509 L32.3645183,16.0441509 L32.3645183,17.0436704 L32.4495681,17.0436704 L32.4495681,16.289706 L32.5793577,16.9398742 L32.6672868,16.9398742 L32.7970764,16.2882644 L32.7970764,17.0436704 L32.8819048,17.0436704 Z"
                                                                                        fill="#F79E1D"></path>
                                                                                      <path
                                                                                        d="M33.0605714,10.1709434 C33.0605714,15.755283 28.4906667,20.2824528 22.8535238,20.2824528 C20.472381,20.2824528 18.2815238,19.474717 16.5451429,18.120566 C18.9194286,16.2690566 20.4438095,13.3964151 20.4438095,10.1709434 C20.4438095,6.9454717 18.9192381,4.07283019 16.5451429,2.22132075 C18.2815238,0.867358491 20.4721905,0.0594339623 22.8535238,0.0594339623 C28.4908571,0.0594339623 33.0605714,4.58660377 33.0605714,10.1709434 Z"
                                                                                        fill="#F79E1D"></path>
                                                                                    </g>
                                                                                  </g>
                                                                                </g>
                                                                              </g>
                                                                            </g>
                                                                          </g>
                                                                        </svg>
                                                                      ) : (
                                                                        ''
                                                                      )}
                                                              </div>
                                                              <div class="col-md-3 col-10">
                                                                <div class="form-check">
                                                                  <label class="form-check-label  fontTxt">
                                                                    <input
                                                                      type="checkbox"
                                                                      checked={
                                                                        this
                                                                          .state
                                                                          .card ===
                                                                        card
                                                                      }
                                                                      className="form-check-input"
                                                                    />
                                                                    {
                                                                      card.name_on_card
                                                                    }
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              <div class="col-md-3 col-5">
                                                                <p className="fontTxt dir-ltr ">
                                                                  {
                                                                    card.card_number
                                                                  }
                                                                </p>
                                                              </div>
                                                              <div class="col-md-2 col-3">
                                                                <p className="fontTxt">
                                                                  {card.expiry_date.slice(
                                                                    2
                                                                  ) +
                                                                    '/' +
                                                                    card.expiry_date.slice(
                                                                      0,
                                                                      2
                                                                    )}
                                                                </p>
                                                              </div>
                                                              <div class="col-md-3 col-4">
                                                                <input
                                                                  type="number"
                                                                  className={`form-control textCVV fontTxt ${this.state
                                                                    .card ===
                                                                    card
                                                                    ? this
                                                                      .state
                                                                      .card
                                                                      .cvv &&
                                                                      this
                                                                        .state
                                                                        .card
                                                                        .cvv
                                                                        .length ===
                                                                      3
                                                                      ? 'bb-green'
                                                                      : 'bb-red'
                                                                    : ''
                                                                    }`}
                                                                  onChange={(
                                                                    e
                                                                  ) => {
                                                                    let card = this
                                                                      .state
                                                                      .card;
                                                                    card.cvv =
                                                                      e.target.value;
                                                                    this.setState(
                                                                      {
                                                                        card: card,
                                                                      }
                                                                    );
                                                                  }}
                                                                  disabled={
                                                                    this.state
                                                                      .card !==
                                                                    card
                                                                  }
                                                                  value={
                                                                    this.state
                                                                      .card ===
                                                                      card ? this.state
                                                                        .card.cvv : ''
                                                                  }
                                                                  placeholder={formatMessage(
                                                                    messages.card_security_code
                                                                  )}
                                                                  onInput={(
                                                                    e
                                                                  ) => {
                                                                    e.target.value = e.target.value.substring(
                                                                      0,
                                                                      3
                                                                    );
                                                                  }}
                                                                />
                                                              </div>
                                                            </div>
                                                            <hr />
                                                          </>
                                                        );
                                                      }
                                                    )}

                                                  {this.state
                                                    .displayOtherCardTag && (
                                                      <div
                                                        class="form-check"
                                                        onClick={
                                                          this.onOtherCardSelected
                                                        }>
                                                        <label class="form-check-label addnew">
                                                          <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={
                                                              this.state.otherCard
                                                            }
                                                          />
                                                          <p>
                                                            <FormattedMessage
                                                              id="paybycard.UseOtherCard"
                                                              defaultMessage="Use other card"
                                                            />
                                                          </p>
                                                        </label>
                                                      </div>
                                                    )}
                                                </div>
                                                {this.state.otherCard && (
                                                  <div>
                                                    <div className="CardForm">
                                                      <div className="form-group">
                                                        <label for="pwd">
                                                          <FormattedMessage
                                                            id="paybycard.NameOnCard"
                                                            defaultMessage="Name on card"
                                                          />
                                                          <span>*</span>
                                                        </label>
                                                        <input
                                                          type="text"
                                                          maxLength="50"
                                                          className={`form-control ${this.state
                                                            .card_holder_name_valid
                                                            ? 'bb-green'
                                                            : 'bb-red'
                                                            }`}
                                                          placeholder={formatMessage(
                                                            messages.card_holder_name
                                                          )}
                                                          name="card_holder_name"
                                                          onChange={
                                                            this
                                                              .onChangeHandlePayment
                                                          }
                                                          onInput={(e) =>
                                                            (e.target.value = e.target.value.replace(
                                                              /[^a-zA-Z\s:]/g,
                                                              ''
                                                            ))
                                                          }
                                                        />
                                                        {this.state
                                                          .card_holder_name &&
                                                          !this.state
                                                            .card_holder_name_valid && (
                                                            <p className="error_card">
                                                              <FormattedMessage
                                                                id="paybycard.NameError"
                                                                defaultMessage="Card holder's name is invalid"
                                                              />
                                                            </p>
                                                          )}
                                                      </div>
                                                      <div className="form-group cardNumber">
                                                        <label for="email">
                                                          <FormattedMessage
                                                            id="paybycard.CardNumber"
                                                            defaultMessage="Card number"
                                                          />
                                                          <span>*</span>
                                                        </label>
                                                        <input
                                                          type="number"
                                                          className={`form-control number ${this.state
                                                            .card_number_valid
                                                            ? 'bb-green'
                                                            : 'bb-red'
                                                            }`}
                                                          placeholder={formatMessage(
                                                            messages.card_number
                                                          )}
                                                          name="card_number"
                                                          onChange={
                                                            this
                                                              .onChangeHandlePayment
                                                          }
                                                          onInput={(e) =>
                                                            (e.target.value = e.target.value.replace(
                                                              /\D/g,
                                                              ''
                                                            ))
                                                          }
                                                        />

                                                        {/* Mada icons inside input box */}
                                                        {this.state
                                                          .card_type ===
                                                          'mada' && (
                                                            <img
                                                              className="MadaIcon"
                                                              src={madacards}
                                                              alt="cardIcon"
                                                            />
                                                          )}
                                                        {/* Visa icons inside input box */}
                                                        {this.state
                                                          .card_type ===
                                                          'visa' && (
                                                            <svg
                                                              width="50px"
                                                              className="visaIcon"
                                                              viewBox="0 0 48 30"
                                                              data-di-res-id="acbdee86-cf30fe49"
                                                              data-di-rand="1588938960140">
                                                              <g
                                                                stroke="none"
                                                                stroke-width="1"
                                                                fill="none"
                                                                fill-rule="evenodd">
                                                                <g
                                                                  transform="translate(-1095.000000, -950.000000)"
                                                                  fill-rule="nonzero">
                                                                  <g transform="translate(1095.000000, 950.000000)">
                                                                    <g>
                                                                      <rect
                                                                        fill="#0E4595"
                                                                        x="0"
                                                                        y="0"
                                                                        width="48"
                                                                        height="30"
                                                                        rx="2.56"></rect>
                                                                      <polygon
                                                                        fill="#FFFFFF"
                                                                        points="17.804608 21.2884076 19.939648 8.81942675 23.354688 8.81942675 21.218176 21.2884076 17.804608 21.2884076"></polygon>
                                                                      <path
                                                                        d="M33.555712,9.08840764 C32.879104,8.83579618 31.818944,8.56471338 30.49504,8.56471338 C27.12064,8.56471338 24.74368,10.2557962 24.72352,12.6795541 C24.704448,14.4712739 26.420352,15.4706369 27.715712,16.0671338 C29.044992,16.6782166 29.49184,17.0680255 29.485568,17.6138217 C29.47712,18.4494904 28.424,18.8314013 27.442496,18.8314013 C26.075584,18.8314013 25.34944,18.6424841 24.227904,18.176879 L23.787904,17.9787898 L23.308544,20.7700637 C24.10624,21.1181529 25.581184,21.4197452 27.112576,21.4353503 C30.702336,21.4353503 33.032576,19.7635032 33.0592,17.1752866 C33.072128,15.7569427 32.162304,14.6774522 30.192128,13.7875159 C28.998464,13.2107643 28.267392,12.8257325 28.2752,12.2417834 C28.2752,11.7235032 28.893888,11.169172 30.230784,11.169172 C31.347584,11.1519745 32.156544,11.3943949 32.786752,11.646879 L33.092672,11.790828 L33.555712,9.08828025"
                                                                        fill="#FFFFFF"></path>
                                                                      <path
                                                                        d="M42.34336,8.81942675 L39.70464,8.81942675 C38.887104,8.81942675 38.275392,9.04152866 37.916352,9.85343949 L32.844672,21.2803822 L36.430592,21.2803822 C36.430592,21.2803822 37.017024,19.7438854 37.149632,19.4066242 C37.541504,19.4066242 41.025024,19.4119745 41.523136,19.4119745 C41.625216,19.8484076 41.938496,21.2803185 41.938496,21.2803185 L45.107328,21.2803822 L42.343296,8.81929936 L42.34336,8.81942675 Z M38.156608,16.870828 C38.43904,16.1523567 39.517248,13.3852866 39.517248,13.3852866 C39.497024,13.4184076 39.797568,12.6633121 39.970048,12.1951592 L40.200832,13.2703185 C40.200832,13.2703185 40.85472,16.2465605 40.99136,16.8707643 L38.156608,16.8707643 L38.156608,16.870828 Z"
                                                                        fill="#FFFFFF"></path>
                                                                      <path
                                                                        d="M14.905792,8.81942675 L11.562432,17.3223567 L11.206144,15.5944586 C10.583744,13.6024841 8.644544,11.4443949 6.476672,10.3638854 L9.533696,21.2685987 L13.14688,21.2644586 L18.523136,8.81955414 L14.905856,8.81955414"
                                                                        fill="#FFFFFF"></path>
                                                                      <path
                                                                        d="M8.44288,8.81942675 L2.93632,8.81942675 L2.892608,9.0788535 C7.176768,10.1109554 10.011456,12.6051592 11.18816,15.6020382 L9.990848,9.87210191 C9.784128,9.08261146 9.184448,8.84700637 8.442816,8.81949045"
                                                                        fill="#F2AE14"></path>
                                                                    </g>
                                                                  </g>
                                                                </g>
                                                              </g>
                                                            </svg>
                                                          )}
                                                        {/* MasterCard icons inside input box */}
                                                        {this.state
                                                          .card_type ===
                                                          'mastercard' && (
                                                            <svg
                                                              width="50px"
                                                              className="MasterIcon"
                                                              viewBox="0 0 48 30"
                                                              data-di-res-id="e0b91613-f924f21f"
                                                              data-di-rand="1588938960139">
                                                              <g
                                                                stroke="none"
                                                                stroke-width="1"
                                                                fill="none"
                                                                fill-rule="evenodd">
                                                                <g
                                                                  transform="translate(-1183.000000, -950.000000)"
                                                                  fill-rule="nonzero">
                                                                  <g transform="translate(1183.000000, 950.000000)">
                                                                    <g>
                                                                      <path
                                                                        d="M46.2182857,29.9396226 L1.61980952,29.9396226 C0.728952381,29.9396226 0,29.2175472 0,28.3350943 L0,1.6045283 C0,0.722075472 0.728952381,0 1.61980952,0 L46.2182857,0 C47.1091429,0 47.8380952,0.722075472 47.8380952,1.6045283 L47.8380952,28.3350943 C47.8380952,29.2175472 47.1091429,29.9396226 46.2182857,29.9396226 Z"
                                                                        fill="#010101"></path>
                                                                      <g transform="translate(7.428571, 2.075472)">
                                                                        <path
                                                                          d="M5.99790476,25.3679245 L5.99790476,23.6750943 C5.99790476,23.0396226 5.61180952,22.6177358 4.95314286,22.6120755 C4.60685714,22.6064151 4.24914286,22.7132075 3.9992381,23.0901887 C3.81180952,22.7920755 3.51657143,22.6120755 3.10209524,22.6120755 C2.81257143,22.6120755 2.50590476,22.6907547 2.28457143,23.0058491 L2.28457143,22.6796226 L1.73942857,22.6796226 L1.73942857,25.3679245 L2.29028571,25.3679245 L2.29028571,23.8267925 C2.29028571,23.36 2.57409524,23.1124528 2.97733333,23.1124528 C3.36914286,23.1124528 3.59047619,23.3654717 3.59047619,23.8211321 L3.59047619,25.3677358 L4.14133333,25.3677358 L4.14133333,23.8266038 C4.14133333,23.3598113 4.43657143,23.1122642 4.82838095,23.1122642 C5.23142857,23.1122642 5.4472381,23.365283 5.4472381,23.8209434 L5.4472381,25.3675472 L5.99790476,25.3675472 L5.99790476,25.3679245 Z M14.8438095,22.679434 L13.8558095,22.679434 L13.8558095,21.8639623 L13.3051429,21.8639623 L13.3051429,22.679434 L12.731619,22.679434 L12.731619,23.1686792 L13.3051429,23.1686792 L13.3051429,24.4398113 C13.3051429,25.0641509 13.5266667,25.435283 14.2249524,25.435283 C14.480381,25.435283 14.7758095,25.3566038 14.9630476,25.2271698 L14.7925714,24.7490566 C14.6165714,24.8503774 14.423619,24.9009434 14.2702857,24.9009434 C13.9750476,24.9009434 13.8558095,24.7209434 13.8558095,24.4509434 L13.8558095,23.1686792 L14.8438095,23.1686792 L14.8438095,22.679434 Z M19.88,22.6120755 C19.5394286,22.6120755 19.2952381,22.7696226 19.1419048,23.0058491 L19.1419048,22.6796226 L18.6024762,22.6796226 L18.6024762,25.3679245 L19.147619,25.3679245 L19.147619,23.8550943 C19.147619,23.4107547 19.3634286,23.1239623 19.7495238,23.1239623 C19.8687619,23.1239623 19.9937143,23.1407547 20.1186667,23.1915094 L20.300381,22.685283 C20.1695238,22.6345283 19.9992381,22.6120755 19.88,22.6120755 L19.88,22.6120755 Z M12.2660952,22.8932075 C11.9822857,22.7075472 11.5904762,22.6120755 11.1588571,22.6120755 C10.4718095,22.6120755 10.051619,22.9326415 10.051619,23.4669811 C10.051619,23.9056604 10.3582857,24.17 10.9657143,24.2543396 L11.244,24.2937736 C11.567619,24.3386792 11.743619,24.4513208 11.743619,24.6030189 C11.743619,24.8111321 11.5051429,24.9460377 11.1020952,24.9460377 C10.676381,24.9460377 10.3980952,24.8166038 10.1994286,24.6649057 L9.92114286,25.0867925 C10.3241905,25.3792453 10.8068571,25.4354717 11.096381,25.4354717 C11.8798095,25.4354717 12.3114286,25.0754717 12.3114286,24.5637736 C12.3114286,24.0913208 11.9820952,23.849434 11.3859048,23.7650943 L11.107619,23.7256604 C10.8521905,23.6918868 10.6249524,23.6132075 10.6249524,23.4332075 C10.6249524,23.2364151 10.8407619,23.1013208 11.164381,23.1013208 C11.5106667,23.1013208 11.8457143,23.2307547 12.0102857,23.3318868 L12.2660952,22.8932075 Z M20.4988571,24.0237736 C20.4988571,24.8392453 21.0495238,25.4354717 21.924,25.4354717 C22.3327619,25.4354717 22.6053333,25.3454717 22.9005714,25.1149057 L22.6167619,24.6930189 C22.3952381,24.850566 22.1624762,24.9349057 21.9070476,24.9349057 C21.4358095,24.9292453 21.0666667,24.5637736 21.0666667,24.0237736 C21.0666667,23.4837736 21.4358095,23.1183019 21.9070476,23.1126415 C22.1626667,23.1126415 22.3954286,23.1969811 22.6167619,23.3545283 L22.9005714,22.9326415 C22.6053333,22.7020755 22.3327619,22.6120755 21.924,22.6120755 C21.0497143,22.6120755 20.4988571,23.2081132 20.4988571,24.0237736 L20.4988571,24.0237736 Z M16.6834286,22.6120755 C15.8885714,22.6120755 15.3434286,23.1801887 15.3434286,24.0181132 C15.3434286,24.8730189 15.9112381,25.4354717 16.7232381,25.4354717 C17.132,25.4354717 17.5066667,25.3341509 17.836,25.0586792 L17.5464762,24.659434 C17.3194286,24.839434 17.0299048,24.940566 16.7573333,24.940566 C16.3769524,24.940566 15.9908571,24.7267925 15.9226667,24.2432075 L17.9497143,24.2432075 C17.9554286,24.1701887 17.9611429,24.0969811 17.9611429,24.0183019 C17.9552381,23.18 17.4441905,22.6120755 16.6834286,22.6120755 L16.6834286,22.6120755 Z M16.672,23.1126415 C17.0750476,23.1126415 17.347619,23.3713208 17.3874286,23.7932075 L15.9224762,23.7932075 C15.9737143,23.399434 16.2348571,23.1126415 16.672,23.1126415 L16.672,23.1126415 Z M9.32495238,24.0237736 L9.32495238,22.6796226 L8.77980952,22.6796226 L8.77980952,23.0058491 C8.59238095,22.7639623 8.28590476,22.6120755 7.89980952,22.6120755 C7.13904762,22.6120755 6.55980952,23.2026415 6.55980952,24.0237736 C6.55980952,24.8449057 7.13904762,25.4354717 7.89980952,25.4354717 C8.28590476,25.4354717 8.59238095,25.2835849 8.77980952,25.0418868 L8.77980952,25.3681132 L9.32495238,25.3681132 L9.32495238,24.0237736 Z M7.12761905,24.0237736 C7.12761905,23.5175472 7.4512381,23.1126415 7.97352381,23.1126415 C8.47314286,23.1126415 8.80247619,23.5007547 8.80247619,24.0237736 C8.80247619,24.5467925 8.47314286,24.9349057 7.97352381,24.9349057 C7.45142857,24.934717 7.12761905,24.5298113 7.12761905,24.0237736 L7.12761905,24.0237736 Z M28.0788571,22.6120755 C27.7382857,22.6120755 27.4940952,22.7696226 27.3407619,23.0058491 L27.3407619,22.6796226 L26.8013333,22.6796226 L26.8013333,25.3679245 L27.3464762,25.3679245 L27.3464762,23.8550943 C27.3464762,23.4107547 27.5622857,23.1239623 27.948381,23.1239623 C28.067619,23.1239623 28.1925714,23.1407547 28.3175238,23.1915094 L28.4992381,22.685283 C28.368381,22.6345283 28.1979048,22.6120755 28.0788571,22.6120755 L28.0788571,22.6120755 Z M32.452,24.9779245 C32.4899048,24.9779245 32.5253333,24.9849057 32.5586667,24.9988679 C32.5918095,25.0128302 32.6209524,25.0318868 32.6459048,25.0560377 C32.6706667,25.0801887 32.6902857,25.1084906 32.7045714,25.1411321 C32.7188571,25.1735849 32.7260952,25.2081132 32.7260952,25.244717 C32.7260952,25.2813208 32.7188571,25.3158491 32.7045714,25.3481132 C32.6902857,25.3803774 32.6706667,25.4086792 32.6459048,25.4328302 C32.6209524,25.4569811 32.592,25.4762264 32.5586667,25.4903774 C32.5253333,25.5045283 32.4899048,25.5116981 32.452,25.5116981 C32.4133333,25.5116981 32.3771429,25.5045283 32.3434286,25.4903774 C32.3097143,25.4762264 32.2805714,25.4569811 32.256,25.4328302 C32.2312381,25.4086792 32.2118095,25.3803774 32.1975238,25.3481132 C32.1832381,25.3158491 32.1761905,25.2813208 32.1761905,25.244717 C32.1761905,25.2081132 32.1832381,25.1735849 32.1975238,25.1411321 C32.2118095,25.1086792 32.2312381,25.0803774 32.256,25.0560377 C32.2805714,25.0316981 32.3097143,25.0126415 32.3434286,24.9988679 C32.3771429,24.9849057 32.4133333,24.9779245 32.452,24.9779245 Z M32.452,25.4528302 C32.4811429,25.4528302 32.5081905,25.4473585 32.5333333,25.4364151 C32.5584762,25.4254717 32.580381,25.410566 32.5992381,25.3918868 C32.6182857,25.3732075 32.6329524,25.3511321 32.6438095,25.3258491 C32.6546667,25.300566 32.66,25.2735849 32.66,25.244717 C32.66,25.2158491 32.6546667,25.1888679 32.6438095,25.1635849 C32.6329524,25.1383019 32.6182857,25.1162264 32.5992381,25.0975472 C32.580381,25.0786792 32.5582857,25.0641509 32.5333333,25.0533962 C32.5081905,25.0426415 32.4811429,25.0373585 32.452,25.0373585 C32.4224762,25.0373585 32.3948571,25.0426415 32.3691429,25.0533962 C32.3434286,25.0641509 32.3209524,25.0786792 32.3020952,25.0975472 C32.2832381,25.1162264 32.2681905,25.1383019 32.2575238,25.1635849 C32.2466667,25.1888679 32.2413333,25.2158491 32.2413333,25.244717 C32.2413333,25.2735849 32.2466667,25.300566 32.2575238,25.3258491 C32.2681905,25.3511321 32.2832381,25.3732075 32.3020952,25.3918868 C32.3209524,25.410566 32.3434286,25.4254717 32.3691429,25.4364151 C32.3948571,25.4473585 32.4224762,25.4528302 32.452,25.4528302 Z M32.4678095,25.12 C32.5,25.12 32.5247619,25.1269811 32.5420952,25.1413208 C32.5594286,25.1554717 32.5681905,25.174717 32.5681905,25.1992453 C32.5681905,25.2198113 32.5613333,25.2366038 32.5474286,25.25 C32.5335238,25.2632075 32.5139048,25.2715094 32.488381,25.2745283 L32.5702857,25.3681132 L32.5062857,25.3681132 L32.4302857,25.275283 L32.4059048,25.275283 L32.4059048,25.3681132 L32.352381,25.3681132 L32.352381,25.1201887 L32.4678095,25.1201887 L32.4678095,25.12 Z M32.4057143,25.1664151 L32.4057143,25.2324528 L32.4670476,25.2324528 C32.4811429,25.2324528 32.492381,25.2298113 32.5007619,25.2243396 C32.5091429,25.2188679 32.5133333,25.210566 32.5133333,25.1992453 C32.5133333,25.1883019 32.5091429,25.1801887 32.5007619,25.174717 C32.492381,25.1692453 32.4811429,25.1666038 32.4670476,25.1666038 L32.4057143,25.1666038 L32.4057143,25.1664151 Z M25.9893333,24.0237736 L25.9893333,22.6796226 L25.4441905,22.6796226 L25.4441905,23.0058491 C25.2567619,22.7639623 24.9502857,22.6120755 24.5641905,22.6120755 C23.8034286,22.6120755 23.2241905,23.2026415 23.2241905,24.0237736 C23.2241905,24.8449057 23.8032381,25.4354717 24.5641905,25.4354717 C24.9502857,25.4354717 25.2569524,25.2835849 25.4441905,25.0418868 L25.4441905,25.3681132 L25.9893333,25.3681132 L25.9893333,24.0237736 Z M23.792,24.0237736 C23.792,23.5175472 24.115619,23.1126415 24.6379048,23.1126415 C25.1375238,23.1126415 25.4668571,23.5007547 25.4668571,24.0237736 C25.4668571,24.5467925 25.1375238,24.9349057 24.6379048,24.9349057 C24.115619,24.934717 23.792,24.5298113 23.792,24.0237736 L23.792,24.0237736 Z M31.468381,24.0237736 L31.468381,21.5998113 L30.9232381,21.5998113 L30.9232381,23.0058491 C30.7358095,22.7639623 30.4293333,22.6120755 30.0430476,22.6120755 C29.2822857,22.6120755 28.7030476,23.2026415 28.7030476,24.0237736 C28.7030476,24.8449057 29.2822857,25.4354717 30.0430476,25.4354717 C30.4291429,25.4354717 30.7358095,25.2835849 30.9232381,25.0418868 L30.9232381,25.3681132 L31.468381,25.3681132 L31.468381,24.0237736 Z M29.2710476,24.0237736 C29.2710476,23.5175472 29.5946667,23.1126415 30.1171429,23.1126415 C30.6167619,23.1126415 30.9460952,23.5007547 30.9460952,24.0237736 C30.9460952,24.5467925 30.6167619,24.9349057 30.1171429,24.9349057 C29.5946667,24.934717 29.2710476,24.5298113 29.2710476,24.0237736 Z"
                                                                          fill="#FFFFFF"></path>
                                                                        <g>
                                                                          <rect
                                                                            fill="#F16122"
                                                                            x="11.632"
                                                                            y="2.22132075"
                                                                            width="9.82647619"
                                                                            height="15.8992453"></rect>
                                                                          <path
                                                                            d="M12.6464762,10.1709434 C12.6464762,6.9454717 14.1710476,4.07283019 16.5453333,2.22132075 C14.8089524,0.867358491 12.6180952,0.0594339623 10.2369524,0.0594339623 C4.59980952,0.0594339623 0.0299047619,4.58660377 0.0299047619,10.1709434 C0.0299047619,15.755283 4.59980952,20.2824528 10.2369524,20.2824528 C12.6180952,20.2824528 14.8089524,19.474717 16.5453333,18.120566 C14.1710476,16.2692453 12.6464762,13.3966038 12.6464762,10.1709434 Z"
                                                                            fill="#E91D25"></path>
                                                                          <path
                                                                            d="M32.1202215,17.0436704 L32.1202215,16.2152225 L32.2743743,16.2152225 L32.2743743,16.0460731 L31.8819048,16.0460731 L31.8819048,16.2152225 L32.0360576,16.2152225 L32.0360576,17.0441509 L32.1202215,17.0441509 L32.1202215,17.0436704 Z M32.8819048,17.0436704 L32.8819048,16.0441509 L32.761639,16.0441509 L32.6232115,16.7313206 L32.4847841,16.0441509 L32.3645183,16.0441509 L32.3645183,17.0436704 L32.4495681,17.0436704 L32.4495681,16.289706 L32.5793577,16.9398742 L32.6672868,16.9398742 L32.7970764,16.2882644 L32.7970764,17.0436704 L32.8819048,17.0436704 Z"
                                                                            fill="#F79E1D"></path>
                                                                          <path
                                                                            d="M33.0605714,10.1709434 C33.0605714,15.755283 28.4906667,20.2824528 22.8535238,20.2824528 C20.472381,20.2824528 18.2815238,19.474717 16.5451429,18.120566 C18.9194286,16.2690566 20.4438095,13.3964151 20.4438095,10.1709434 C20.4438095,6.9454717 18.9192381,4.07283019 16.5451429,2.22132075 C18.2815238,0.867358491 20.4721905,0.0594339623 22.8535238,0.0594339623 C28.4908571,0.0594339623 33.0605714,4.58660377 33.0605714,10.1709434 Z"
                                                                            fill="#F79E1D"></path>
                                                                        </g>
                                                                      </g>
                                                                    </g>
                                                                  </g>
                                                                </g>
                                                              </g>
                                                            </svg>
                                                          )}
                                                      </div>{' '}
                                                      {this.state.card_number &&
                                                        !this.state
                                                          .card_number_valid && (
                                                          <p className="error_card -mt-10">
                                                            <FormattedMessage
                                                              id="paybycard.CardNumberError"
                                                              defaultMessage="Card number is invalid"
                                                            />
                                                          </p>
                                                        )}
                                                      <div className="row">
                                                        <div className="col">
                                                          <div className="form-group mar-top">
                                                            <label for="email">
                                                              <FormattedMessage
                                                                id="paybycard.ExpiryDate"
                                                                defaultMessage="Expiry date"
                                                              />
                                                              <span>*</span>
                                                            </label>
                                                            <input
                                                              type="text"
                                                              className={`form-control ${this.state
                                                                .expiry_date_valid
                                                                ? 'bb-green'
                                                                : 'bb-red'
                                                                }`}
                                                              placeholder="MM/YY"
                                                              name="expiry_date"
                                                              maxLength="5"
                                                              onChange={
                                                                this
                                                                  .onChangeHandlePayment
                                                              }
                                                              onInput={(e) =>
                                                                (e.target.value = e.target.value.replace(
                                                                  /[^\d/:]/g,
                                                                  ''
                                                                ))
                                                              }
                                                            />
                                                            {this.state
                                                              .expiry_date &&
                                                              !this.state
                                                                .expiry_date_valid && (
                                                                <p className="error_card">
                                                                  <FormattedMessage
                                                                    id="paybycard.ExpiryDateError"
                                                                    defaultMessage="Invalid expiry date"
                                                                  />
                                                                </p>
                                                              )}
                                                          </div>
                                                        </div>
                                                        <div className="col">
                                                          <div className="form-group mar-top">
                                                            <label for="email">
                                                              <FormattedMessage
                                                                id="paybycard.CVV"
                                                                defaultMessage="CVV"
                                                              />
                                                              <span>*</span>
                                                            </label>
                                                            <input
                                                              type="number"
                                                              className={`form-control ${this.state
                                                                .card_security_code_valid
                                                                ? 'bb-green'
                                                                : 'bb-red'
                                                                }`}
                                                              placeholder={formatMessage(
                                                                messages.card_security_code
                                                              )}
                                                              name="card_security_code"
                                                              onInput={(e) =>
                                                                (e.target.value = e.target.value.substring(
                                                                  0,
                                                                  3
                                                                ))
                                                              }
                                                              onChange={
                                                                this
                                                                  .onChangeHandlePayment
                                                              }
                                                            />
                                                            {this.state
                                                              .card_security_code &&
                                                              !this.state
                                                                .card_security_code_valid && (
                                                                <p className="error_card">
                                                                  <FormattedMessage
                                                                    id="paybycard.CVVError"
                                                                    defaultMessage="Invalid CVV"
                                                                  />
                                                                </p>
                                                              )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                      {this.props.user_details
                                                        .isUserLoggedIn && (
                                                          <div className="form-group mar-top ">
                                                            <div className="form-check form-check-inline saveCardCheck">
                                                              <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="inlineCheckbox1"
                                                                value="option1"
                                                                disabled={
                                                                  myCart.payment_details &&
                                                                  myCart
                                                                    .payment_details
                                                                    .payfort_fort_cc &&
                                                                  myCart
                                                                    .payment_details
                                                                    .payfort_fort_cc
                                                                    .cards &&
                                                                  myCart
                                                                    .payment_details
                                                                    .payfort_fort_cc
                                                                    .cards
                                                                    .length >= 3
                                                                }
                                                                onChange={(e) =>
                                                                  this.setState({
                                                                    save_card:
                                                                      e.target
                                                                        .checked,
                                                                  })
                                                                }
                                                              />
                                                              <label
                                                                className="form-check-label"
                                                                for="inlineCheckbox1">
                                                                {' '}
                                                                <FormattedMessage
                                                                  id="SaveCardDetails"
                                                                  defaultMessage="Save card details"
                                                                />
                                                              &nbsp;
                                                              {myCart.payment_details &&
                                                                  myCart
                                                                    .payment_details
                                                                    .payfort_fort_cc &&
                                                                  myCart
                                                                    .payment_details
                                                                    .payfort_fort_cc
                                                                    .cards &&
                                                                  myCart
                                                                    .payment_details
                                                                    .payfort_fort_cc
                                                                    .cards
                                                                    .length >=
                                                                  3 && (
                                                                    <>
                                                                      (
                                                                    <FormattedMessage
                                                                        id="Youcansaveonly3cardsRemoveanothercardtosavethis"
                                                                        defaultMessage="You can save only 3 cards, Remove another card to save this."
                                                                      />
                                                                    &nbsp;
                                                                    <Link
                                                                        to={`/${this.props.globals.store_locale}/saveCards`}>
                                                                        <FormattedMessage
                                                                          id="paybycard.manageCards"
                                                                          defaultMessage="Manage Cards"
                                                                        />
                                                                      </Link>
                                                                    )
                                                                  </>
                                                                  )}
                                                              </label>
                                                            </div>
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>
                                                )}
                                              </Collapsible>
                                            </div>
                                          </div>
                                        </div>
                                        {/* 
                                                        <div className="buttonSection">
                                                            <p className="termlabel">By placing your order,you agree to our <a href="">Privacy & Cookie Policy</a> and <a href="">Term & Conditions.</a></p>
                                                            <button type="button">Pay now</button>
                                                        </div>
                                                        */}
                                      </div>
                                    </div>

                                    <div className="container">
                                      <div className="PaymentPage">
                                        <div className="deliverTab">
                                          <div className="react-tabs">
                                            <div className="borderTab">
                                              <ul
                                                className="react-tabs__tab-list"
                                                role="tablist">
                                                <li
                                                  onClick={(e) =>
                                                    this.redirectToConfirm(
                                                      'cashondelivery',
                                                      'COD'
                                                    )
                                                  }
                                                  class={
                                                    (Ptype === 'COD'
                                                      ? 'react-tabs__tab--selected '
                                                      : '') + 'react-tabs__tab'
                                                  }>
                                                  <span className="title">
                                                    <span>
                                                      <FormattedMessage
                                                        id="checkoutpaymentMethod.Paywithcardondelivery"
                                                        defaultMessage="Pay with card on delivery"
                                                      />
                                                    </span>
                                                  </span>
                                                  <p>
                                                    <span>
                                                      <FormattedMessage
                                                        id="checkoutpaymentMethod.Paywithcardondeliveryadditional"
                                                        defaultMessage="Pay with card on delivery. Additional charge will be charged"
                                                      />
                                                    </span>
                                                  </p>
                                                </li>
                                              </ul>
                                            </div>
                                            {/* <div className="react-tabs__tab-panel react-tabs__tab-panel--selected">
                                                                        <div className="payByCardOuter">
                                                                            <div className="payByCard">
                                                                                <div className="row">
                                                                                    <div className="col-12">
                                                                                        <p className="totalOuter">
                                                                                            <b>
                                                                                                <span className="title"><span>Total</span></span> : 
                                                                                                {myCart.discount_amount === 0 ? 
                                                                                                <span>{` ${myCart.currency} ${myCart.grand_total}`}</span> :
                                                                                                <span className="totalAmount"><span className="line-through">{`${myCart.currency} ${myCart.grand_total}`} 
                                                                                                </span> {` ${myCart.currency} ${myCart.subtotal}`} </span>
                                                                                            }
                                                                                            </b>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <hr />
                                                                                <p className="agreeConditions">
                                                                                    <span>By Placing your order you agree to our</span><br />
                                                                                    <a href={`/${globals.store_locale}/privacy-policy`}><span>Privacy</span>&nbsp;&amp;&nbsp;<span>Cookie Policy</span></a>&nbsp;and <a href={`/${globals.store_locale}/terms-conditions`}><span>Terms and Conditions</span></a>.
                                                                                </p>
                                                                            </div>
                                                                            <div className="row btnOuter">
                                                                                <div className="col-6 col-md-6 btnOuterInner1">
                                                                                    <a href="">
                                                                                        <button className="continueShopping" type="button">
                                                                                            <span className="t-Button-label"><span>Continue Shopping</span></span>
                                                                                        </button>
                                                                                    </a>
                                                                                </div>
                                                                                <div className="col-6 col-md-6 btnOuterInner2">
                                                                                    <button className="proceed" type="button">
                                                                                        <span className="t-Button-label"><span>Proceed</span></span>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div> */}
                                            <div className="react-tabs__tab-panel"></div>
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
                                    {/* <div className="form-group onCheck mb-1 lastcheck">
                                                        <input 
                                                        onClick={() => this.setTermsAndCondition()}
                                                        value={termsAndCondition}
                                                        checked={termsAndCondition}
                                                        className="custCheck customcheckLast" id="tnc" type="checkbox" name="checkbox" />
                                                        <label for="tnc" className="pb-1 form-check-label w-75"> 
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
                                    <div className="row">
                                      {isApplePayAvailable === true &&
                                        (
                                          <div onClick={() => this.onApplePayButtonClick()} className="apple-pay-button-with-text apple-pay-button-black-with-text">
                                            <span className="text">Buy with</span>
                                            <span className="logo"></span>
                                          </div>
                                        )}
                                    </div>

                                    <div className="styled-input w-100">
                                      <div className="inputControlmb-0">
                                        {!isClickOnPlaceOrder && (
                                          <button
                                            type="button"
                                            onClick={() => this.placeOrder()}
                                            className="BaseButton dNUJxY">
                                            <FormattedMessage
                                              id="checkoutpaymentMethod.PlaceOrder"
                                              defaultMessage="Place Order"
                                            />
                                          </button>
                                        )}
                                        {/*
                                                            <div className="styles__ButtonFlexWrapper-rj3029-5 crELmO">
                                                                <button className="anotherAdress">Can't see your address? Enter it manually</button>
                                                            </div> */}

                                        {isClickOnPlaceOrder && (
                                          <button
                                            className="placeOreder BaseButton dNUJxY"
                                            type="button"
                                            disabled={true}>
                                            <img
                                              src={wait}
                                              style={{
                                                width: 25,
                                                height: 25,
                                                marginTop: -4,
                                              }}
                                              alt=""
                                            />
                                            <span className="t-Button-label">
                                              <FormattedMessage
                                                id="checkoutpaymentMethod.Pleasewait"
                                                defaultMessage="Please wait..."
                                              />
                                            </span>
                                          </button>
                                        )}
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
                    <Ordersummary Ptype={Ptype} />
                  </div>
                  <div className="row">
                    <form
                      id="main-login"
                      // action="https://checkout.payfort.com/FortAPI/paymentPage"
                      action={PAY_FORT_URL}
                      method="post">
                      <div style={{ display: 'none' }}>{paymentData}</div>
                      <div
                        className="col col-12 apex-col-auto"
                        style={{ display: 'none' }}>
                        <button
                          id="placeorderbycard"
                          type="submit"
                          className="t-Button t-Button--hot t-Button--stretch t-Button--gapTop ">
                          <span className="t-Button-label">Place Order</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    );
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
    payfort_data: state.myCart.payfort_data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPlaceOrder: (data) => dispatch(actions.getPlaceOrder(data)),
    saveCardPlaceOrder: (data) => dispatch(actions.saveCardPlaceOrder(data)),
    OngetMyCart: (quoteId) => dispatch(actions.getMyCart(quoteId)),
    OnplaceOrder: (payload) => dispatch(actions.placeOrder(payload)),
    setBillingDetails: (payload) =>
      dispatch(actions.setBillingDetails(payload)),
    setShippingSuccess: (payload) =>
      dispatch(actions.setShippingSuccess(payload)),
    setAddressFromShippingDetails: (payload) =>
      dispatch(actions.setAddressFromShippingDetails(payload)),
    onSetPaymentDetails: (payload) =>
      dispatch(actions.setPaymentDetails(payload)),
    onApplyVoucode: (payload) => dispatch(actions.applyVoucode(payload)),
    onRemoveVoucode: (payload) => dispatch(actions.removeVoucode(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(CheckoutPaymentMethod)));
