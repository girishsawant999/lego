import React, { Suspense, Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import processFinish from '../../assets/images/processFinish.png';
import 'bootstrap/dist/css/bootstrap.css';
// import Ordersummary from '../checkOutProcess/checkOutProcessorderSummary';
import PhoneNumber from "../../common/login/phoneComponent";
import * as actions from "../../redux/actions/index";
import Spinner2 from "../Spinner/Spinner2";
import { checkoutEvent } from '../utility/googleTagManager';
import { createMetaTags } from '../utility/meta';
import $ from 'jquery';


const Ordersummary = React.lazy(() => import('../checkOutProcess/checkOutProcessorderSummary'))

let setDeliveryCalled = false;
let scroll = true;

class CheckoutContactInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isdefaultPhone: false,
            carrier_code: "",
            contact_number: "",
            phoneErr: false,
            email: '',
            emailErr: false
        }

        setDeliveryCalled = false;
    }

    componentWillMount = () => {
        scroll = true;
        if (!this.props.shipping ||  (this.props.shipping && !this.props.shipping.isShippingSet && !this.props.shipping.defaultAddr && !this.props.shipping.isClickAndCollect)) {
           this.props.history.push(`/${this.props.globals.store_locale}/cart`);
        } else if (this.props.myCart && this.props.myCart.cart_count === 0) {
            this.props.history.push(`/${this.props.globals.store_locale}/cart`);
        } else {
            let email = '';
            let emailErr = false;
            let carrier_code = '';
            let contact_number = '';
            let phoneErr = false;
            let isdefaultPhone = false;
            let { user_details } = this.props;
            if (this.props.shipping.mnumber && this.props.shipping.carrier_code) {
                email = this.props.shipping.email;
                emailErr = '';
                carrier_code = this.props.shipping.carrier_code;
                contact_number = this.props.shipping.mnumber;
                phoneErr = '';
                isdefaultPhone = true;
            } else if (user_details && user_details.customer_details && 
                user_details.customer_details.carrier_code && user_details.isUserLoggedIn &&
                user_details.customer_details.phone_number) {
                    email = user_details.customer_details.email;
                    emailErr = '';
                    carrier_code = user_details.customer_details.carrier_code;
                    contact_number = user_details.customer_details.phone_number;
                    phoneErr = '';
                    isdefaultPhone = true;
            }
            this.setState({
                email: email,
                emailErr: emailErr,
                carrier_code: carrier_code,
                contact_number: contact_number,
                phoneErr: phoneErr,
                isdefaultPhone: isdefaultPhone,
            });
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
            step: 2,
            product: productList
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.shipping ||  (nextProps.shipping && !nextProps.shipping.isShippingSet && !nextProps.shipping.defaultAddr
            && !nextProps.shipping.isClickAndCollect)) {
            this.props.history.push(`/${this.props.globals.store_locale}/cart`);
        } else if (this.props.myCart && this.props.myCart.cart_count === 0) {
             this.props.history.push(`/${this.props.globals.store_locale}/cart`);
        }
    }

    contactNumber = (status, value, countryData, number, id) => {
		if (status) {
			this.setState({ contact_number: value, carrier_code: countryData.dialCode, isdefaultPhone: true })
			this.setState({ phoneErr: "" })
			return true
		} else {
			value && value.length > 0
				? this.setState({ phoneErr: this.props.globals.store_locale === 'en' ? "Phone number is invalid!" : "رقم الهاتف غير صالح!" })
				: this.setState({ phoneErr: this.props.globals.store_locale === 'en' ? "Phone number should not be empty!" :"يجب ألا يكون رقم الهاتف فارغًا!"})
			return false
		}
    }

    emailChange = (e) => {
        var email = e ? e.target.value : this.state.email;
        if (email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)) {
            this.setState({
                email: e.target.value,
                emailErr: ''
            });
            
            // this.setState({
            //     email: '',
            //     emailErr: this.props.globals.store_locale === 'en' ? 'This is a required field' : 'This is a required field'
            // });
        } else {
            email.length > 0
				? this.setState({email, emailErr: this.props.globals.store_locale === 'en' ?  "Email is invalid!": "البريد الإلكتروني غير صالح!" })
				: this.setState({email, emailErr: this.props.globals.store_locale === 'en' ? "Email should not be empty!" : "يجب ألا يكون البريد الإلكتروني فارغًا!"})
			return false
            // this.setState({
            //     email: e.target.value,
            //     emailErr: ''
            // });
        }

        this.forceUpdate();
    }

    isAllValueFilled = () => {
        if (this.state.emailErr === '' && this.state.phoneErr === '') {
            return true;
        } else {
            if (this.state.emailErr === false) {
                this.setState({
                    email: '',
                    emailErr: this.props.globals.store_locale === 'en' ? 'This is a required field' : 'هذا الحقل مطلوب'
                });
            }

            if (this.state.phoneErr === false) {
                this.setState({
                    phoneErr: this.props.globals.store_locale === 'en' ? "Phone number is invalid!" : "رقم الهاتف غير صالح!"
                });
            }
        }
    }

    submitData = () => {
        if (this.isAllValueFilled() && this.props.shipping && this.props.shipping.isShippingSet) {
            let shippingData = this.props.shipping;
            shippingData.mnumber = this.state.contact_number;
            shippingData.email = this.state.email;
            shippingData.carrier_code = this.state.carrier_code;
            shippingData.address_object.telephone = this.state.contact_number;
            shippingData.address_object.carrier_code = this.state.carrier_code;
            setDeliveryCalled = true;
            this.props.setShippingDetails(shippingData);
            this.props.setAddressFromShippingDetails(shippingData);
        } else if (this.isAllValueFilled() && this.props.shipping && this.props.shipping.defaultAddr) {
            let customer_id='';
            let quote_id = "";
            if (this.props.user_details.customer_details.quote_id) {
                customer_id = this.props.user_details.customer_details.customer_id
                quote_id = this.props.user_details.customer_details.quote_id;
            } else if(this.props.guest_user.new_quote_id){
                quote_id = this.props.guest_user.new_quote_id;
            } else{
                quote_id="";
            }

            let shippingData ={
                quote_id: quote_id,
                address_id: this.props.shipping.Id,
                shipping_code:"tablerate_bestway",
                address_object: {},
                fname: this.props.shipping.userFirstName,
                lname: this.props.shipping.userLastName,
                cnumber: customer_id,
                mnumber: this.state.contact_number,
                email: this.state.email,
                lego_store_id: this.props.globals.currentStore,
                store_id: this.props.globals.currentStore, 
                carrier_code: this.state.carrier_code,
                shipping : "true",
                billing : "true",
                AptValue: this.props.shipping.customer_appartment,
                companyName: this.props.shipping.company,
                address_object: {
                    country_id: this.props.shipping.country_id,
                    state: this.props.shipping.state,
                    region_id: this.props.shipping.region_id,
                    city: this.props.shipping.city,
                    postcode: this.props.shipping.postcode,
                    street: this.props.shipping.street,
                    carrier_code: this.state.carrier_code,
                }
            }
    
            setDeliveryCalled = true;
            this.props.setShippingDetails(shippingData);
            this.props.setAddressFromShippingDetails(shippingData);
        } else if (this.isAllValueFilled() && this.props.shipping && this.props.shipping.isClickAndCollect) {
            let shippingData = this.props.shipping.clickAndCollect;
            shippingData.email = this.state.email;
            shippingData.mnumber = this.state.contact_number;
            shippingData.carrier_code = this.state.carrier_code;
            shippingData.address_object.carrier_code = this.state.carrier_code;
            let shippingNewData = this.props.shipping;
            shippingNewData.clickAndCollect = shippingData;
            setDeliveryCalled = true;
            this.props.setShippingDetails(shippingNewData);
            this.props.setAddressFromShippingDetails(shippingData);
        }
    }

    editShiping = () => {
        this.props.history.push(`/${this.props.globals.store_locale}/shipping`);
    }

    
    render() {
        const { shipping, globals } = this.props;
        let { email, emailErr } = this.state;
        let defaultPhoneNumber = {}
        if (globals.loading) {
            return (
                <div className="mobMinHeight">
                    <Spinner2 />
                </div>
            )
        }
		if (this.state.isdefaultPhone) {
			defaultPhoneNumber = {
				...defaultPhoneNumber,
				carrier_code: this.state.carrier_code,
				contact_number: this.state.contact_number,
			}
        }

        if (this.props.shippingSuccess && setDeliveryCalled) {
            return <Redirect to={{
                pathname: `/${globals.store_locale}/checkoutPaymentMethod`
            }} />
        }

        if (scroll && $('#ContactInformation').offset()) {
            scroll = false;
          $('html, body').animate(
            {
              scrollTop: 390,
            },
            500
          );
          
        }

        return (
            <Suspense fallback={<div ></div>}>
            <div>
                {createMetaTags(
              this.props.globals.store_locale === "en"
                 ? "Contact Info | Official LEGO® Online Check Saudi Arabia"
                 : "معلومات للتواصل | متجر ليغو أونلاين الرسمي بالسعودية ",
              this.props.globals.store_locale === "en"
                 ? "Explore the world of LEGO® through games, videos, products and more! Shop awesome LEGO® building toys and brick sets and find the perfect gift for your kid"
                 : "اكتشف عالم ليغو LEGO من خلال الألعاب، والفيديوهات، والمنتجات وأكثر! تسوق مجموعات ألعاب البناء و المكعبات المدهشة من ليغو LEGO واعثر على الهدية المثالية لطفلك",
              this.props.globals.store_locale === "en"
                 ? "LEGO, Online Store, Saudi Arabia, Bricks, Building Blocks, Construction Toys, Gifts"
                 : "ليغو LEGO، تسوق اونلاين، السعودية، مكعبات، مكعبات بناء، العاب تركيب، هدايا"
           )}
                <div className="checkoutContactInfo">
                    <div className="cart-grid">
                    <div className="container">
                        
                        <div className="row">
                            <div className="col-md-8">
                                
                                    <div className="row">
                                    <div className="col-md-12 mobPadding">
                                            <div className="StepContainerShipping">
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
                                                                className="editOption"><FormattedMessage id="checkoutContactInfo.Edit" defaultMessage="Edit" /></button>
                                                        </div>
                                                    </div>
                                                    
                                                    </div>
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
                                                                ${shipping.address_object.postcode}`}
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
                                                                ${shipping.postcode ? shipping.postcode : ''}`}
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
                                                            <span className="smallTitle"><FormattedMessage id="checkoutContactInfo.ShippingMethod" defaultMessage="Shipping Method" /></span>
                                                          </span>
                                                            <span color="grey_dark">
                                                                <span className="bigDesc"><FormattedMessage id="checkoutContactInfo.Standardshipping" defaultMessage="Standardshipping" /></span>
                                                            </span>
                                                        </li>
                                                    </ul> 
                                                    </div>                                           
                                               
                                                <div className="AddressWrapper">
                                                    <div className="StepContainerShipping">
                                                        <div className="step-section">
                                                        
                                                            <div className="StepBadge">
                                                                <div id="ContactInformation" type="disabled" className="StatusIconCircle">
                                                                    <span color="grey_medium" className="StatusIconText"><FormattedMessage id="checkoutContactInfo.two" defaultMessage="2" /></span>
                                                                </div>
                                                                <span color="grey_medium" className="StatusTitle"><FormattedMessage id="checkoutContactInfo.Contactinformation" defaultMessage="Contact information" /></span>
                                                            </div>
                                                        </div>
                                                        <div className="border-margin"><hr className="mb-0" /></div>  
                                                            <div className="step-section">
                                                    
                                                    <div className="AddressWrapper findAddress">
                                                        <h3 className="step-title"><FormattedMessage id="checkoutContactInfo.EnterContactDetails" defaultMessage="Enter Contact Details" /></h3>
                                                        <span className="infoTagline"><FormattedMessage id="checkoutContactInfo.info" defaultMessage="We'll use this information to send you a receipt and keep you posted on the status of your order." /></span>
                                                        <form className="mt-6">
                                                        <div className="styled-input bUgSOh customField">
                                                                <div className="inputControlmb-0">
                                                                    <input
                                                                        value={email}
                                                                        onChange={(e) => this.emailChange(e)}
                                                                        type="text" />
                                                                    <label><FormattedMessage id="contactUs.email" defaultMessage="Email" /></label>
                                                                    <div className="greenCheck">
                                                                        {emailErr === '' && <svg width="20px" height="13px" className="Inputstyles__StatusIconTick-sc-12nwzc4-5 bBiyIO" viewBox="0 0 20 13" data-di-res-id="8f6a84aa-8d165f58" data-di-rand="1587975367013">
                                                                            <path d="M0 5.703L7.177 13 20 0h-4.476L7.177 8.442 4.476 5.723H2.238z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                        {emailErr && emailErr.length > 0 && <svg viewBox="0 0 17 17" width="17px" height="17px" className="Inputstyles__StatusIconCross-sc-12nwzc4-6 bjcPDo" data-di-res-id="a2f523df-4ed24860" data-di-rand="1587975551851">
                                                                            <path d="M10.377 8.142l5.953-5.954-2.234-2.234-5.954 5.954L2.188-.046-.046 2.188l5.954 5.954-5.954 5.954 2.234 2.234 5.954-5.953 5.954 5.953 2.234-2.234z" fill="currentColor" fill-rule="evenodd"></path>
                                                                        </svg>}
                                                                    </div>
                                                                    <span class={emailErr === false ? "" : emailErr === '' ? "greenLine" : "redLine"}></span>
                                                                    {emailErr && <p class="redValidaion">{emailErr}</p>} 
                                                                </div>
                                                            </div>
                                                            <div className="styled-input bUgSOh customField">
                                                                <div className="inputControlmb-0">
                                                                    <label for="phone"> <FormattedMessage id="createAccountMobile.Register" defaultMessage="Mobile Number" /></label>
                                                                    <PhoneNumber
                                                                        changed={this.contactNumber}
                                                                        isdefaultPhone={this.state.isdefaultPhone}
                                                                        defaultPhone={{ ...defaultPhoneNumber }}
                                                                    />
                                                                    {/* <PhoneNumber changed={this.contactNumber} /> */}
                                                                    {this.state.phoneErr && <span className="redValidaion">{this.state.phoneErr}</span>}
                                                                </div>
                                                            </div>
                                                            {/* <div className="styled-input bUgSOh customField w-100">
                                                            <p className="tagline">Search for your address by entering a street name.</p>
                                                                <div className="inputControlmb-0">
                                                                    <input type="text" required />
                                                                    <label>Find address</label>
                                                                    <span></span> 
                                                                </div>
                                                            </div> */}
                                                            {/* <div className="styled-input bUgSOh w-100 customField">
                                                                <div className="inputControlmb-0">
                                                                <div className="checkboxcheck custom-checkbox mb-4">
                                                                    <input type="checkbox" className="custom-control-input" id="p-type1" checked=""/>
                                                                    <label className="customControlLabel pl-3"><FormattedMessage id="checkoutContactInfo.billingAddr" defaultMessage="Use this as my billing address" /></label>
                                                                </div>
                                                                <span className="infoDescBig"><FormattedMessage id="checkoutContactInfo.tnc" defaultMessage="By signing up to receive emails from LEGO® Shop, you agree that we may use the personal information provided by you to send you marketing emails. You can opt out of these emails any time by clicking the unsubscribe link or by contacting customer service. To see how to control your personal data, please see our" /> <a href="#" target="_blank"><FormattedMessage id="checkoutContactInfo.Privacypolicy" defaultMessage="Privacy policy" /></a>.</span>
                                                                </div>
                                                            </div> */}
                                                                                                                   
                                                            <div className="styled-input w-100">
                                                            <div className="inputControlmb-0">
                                                                <button type="button"
                                                                 onClick={() => this.submitData()}
                                                                    className="dNUJxY mt-4"><FormattedMessage id="checkout.ContinueToPayment" defaultMessage="Continue to Payment" /></button>
                                                                {/* <div className="styles__ButtonFlexWrapper-rj3029-5 crELmO">
                                                                    <button className="anotherAdress">Can't see your address? Enter it manually</button>
                                                                </div> */}
                                                                </div>
                                                            </div>

                                                        </form>
                                                        
                                                    </div> 
                                                    </div>
                                                    </div>
                                                    </div>
                                                                <div className="border-margin"><hr className="mb-0" /></div>  
                                                                <div className="AddressWrapper">
                                                    <div className="StepContainer">
                                                                <div className="step-section">
                                                                    <div className="StepBadge">
                                                                        <div type="disabled" className="StatusIconCircle">
                                                                            <span color="grey_medium" className="StatusIconText"><FormattedMessage id="checkoutContactInfo.three" defaultMessage="3" /></span>
                                                                        </div>
                                                                        <span color="grey_medium" className="StatusTitle"><FormattedMessage id="checkoutContactInfo.Payment" defaultMessage="Payment" /></span>
                                                                    </div>
                                                                </div>
                                                                <div className="border-margin"><hr className="mb-0" /></div>  
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
            </Suspense>
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
        shippingSuccess: state.myCart.shippingSuccess,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
        setShippingDetails: (payload) => dispatch(actions.setShippingDetails(payload)),
        setAddressFromShippingDetails: (payload) => dispatch(actions.setAddressFromShippingDetails(payload)),
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CheckoutContactInfo)));