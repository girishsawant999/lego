import React, { Component } from 'react';
import LogoSlider from '../../components/HomeComponent/logoSlider';
import { Link } from 'react-router-dom';
import ThanksIcon from '../../assets/images/icons/thanksIcon.png';
import logocheck from '../../assets/images/icons/LEGO.gif';
import thankyou from '../../assets/images/thankYou.PNG';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import ThankyouSidebar from '../Myaccount/thankyouSidebar';
import Spinner from "../../components/Spinner/Spinner2";
import { initializeGTMWithEvent, purchaseEvent } from '../utility/googleTagManager';

let success = 'true';
let count = 0;
const Cryptr = require('cryptr');
let cryptr = null;
let cryptrOrderId = null;

let isGTMcalled = false;
let isGetCart = false;
class ThankYouPage extends Component {
    constructor(props) {
        super(props);
        
    }
    componentDidMount() {
      const query = new URLSearchParams(this.props.location.search);
      // if(!query.get('order_id') && !query.get('paytype')){
      //    this.props.history.push(`/${this.props.globals.store_locale}/myOrder`)
      //    return
      // }
      cryptrOrderId = new Cryptr("mihyarOrderId");
      cryptr = new Cryptr(cryptrOrderId.decrypt(query.get('order_id')));
      this.props.setShippingDetails({
         isClickAndCollect: false,
         isShippingSet: false,
         defaultAddr: false,
      });
      this.props.setBillingDetails({
         "shipping" : "false",
         "billing" : "false"
      });

      if (query.get('paytype') == 'COD') {
          this.props.orderJson({
              store_id: this.props.globals.currentStore ? this.props.globals.currentStore : query.get('store_id'),
              order_id: cryptrOrderId.decrypt(query.get('order_id'))
          });
         if (!this.props.user_details.isUserLoggedIn &&
            (this.props.guest_user.temp_quote_id === null || this.props.guest_user.temp_quote_id === "")) {
            this.props.onGetGuestCartId();
         }
      } else {
          success = cryptr.decrypt(query.get('status'));
          // if (success == 'true') {
          this.props.orderJson({
              store_id: this.props.globals.currentStore ? this.props.globals.currentStore : query.get('store_id'),
              order_id: cryptrOrderId.decrypt(query.get('order_id'))
          });
          // }
          if (query.get('order_id') && query.get('store_id')) {
              success = cryptr.decrypt(query.get('status'));
          }
      }
  }

  componentWillReceiveProps(nextProps){
   if(nextProps.order && nextProps.order.order_number && nextProps.order.status && !isGTMcalled){
      let ecomArray = [];
      let item = nextProps.order.product_details;

      for(let i = 0 ; i< item.length ; i++){
         ecomArray.push({
            content_type: 'product',
            // sku: item[i].sku,
            id: item[i].sku,
            brand: 'Google',
            name: item[i].product_name ? item[i].product_name : 'Not set',
            price: parseInt(item[i].special_price) && (parseInt(item[i].special_price) !== parseInt(item[i].price)) ? parseFloat(item[i].special_price) : (parseInt(item[i].price)),
            quantity: parseInt(item[i].qty_orderded),
            coupon: '',
        });
      }

      purchaseEvent({
         actionField: {
             id: nextProps.order.order_number,
             affiliation: 'Online Store',
             revenue: nextProps.order.order_summary.total,
             tax: nextProps.order.order_summary.vat,
             shipping: nextProps.order.order_summary.shipping,
             currency: nextProps.order.order_summary.currency,
             coupon: ''
         },
         product: ecomArray
     });
     isGTMcalled = true;
   }
   const query = new URLSearchParams(this.props.location.search);
   let guest_quote_id = query.get("quote");
   if (nextProps.order && nextProps.order.order_number && 
      nextProps.myCart.cart_count === 0 && guest_quote_id && !isGetCart && query.get('paytype') !== 'COD') {   
      isGetCart = true;
         this.props.updateQuoteID(guest_quote_id);
         this.props.getGuestCartId(guest_quote_id);
      }
  }

    render() {
      if (!this.props.order || !this.props.order.order_status_details || 
         !this.props.order.order_status_details.order_status || this.props.globals.loading) {
         return (
             <Spinner />
         )
     }
        const store_locale=this.props.globals.store_locale
        return (
            <div>
                <div className="ThankYouPage">
                   {/* <LogoSlider /> */}
                   <div className="container">
                   <div className="orderThank">
         <div className="row">
            <div className="col-md-8">
               {/* 
               <p className="orderSubtitle"> Order History
               </p>
               */}
               <div className="thankYouGrid">
                  <div className="row">
                     <div className="col-3"> 
                        <img src={thankyou} className="img-responsive" alt="thankyou" />
                     </div>
                     <div className="col-9">
                        <div className="rightBlock">
                        
                        <p className="placedTitle">{this.props.order.order_status_details && this.props.order.order_status_details.order_status_message && this.props.order.order_status_details.order_status_message} </p>
                        {/* <p className="backorder">A copy of your receipet will be mailed to <a href="mailto:john.mavelian@lego.com">john.mavelian@lego.com</a> </p> */}
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="orderInfo">
                  <div className="OrderDetailsDiv">
                     <div className="row">
                        <div className="col-md-12">
                           <div className="logoDiv">
                              <ul className="list-inline">
                                 <li className="list-inline-item">  
                                    <img src={logocheck} alt="logo" className="tblLogo" />
                                 </li>
                                 <li className="list-inline-item">
                                    <p className="detailsTitle">
                                    <FormattedMessage id="Check.thankYou.OrderReceipt" defaultMessage="Order Receipt" />
                                    </p>
                                    <p className="detailsTitle">
                                    <FormattedMessage id="Check.thankYou.ordernumber" defaultMessage="order number" />
                                     - {this.props.order.order_number && this.props.order.order_number}</p>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="orderStatus">
                     <div className="row">
                        <div className="col-md-6">
                           <div className="statusShiped">
                              <ul className="list-inline">
                                 <li className="list-inline-item">
                                    <p className="mainTitle">
                                    <FormattedMessage id="Check.DeliveryAddress" defaultMessage="Delivery Address" />
                                    </p>
                                    <p className="dataTitle">{this.props.order && this.props.order.shipping_address && this.props.order.shipping_address.deliver_to && this.props.order.shipping_address.deliver_to},</p>
                                    <p className="dataTitle">{this.props.order && this.props.order.shipping_address && this.props.order.shipping_address.street} , {this.props.order && this.props.order.shipping_address && this.props.order.shipping_address.city}, {this.props.order && this.props.order.shipping_address && this.props.order.shipping_address.country},{this.props.order && this.props.order.shipping_address && this.props.order.shipping_address.postcode},</p>
                                    <p className="dataTitle">
                                    <FormattedMessage id="addForm.phoneNo" defaultMessage="Phone Number" />
                                    &nbsp;-&nbsp;{this.props.order && this.props.order.shipping_address.phone_number && this.props.order.shipping_address.phone_number}</p>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="orderStatus">
                     <div className="row">
                        <div className="col-md-6">
                           <div className="statusShiped">
                              <ul className="list-inline">
                                 <li className="list-inline-item">
                                    <p className="mainTitle">
                                    <FormattedMessage id="checkoutpaymentMethod.BillingAddress" defaultMessage="Billing Address" />
                                    </p>
                                    <p className="dataTitle">{this.props.order && this.props.order.billing_address && this.props.order.billing_address.deliver_to && this.props.order.billing_address.deliver_to},</p>
                                    <p className="dataTitle">{this.props.order && this.props.order.billing_address && this.props.order.billing_address.street} , {this.props.order && this.props.order.billing_address && this.props.order.billing_address.city}, {this.props.order && this.props.order.billing_address && this.props.order.billing_address.country},{this.props.order && this.props.order.billing_address && this.props.order.billing_address.postcode},</p>
                                    <p className="dataTitle">
                                    <FormattedMessage id="addForm.phoneNo" defaultMessage="Phone Number" />
                                    &nbsp;-&nbsp;{this.props.order && this.props.order.shipping_address.phone_number && this.props.order.billing_address.phone_number}</p>
                                    
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="orderStatus">
                     <div className="row">
                        <div className="col-md-6">
                           <div className="statusShiped">
                              <ul className="list-inline">
                                 <li className="list-inline-item">
                                    <p className="mainTitle">
                                    <FormattedMessage id="check.DeliveryType" defaultMessage="Delivery Type" />
                                    </p>
                                    <p className="dataTitle">{this.props.order && this.props.order.delivery_type && this.props.order.delivery_type}</p>
                                   
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="orderStatus">
                     <div className="row">
                        <div className="col-md-6">
                           <div className="statusShiped">
                              <ul className="list-inline">
                                 <li className="list-inline-item">
                                    <p className="mainTitle"><FormattedMessage id="check.PaymentMethod" defaultMessage="Payment Method" /></p>
                                    <p className="dataTitle">{this.props.order && this.props.order.payment_type && this.props.order.payment_type}</p>
                                   
                                    
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
              <div className="col-12 text-center mb-5">
              <Link to={`/${this.props.globals.store_locale}`}>
                  <button className="ctnShopping">
                  <FormattedMessage id="checkoutOrderSummary.ContinueShopping" defaultMessage="Continue Shopping" />
                  </button>
              </Link>
              </div>
            </div>
            <div className="col-md-4">
               <ThankyouSidebar order_summary={this.props.order.order_summary} product_data={this.props.order.product_details} />
            </div>
         </div>
         </div>
      </div>
                </div>
                </div>
           
        )
    }
}

const mapStateToProps = state => {
    return {
       globals:state.global,
       order: state.orders.order_summary.order_data,
       myCart: state.myCart,
       user_details: state.login,
       guest_user: state.guest_user
    };
 }
 const mapDispatchToProps = dispatch => {
 return {
   setShippingDetails: (payload) => dispatch(actions.setShippingDetails(payload)),
   setBillingDetails: (payload) => dispatch(actions.setBillingDetails(payload)),
   orderJson: (data) => dispatch(actions.orderJson(data)),
   updateQuoteID: (guest_quote_id) => dispatch(actions.updateQuoteID(guest_quote_id)),
   getGuestCartId: (guest_quote_id) => dispatch(actions.getGuestCartId(guest_quote_id)),
   onGetGuestCartId: () => dispatch(actions.getGuestCartId()),

 }
 }
 export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(ThankYouPage)));
