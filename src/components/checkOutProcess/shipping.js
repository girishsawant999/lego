import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Collapsible from 'react-collapsible';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Ordersummary from '../checkOutProcess/checkOutProcessorderSummary';
import * as actions from "../../redux/actions/index";
import PlusIcon from '../../assets/images/icons/arrowDown.png';
import minusIcon from '../../assets/images/icons/arrowDown.png';
import shipicon from '../../assets/images/icons/shipIcon.png';
import Clickicon from '../../assets/images/icons/clickCollectIcon.png';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import { checkoutEvent } from '../utility/googleTagManager';
import AddBagAlert from '../../common/AlertBox/addToBagAlert';

var _ = require('lodash');
let language = 'en';
let addressData = [];
let allStoreList = [];
let countryCityChange = true;
let addressSubmited = false;
let isSaveAddreSelected = false;
class CheckOutForm extends Component {
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
            selectedTab: 0,
            setClickAndCollectAddr: {},
            isSetClickAndCollectAddr: false,
            addMessagePopup: false,
            addMessage: ''
        }

        allStoreList = [];
        addressData = [];
        isSaveAddreSelected = false;
    }
    closeOther = (value) => {
        let collapses = document.getElementsByClassName('open');
        for (let i = 0; i < collapses.length; i++) {
            collapses[i].click();
        }
    }

    // componentWillMount = () => {
    //     const { shipping } = this.props;
    //     if (this.props.shipping && this.props.shipping.isClickAndCollect) {
    //         this.setState({
    //             selectedTab: 1,
    //             firstName: shipping.clickAndCollect.fname,
    //             lastName: shipping.clickAndCollect.lname,
    //             firstNameErr: '',
    //             lastNameErr: '',
    //             selectedCountry: shipping.clickAndCollect.country_id,
    //             selectedCountryName: shipping.clickAndCollect.state,
    //             selectedCity: shipping.clickAndCollect.region_id,
    //             selectedCityName: shipping.clickAndCollect.city
    //         });

    //         this.setAddrClickAndCollect(this.props.shipping.clickAndCollect.setClickAndCollectAddr);
    //     }


    // }

    componentDidMount() {

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
            step: 1,
            product: productList
        });
    }

    componentWillMount = () => {
        language = this.props.globals.store_locale;
        if (this.props.myCart.cart_count === 0) {
            this.props.history.push(`/${this.props.globals.store_locale}/cart`);
        } else {
            //if (!this.props.storeList || (this.props.storeList && this.props.storeList.length === 0)) {

            // }
            if ((!this.props.country.countryList) || (this.props.country.countryList &&
                this.props.country.countryList.length === 0)) {
                this.props.onGetCountryList();
            }

            // if (this.props.myCart && !this.props.myCart.is_shipping_details_rec) {
                this.props.OnGetShippingDetails({
                    customer_id: this.props.user_details.customer_details.customer_id || "",
                    store_id: this.props.globals.currentStore
                })
            // }

            const { shipping } = this.props;
            if (this.props.country.countryList && this.props.country.countryList.length > 0 && this.state.country.length === 0) {
                this.setState({
                    country: this.props.country.countryList,
                });

                if (shipping && (shipping.isShippingSet || shipping.isClickAndCollect)) {
                    let country_id = this.props.shipping.isShippingSet ? shipping.address_object.country_id :
                        shipping.clickAndCollect.country_id;
                    let citiName = this.props.shipping.isShippingSet ? shipping.address_object.city :
                        shipping.clickAndCollect.city;
                    let citiId = this.props.shipping.isShippingSet ? shipping.address_object.region_id :
                        shipping.clickAndCollect.region_id;
                    this.onChangeCountryFirst(country_id, this.props.country.countryList, citiId, citiName);
                } else {
                    this.onChangeCountryFirst('SA', this.props.country.countryList);
                }
            }
            if (this.props.shipping && this.props.shipping.isShippingSet) {
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
                    selectedCityName: shipping.address_object.city
                })
            } else if (this.props.shipping && this.props.shipping.defaultAddr) {
                setTimeout(() => {
                    let collapse = document.getElementsByClassName('Collapsible_text_container');
                    if (collapse && collapse[0]) {
                        collapse[0].click();
                    }
                }, 200);
                this.setState({
                    setSaveAddr: this.props.shipping,
                    selectedSaveAddr: true,
                    firstName: shipping.userFirstName,
                    lastName: shipping.userLastName,
                    AptValue: shipping.customer_appartment,
                    streetValue: shipping.street,
                    companyName: shipping.company,
                    zipCode: shipping.postcode,
                    selectedCity: shipping.region_id,
                    selectedCityName: shipping.city,
                });

                addressData = this.props.myCart.addressData;
                addressData.forEach(addr => {
                    if (addr.Id === this.props.shipping.Id) {
                        addr.isSelected = true;
                    } else if (addr.isSelected) {
                        addr.isSelected = false;
                    }
                });

                isSaveAddreSelected = true;
            } else if (this.props.shipping && this.props.shipping.isClickAndCollect) {
                this.setState({
                    selectedTab: 1,
                    firstName: shipping.clickAndCollect.fname,
                    lastName: shipping.clickAndCollect.lname,
                    firstNameErr: '',
                    lastNameErr: '',
                    selectedCountry: shipping.clickAndCollect.country_id,
                    selectedCountryName: shipping.clickAndCollect.state,
                    selectedCity: shipping.clickAndCollect.region_id,
                    selectedCityName: shipping.clickAndCollect.city
                });

                this.setAddrClickAndCollect(this.props.shipping.clickAndCollect.setClickAndCollectAddr);
            }
        }
    }

    toastClosed = (e) => {
        this.toastId = null;
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.country.countryList && nextProps.country.countryList.length > 0 && this.state.country.length === 0) {
            this.setState({
                country: nextProps.country.countryList,
            });

            this.onChangeCountryFirst('SA', nextProps.country.countryList);
        }

        if (nextProps.storeList && countryCityChange) {
            allStoreList = nextProps.storeList;
            countryCityChange = false;
            if (allStoreList.length > 0) {
                this.setAddrClickAndCollect(allStoreList[0]);
            }
        }

        if (nextProps.shipping && addressSubmited && (nextProps.shipping.isShippingSet ||
            nextProps.shipping.defaultAddr || nextProps.shipping.isClickAndCollect)) {
            // isMsgDisplayed =  true;
            addressSubmited = false;
            this.toastId = toast((language === 'en' ?
                'Shipping Address Saved Successfully' : 'تم حفظ عنوان الشحن بنجاح '), {
                className: css({
                    color: "green !important",
                    fontSize: "13.5px"
                }),

                onClose: this.toastClosed,
                hideProgressBar: true,
            });

            setTimeout(() => {
                // let elmnt = document.getElementById("shippingData");
                // if (elmnt) {
                //     elmnt.scrollIntoView();
                // }

                nextProps.history.push(`/${this.props.globals.store_locale}/checkoutContactInfo`);
            }, 1500)

            // setTimeout(() => {
            //     isMsgDisplayed = false;
            // }, 6000);
        }
    }

    firstNameChange = (e) => {
        if ((e && e.target.value === '') || !e) {
            this.setState({
                firstName: '',
                firstNameErr: language === 'en' ? 'This is a required field' : 'حقل إلزامي'
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
                lastNameErr: language === 'en' ? 'This is a required field' : 'حقل إلزامي'
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
                streetValueErr: language === 'en' ? 'This is a required field' : 'حقل إلزامي'
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
        if (e && e.target) {
            this.setState({
                zipCode: e.target.value
            });
        }

        this.forceUpdate();
        // if ((e && e.target.value === '') || !e) {
        //     this.setState({
        //         zipCode: e ? e.target.value : this.state.zipCode,
        //        // zipCodeErr: language === 'en' ? 'This is a required field' : 'This is a required field'
        //     });
        // } else {
        //     this.setState({
        //         zipCode: e.target.value,
        //         zipCodeErr: ''
        //     });
        // }

        // this.forceUpdate();
    }

    onChangeCountryFirst(countryId, country, cityId, cityName) {
        let CountryName, CityList;
        if (countryId) {
            for (var i = 0; i < country.length; i++) {
                if (country[i] && countryId === country[i].id) {
                    CountryName = country[i].full_name_english;
                    CityList = country[i].available_regions;
                }
            }

            this.setState({
                selectedCountry: countryId,
                selectedCountryName: CountryName,
                CityList: CityList,
                selectedCity: cityId ? cityId : CityList[0].id,
                selectedCityName: cityName ? cityName : CityList[0].name,
            });
        }

        this.props.onGetStoreList({
            country_id: countryId,
            city: cityName ? _.upperCase(cityName) : _.upperCase(CityList[0].name),
            store_id: this.props.globals.currentStore
        });

        this.forceUpdate();
    }

    onChangeCountry(e, country) {
        let CountryName, CityList;
        if (e.target.value) {
            countryCityChange = true;
            for (var i = 0; i < country.length; i++) {
                if (country[i] && e.target.value === country[i].id) {
                    CountryName = country[i].full_name_english;
                    CityList = country[i].available_regions;
                }
            }

            if (this.state.selectedTab === 1) {
                this.props.onGetStoreList({
                    country_id: e.target.value,
                    city: _.upperCase(CityList[0].name),
                    store_id: this.props.globals.currentStore
                });
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
            countryCityChange = true;
            for (var i = 0; i < city.length; i++) {
                if (city[i] && e.target.value === city[i].id) {
                    cityname = city[i].name;
                }
            }

            if (this.state.selectedTab === 1) {
                this.props.onGetStoreList({
                    country_id: this.state.selectedCountry,
                    city: _.upperCase(cityname),
                    store_id: this.props.globals.currentStore
                });
            }
            this.setState({
                selectedCity: e.target.value,
                selectedCityName: cityname,
            })
        }
    }

    useAddrForBilling = () => {
        const useForBilling = !this.state.useForBilling;
        this.setState({
            useForBilling
        });
    }

    isAllValueFilled = () => {
        const { firstNameErr, lastNameErr, streetValueErr, zipCodeErr } = this.state;
        let errArr = {
            firstNameErr: firstNameErr,
            lastNameErr: lastNameErr,
            streetValueErr: streetValueErr,
            // zipCodeErr: zipCodeErr
        };
        if (firstNameErr === '' && lastNameErr === '' && streetValueErr === '') {
            return true;
        } else {
            for (var key in errArr) {
                if (errArr[key] === false) {
                    this.setState({
                        [key]: language === 'en' ? 'This is a required field' : 'حقل إلزامي'
                    })
                }
            }

            return false
        }
    }

    checkFirstAndLastName = () => {
        const { firstNameErr, lastNameErr } = this.state;
        let errArr = {
            firstNameErr: firstNameErr,
            lastNameErr: lastNameErr
        };
        if (firstNameErr === '' && lastNameErr === '') {
            return true;
        } else {
            for (var key in errArr) {
                if (errArr[key] === false) {
                    this.setState({
                        [key]: language === 'en' ? 'This is a required field' : 'حقل إلزامي'
                    })
                }
            }

            return false
        }
    }

    onSubmit = () => {
        const { firstName, lastName, AptValue, streetValue, selectedCountryName, selectedCityName,
            companyName, zipCode, selectedCountry, selectedCity, useForBilling, setClickAndCollectAddr } = this.state;
        const { globals, user_details, myCart, guest_user } = this.props;
        let customer_id = '';
        let quote_id = "";
        let email = "";
        if (user_details.customer_details.quote_id) {
            customer_id = user_details.customer_details.customer_id
            quote_id = user_details.customer_details.quote_id;
            email = user_details.customer_details.email
        } else if (guest_user.new_quote_id) {
            quote_id = guest_user.new_quote_id;
        } else {
            quote_id = "";
        }

        if (this.state.selectedTab === 1) {
            if (this.checkFirstAndLastName() && setClickAndCollectAddr && setClickAndCollectAddr.name) {
                let shippingData = {
                    clickAndCollect: {
                        address_id: "",
                        address_object: {},
                        cnumber: customer_id,
                        email: '',
                        fname: firstName,
                        lname: lastName,
                        mnumber: '',
                        nayomi_store_id: '',
                        quote_id: quote_id,
                        shipping_code: "freeshipping_freeshipping",
                        store_id: globals.currentStore,
                        setClickAndCollectAddr: setClickAndCollectAddr,
                        lego_store_id: globals.currentStore,
                        country_id: selectedCountry,
                        state: selectedCountryName,
                        region_id: selectedCity,
                        city: selectedCityName,
                        shipping: "true",
                        billing: "true"
                    },
                    isClickAndCollect: true,
                    isShippingSet: false,
                    defaultAddr: false,
                    shipping: "true",
                    billing: "true"
                }

                this.props.setShippingDetails(shippingData);
                addressSubmited = true;
                this.setState({
                    addressSubmited: true
                });
            } else if (!setClickAndCollectAddr || (setClickAndCollectAddr && !setClickAndCollectAddr.name)) {
                this.toastId = toast((language === 'en' ?
                    'No Store selected' : 'No Store selected'), {
                    className: css({
                        color: "red !important",
                        fontSize: "13.5px"
                    }),

                    onClose: this.toastClosed,
                    hideProgressBar: true,
                });

                setTimeout(() => {
                    let elmnt = document.getElementById("shippingData");
                    if (elmnt) {
                        elmnt.scrollIntoView();
                    }
                }, 200)
            }
        } else {
            if (this.state.selectedSaveAddr) {
                let shippingData = this.state.setSaveAddr;
                shippingData.defaultAddr = true;
                shippingData.isClickAndCollect = false;
                shippingData.isShippingSet = false;
                this.props.setShippingDetails(shippingData);
                addressSubmited = true;
                this.setState({
                    addressSubmited: true
                });
            } else if (this.isAllValueFilled()) {
                let shippingData = {
                    "store_id": globals.currentStore,
                    "quote_id": myCart.quote_id,
                    "fname": firstName,
                    "lname": lastName,
                    "email": email,
                    "cnumber": customer_id,
                    "mnumber": '',
                    "address_id": "",
                    "shipping_code": "tablerate_bestway",
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
                        "carrier_code": '',
                        "city": selectedCityName,
                        "street": streetValue,
                        "telephone": "",
                        "customer_address_type": "Home"
                    },

                    defaultAddr: false,
                    isClickAndCollect: false,
                    isShippingSet: true,
                    "shipping": "true",
                    "billing": "true"
                }

                this.props.setShippingDetails(shippingData);
                addressSubmited = true;
                this.setState({
                    addressSubmited: true
                });
            }
        }

    }

    continueToContact = () => {
        if (this.props.shipping.isShippingSet || this.props.shipping.defaultAddr || this.props.shipping.isClickAndCollect) {
            this.props.history.push(`/${this.props.globals.store_locale}/checkoutContactInfo`);
        }
    }

    setAddr = (data) => {
        addressData.forEach(addr => {
            if (addr.Id === data.Id) {
                addr.isSelected = !addr.isSelected;
            } else if (addr.isSelected) {
                addr.isSelected = false;
            }
        });
        if (this.state.setSaveAddr.Id && this.state.setSaveAddr.Id === data.Id) {
            this.setState({
                setSaveAddr: {},
                selectedSaveAddr: false,
                firstName: '',
                lastName: '',
                AptValue: '',
                streetValue: '',
                companyName: '',
                zipCode: '',
                selectedCity: '714',
                selectedCityName: 'Abha',
            });

            isSaveAddreSelected = false;
        } else {
            this.setState({
                setSaveAddr: data,
                selectedSaveAddr: true,
                firstName: data.userFirstName,
                lastName: data.userLastName,
                AptValue: data.customer_appartment,
                streetValue: data.street,
                companyName: data.company,
                zipCode: data.postcode,
                selectedCity: data.region_id,
                selectedCityName: data.city,
            });

            isSaveAddreSelected = true;
        }
    }

    setAddrClickAndCollect = (data) => {
        allStoreList.forEach(store => {
            if (store.id === data.id) {
                store.isSelected = true;
            } else if (store.isSelected) {
                store.isSelected = false;
            }
        });

        if (data && data.name) {
            this.setState({
                setClickAndCollectAddr: data,
                isSetClickAndCollectAddr: true
            });
        } else {
            this.setState({
                setClickAndCollectAddr: {},
                isSetClickAndCollectAddr: false
            });
        }
    }

    closeAddBag = () => {
        this.setState({
            addMessagePopup: false
        })
    }

    displayLimitMsg = () => {
        var storeId = this.props.globals.currentStore;
        if (storeId === 1) {
            this.setState({
                addMessagePopup: true,
                addMessage: `خدمة انقر واستلم غير متاحة `
            })

        } else {
            this.setState({
                addMessagePopup: true,
                addMessage: `Click and Collect not available.`
            })
        }
	}

    render() {
        let { firstNameErr, firstName, lastName, lastNameErr, AptValue, streetValue, streetValueErr,
            companyName, zipCode, zipCodeErr, selectedTab, selectedSaveAddr } = this.state;
        let { user_details, myCart, storeList } = this.props;

        if (myCart.addressData && user_details.isUserLoggedIn && addressData.length === 0 && myCart.addressData.length > 0) {
            addressData = myCart.addressData;
        }
        
        if (storeList && allStoreList !== storeList) {
            allStoreList = storeList;
            if (allStoreList[0]) {
                this.setAddrClickAndCollect(allStoreList[0]);
            } else {
                this.setAddrClickAndCollect({});
            }
        }

        let alertOnClickAndCollect = null;
		if (this.state.addMessagePopup) {
			alertOnClickAndCollect = <AddBagAlert
				message={this.state.addMessage}
				alertBoxStatus={true}
				closeBox={this.closeAddBag} />
		}

        return (
            <div>
                {alertOnClickAndCollect}
                <ToastContainer />
                <div className="checkOutForm">
                    <div className="cart-grid">
                        <div className="container">

                            <div className="row">
                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-12 mobPadding">
                                            <div className="ShippingTabs">
                                                <Tabs defaultIndex={selectedTab} >
                                                
                                                    <TabList>
                                                        <Tab>
                                                            <img src={shipicon} className="IconImage" />
                                                            <FormattedMessage id="shipping.Shipping" defaultMessage="Shipping" /></Tab>
                                                        <Tab disabled={true} onClick={() => this.displayLimitMsg()}><img src={Clickicon} className="IconImage" />
                                                            <FormattedMessage id="checkoutContactInfo.ClicknCollect" defaultMessage="Click and Collect" /></Tab>
                                                    </TabList>
                                                    <TabPanel>
                                                        {/* <div className="ShppingPannel">
                                               ShppingPannel
                                               </div> */}
                                                    </TabPanel>
                                                    <TabPanel>
                                                        <div className="ClickCollectPannel">
                                                            <div className="alignBorder">
                                                                <div className="border-margin"><hr /></div>
                                                            </div>
                                                            <br />
                                                            <div className="step-section">

                                                                <div className="styled-input bUgSOh customField inputMaxHeight">
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
                                                                <div className="styled-input bUgSOh customField inputMaxHeight">
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
                                                                <div className="styled-input bUgSOh customField inputMaxHeight">
                                                                    <div className="inputControl">
                                                                        <div className="select-down"></div>
                                                                        {this.state.country && <div className="">
                                                                            <select name="select" id="select" className="is-touched is-pristine av-valid"
                                                                                value={this.state.selectedCountry}
                                                                                onChange={(e) => this.onChangeCountry(e, this.state.country)}>
                                                                                {this.state.country.map(c => {
                                                                                    return (
                                                                                        <option key={c.id} value={c.id}>{c.full_name_english}</option>
                                                                                    )
                                                                                })}
                                                                            </select>
                                                                            <span className="label-select"><FormattedMessage id="shipping.Country" defaultMessage="Country" /></span>
                                                                            {/* <span className="Select__SelectedValue-sc-155k6kv-1 cvILin">Please select</span> */}
                                                                        </div>}
                                                                    </div>
                                                                </div>
                                                                <div className="styled-input bUgSOh customField inputMaxHeight">
                                                                    <div className="inputControl">
                                                                        <div className="select-down"></div>
                                                                        <div className="">
                                                                            <select
                                                                                onChange={(e) => this.onChangeCity(e, this.state.CityList)}
                                                                                value={this.state.selectedCity}
                                                                                name="select"
                                                                                id="select"
                                                                                className="is-touched is-pristine av-valid">
                                                                                {this.state.CityList.map(c => {
                                                                                    return (
                                                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                                                    )
                                                                                })}
                                                                            </select>
                                                                            <span className="label-select"><FormattedMessage id="shipping.State" defaultMessage="State" /></span>
                                                                            {/* <span className="Select__SelectedValue-sc-155k6kv-1 cvILin">Please select</span> */}
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                                <div className="pleaseWait">
                                                                    <p><span className="boldText"><FormattedMessage id="shipping.Pleasewait" defaultMessage="Please wait" /></span><FormattedMessage id="checkoutContactInfo.team" defaultMessage=" to here form out awesome team to confirm that your order is " /> <span className="boldText"><FormattedMessage id="checkoutContactInfo.READY" defaultMessage="READY" /></span> <FormattedMessage id="checkoutContactInfo.before" defaultMessage="before you come in-store to collect!" /></p>
                                                                </div>
                                                                <div id="style-1" className="AddressCheckBox">
                                                                    {/* <div className="ActiveCheckBox">
                                                         <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input chekInput" id="customCheck" name="example1" />
                                                            <label class="custom-control-label" for="customCheck"><span className="checkBold">Lego Sandford city</span>
                                                            <br />Lego Sandford Road pune</label>
                                                        </div>
                                                         </div> */}
                                                                    {allStoreList && allStoreList.length > 0 && allStoreList.map(store => {
                                                                        return (
                                                                            <div className="NonCheckBox">
                                                                                <div class="custom-control custom-checkbox"
                                                                                    onClick={() => this.setAddrClickAndCollect(store)}>
                                                                                    <input
                                                                                        value={store.isSelected}
                                                                                        checked={store.isSelected}
                                                                                        type="checkbox"
                                                                                        class="custom-control-input chekInput"
                                                                                        id={store.id} name="example1" />
                                                                                    <label class="custom-control-label" for="customCheck1"><span className="checkBold">
                                                                                        {`${store.name}`}</span>
                                                                                        <br />{`${store.address}`}
                                                                                        <br />{`${store.phone}`}</label>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                    {allStoreList.length === 0 && <span className="noStoreAvailable">
                                                                        <FormattedMessage id="checkoutContactInfo.NoStore" defaultMessage="No Store Available" />
                                                                    </span>}
                                                                    <div className="styled-input bUgSOh customField w-100">
                                                                    </div>
                                                                </div>
                                                                <div className="SubmitAddress">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => this.onSubmit()}
                                                                        className="dNUJxY"><FormattedMessage id="checkoutContactInfo.Submit" defaultMessage="Submit" /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TabPanel>
                                                </Tabs>
                                            </div>
                                            <div className="StepContainerShipping">
                                                <div className="border-margin"><hr /></div>
                                                {selectedTab === 0 && <div>
                                                <div className="styled-input bUgSOh customField w-100 col-md-12">
                                                        <div className="inputControl removeHeight">
                                                            <div className="CollapsDiv border-0 pl-0">
                                                                {user_details.isUserLoggedIn && myCart.addressData.length > 0 &&
                                                                    <Collapsible trigger={
                                                                        <div onClick={() =>
                                                                            this.closeOther(0)} className="Collapsible_text_container">
                                                                            <div className="Collapsible_text footerHeading">
                                                                                <FormattedMessage id="footer.Legal" defaultMessage="saved address" />
                                                                            </div>
                                                                            <div className="Collapsible_arrow_container">
                                                                                <img className="Icon" src={PlusIcon} alt="" />
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    open={true}
                                                                        triggerWhenOpen={
                                                                            <div className="Collapsible_text_container open">
                                                                                <div className="Collapsible_text footerHeading">
                                                                                    <FormattedMessage id="footer.Legal" defaultMessage="saved address" />
                                                                                </div>
                                                                                <div className="Collapsible_arrow_container">
                                                                                    <img src={minusIcon} alt="" className="Icon" />
                                                                                </div>
                                                                            </div>
                                                                        }>
                                                                        <div className="PannelDiv">
                                                                            {addressData.map(data => {
                                                                                return (
                                                                                    <div onClick={() => this.setAddr(data)} class="custom-control d-flex col-6 float-left custom-checkbox mb-2 selectAddress">
                                                                                        <input
                                                                                            value={data.isSelected}
                                                                                            checked={data.isSelected}
                                                                                            type="checkbox"
                                                                                            class="checkBoxFixDropDown custom-control-input fixHeightBox"
                                                                                            id={data.Id} name={data.Id} />
                                                                                        <label class="custom-control-label pt-1"
                                                                                            for="customCheck">
                                                                                            {`${_.upperFirst(data.userFirstName)} ${_.upperFirst(data.userLastName)} `}<br />
                                                                                            {`${_.upperFirst(data.street)}  ${_.upperFirst(data.city)} `}<br />
                                                                                            {` ${_.upperFirst(data.state)} ${data.postcode}`}</label>
                                                                                    </div>)
                                                                            })}
                                                                        </div>
                                                                    </Collapsible>
                                                                }                                                        </div>
                                                        </div>
                                                    </div>
                                                <div className="step-section">

                                                    <div className="AddressWrapper">
                                                        <h3 className="step-title"><FormattedMessage id="shipping.Entershippingaddress" defaultMessage="Enter shipping address" /></h3>
                                                        <form className="styles__FormWrapper-rj3029-0 lonvYJ">
                                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                                                <div className="inputControl">
                                                                    <input
                                                                        disabled={isSaveAddreSelected}
                                                                        onChange={(e) => this.firstNameChange(e)}
                                                                        value={firstName}
                                                                        type="text" />
                                                                    <label><FormattedMessage id="shipping.FirstName" defaultMessage="First Name" /></label>
                                                                    <div className="greenCheck">
                                                                        {firstNameErr === '' && !isSaveAddreSelected  && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                            <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                        {firstNameErr && firstNameErr.length > 0 && !isSaveAddreSelected  && <svg viewBox="0 0 17 17" width="17px" height="17px" className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo" data-di-res-id="a2f523df-4ed24860" data-di-rand="1587975551851">
                                                                            <path d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                    </div>
                                                                    <span class={(firstNameErr === false || isSaveAddreSelected) ? "" : firstNameErr === '' ? "greenLine" : "redLine"}></span>
                                                                    {firstNameErr && !isSaveAddreSelected && <p class="redValidaion">{firstNameErr}</p>}
                                                                </div>
                                                            </div>
                                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                                                <div className="inputControl">
                                                                    <input type="text"
                                                                        disabled={isSaveAddreSelected}
                                                                        value={lastName}
                                                                        onChange={(e) => this.lastNameChange(e)} />
                                                                    <label><FormattedMessage id="shipping.LastName" defaultMessage="Last Name" /></label>
                                                                    <div className="redClose">
                                                                        {lastNameErr === '' && !isSaveAddreSelected  && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                            <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                        {lastNameErr && lastNameErr.length > 0 && !isSaveAddreSelected  && <svg viewBox="0 0 17 17" width="17px" height="17px" className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo" data-di-res-id="a2f523df-4ed24860" data-di-rand="1587975551851">
                                                                            <path d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                    </div>
                                                                    <span class={(lastNameErr === false || isSaveAddreSelected) ? "" : lastNameErr === '' ? "greenLine" : "redLine"}></span>
                                                                    {lastNameErr && !isSaveAddreSelected  && <p class="redValidaion">{lastNameErr}</p>}
                                                                </div>
                                                            </div>
                                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                                                <div className="inputControl">
                                                                    <input
                                                                        value={AptValue}
                                                                        disabled={isSaveAddreSelected}
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
                                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                                                <div className="inputControl">
                                                                    <input type="text"
                                                                        value={streetValue}
                                                                        disabled={isSaveAddreSelected}
                                                                        onChange={(e) => this.streetValueChange(e)} />
                                                                    <label><FormattedMessage id="shipping.Streetaddress" defaultMessage="Street address" /></label>
                                                                    <div className="redClose">
                                                                        {streetValueErr === '' && !isSaveAddreSelected && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                            <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                        {streetValueErr && streetValueErr.length > 0 && !isSaveAddreSelected && <svg viewBox="0 0 17 17" width="17px" height="17px" className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo" data-di-res-id="a2f523df-4ed24860" data-di-rand="1587975551851">
                                                                            <path d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                    </div>
                                                                    <span class={(streetValueErr === false || isSaveAddreSelected) ? "" : streetValueErr === '' ? "greenLine" : "redLine"}></span>
                                                                    {streetValueErr && !isSaveAddreSelected && <p class="redValidaion">{streetValueErr}</p>}
                                                                </div>
                                                            </div>
                                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                                                <div className="inputControl">
                                                                    <input
                                                                        value={companyName}
                                                                        disabled={isSaveAddreSelected}
                                                                        onChange={(e) => this.comapnyNameChange(e)}
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
                                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                                                <div className="inputControl">
                                                                    <div className="select-down"></div>
                                                                    {this.state.country && <div className="">
                                                                        <select name="select" id="select" className="is-touched is-pristine av-valid"
                                                                            value={this.state.selectedCountry}
                                                                            disabled={isSaveAddreSelected}
                                                                            onChange={(e) => this.onChangeCountry(e, this.state.country)}>
                                                                            {this.state.country.map(c => {
                                                                                return (
                                                                                    <option key={c.id} value={c.id}>{c.full_name_english}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                        <span className="label-select"><FormattedMessage id="shipping.Country" defaultMessage="Country" /></span>
                                                                        {/* <span className="Select__SelectedValue-sc-155k6kv-1 cvILin">Please select</span> */}
                                                                    </div>}

                                                                </div>
                                                            </div>
                                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                                                <div className="inputControl">
                                                                    <div className="select-down"></div>
                                                                    <div className="">
                                                                        <select
                                                                            onChange={(e) => this.onChangeCity(e, this.state.CityList)}
                                                                            name="select"
                                                                            value={this.state.selectedCity}
                                                                            disabled={isSaveAddreSelected}
                                                                            id="select"
                                                                            className="is-touched is-pristine av-valid">
                                                                            {this.state.CityList.map(c => {
                                                                                return (
                                                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                        <span className="label-select"><FormattedMessage id="shipping.State" defaultMessage="State" /></span>
                                                                        {/* <span className="Select__SelectedValue-sc-155k6kv-1 cvILin">Please select</span> */}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="styled-input bUgSOh customField inputMaxHeight">
                                                                <div className="inputControl">
                                                                    <input
                                                                        value={zipCode}
                                                                        disabled={isSaveAddreSelected}
                                                                        onChange={(e) => this.zipCodeChange(e)}
                                                                        type="number" />
                                                                    <label><FormattedMessage id="shipping.POBox" defaultMessage="PO Box" /></label>
                                                                    <div className="greenCheck">
                                                                        {zipCode && zipCode.length > 0 && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                            <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                    </div>
                                                                    {zipCode && zipCode.length > 0 && <span class="greenLine"></span>}
                                                                    {/* <div className="redClose">
                                                                        {zipCodeErr === '' && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                            <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                        {zipCodeErr && zipCodeErr.length > 0 && <svg viewBox="0 0 17 17" width="17px" height="17px" className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo" data-di-res-id="a2f523df-4ed24860" data-di-rand="1587975551851">
                                                                            <path d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                    </div>
                                                                    <span class={zipCodeErr === false ? "" : zipCodeErr === '' ? "greenLine" : "redLine"}></span>
                                                                    {zipCodeErr && <p class="redValidaion">{zipCodeErr}</p>} */}
                                                                </div>
                                                            </div>
                                                            <div className="styled-input bUgSOh  checkBoxDiv customField inputMaxHeight">
                                                                <div className="inputControl">
                                                                    <div class="custom-control custom-checkbox termsCheck">
                                                                        <input type="checkbox" class="checkBoxFix custom-control-input" id="customCheck" name="example1" />
                                                                        <label class="custom-control-label checkFont" for="customCheck"><FormattedMessage id="shipping.Usebillingaddress" defaultMessage="Use this as my billing address" /></label>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            <div className="styled-input bUgSOh customField w-100">
                                                                <div className="SubmitAddress">
                                                                    <button type="button" onClick={() => this.onSubmit()} className="dNUJxY"><FormattedMessage id="checkoutContactInfo.SubmitAddress" defaultMessage="Submit Address" /></button>

                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                                </div>}
                                                {/* {this.props.shipping && (this.props.shipping.isShippingSet || this.props.shipping.defaultAddr || this.props.shipping.isClickAndCollect) &&
                                                    <div className="LoadingWrapper">
                                                        <form className="fkWgPa">
                                                            <h3 className="methodTitle" id="shippingData"><FormattedMessage id="shipping.SelectShippingMethod" defaultMessage="Select Shipping Method" /></h3>
                                                            <div className="gridMethodBox">
                                                                <div className="metodbox">
                                                                    <label className="methodBoxActive">
                                                                        <input type="radio" className="checkBtn" value="ec9515b9-415a-4cd5-b3cc-71124b355a98" checked="" />
                                                                        <div className="stageComlete"></div>
                                                                        <div className="stageText">
                                                                            <span className="eTJQXg"><FormattedMessage id="shipping.Standardshipping" defaultMessage="Standard shipping" /></span>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => this.continueToContact()} type="button" className="dNUJxY"><FormattedMessage id="shipping.ContinueContactInformation" defaultMessage="Continue to Contact Information" /></button>
                                                        </form>
                                                    </div>} */}
                                                <div className="border-margin"><hr /></div>
                                                <div className="AddressWrapper">
                                                    <div className="StepContainer">
                                                        <div className="step-section">

                                                            <div className="StepBadge">
                                                                <div type="disabled" className="StatusIconCircle">
                                                                    <span color="grey_medium" className="StatusIconText"><FormattedMessage id="cartListView.two" defaultMessage="2" /></span>
                                                                </div>
                                                                <span color="grey_medium" className="StatusTitle"><FormattedMessage id="shipping.Contactinformation" defaultMessage="Contact information" /></span>
                                                            </div>
                                                        </div>
                                                        <div className="border-margin"><hr /></div>
                                                        <div className="step-section">
                                                            <div className="StepBadge">
                                                                <div type="disabled" className="StatusIconCircle">
                                                                    <span color="grey_medium" className="StatusIconText"><FormattedMessage id="cartListView.three" defaultMessage="3" /></span>
                                                                </div>
                                                                <span color="grey_medium" className="StatusTitle"><FormattedMessage id="shipping.Payment" defaultMessage="Payment" /></span>
                                                            </div>
                                                        </div>
                                                        <div className="border-margin"><hr /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <Ordersummary />
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
        storeList: state.global.storeList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGetStoreList: (payload) => dispatch(actions.getStoreList(payload)),
        setShippingDetails: (payload) => dispatch(actions.setShippingDetails(payload)),
        onGetCountryList: () => dispatch(actions.getCountryList()),
        OnGetShippingDetails: (quoteId) => dispatch(actions.getAddressFromShippingDetails(quoteId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CheckOutForm)));
