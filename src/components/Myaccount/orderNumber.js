import React, { Component } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import LogoSlider from '../HomeComponent/logoSlider';
import topImg from '../../assets/images/icons/needHelpOne.png';
import Needhelp  from './NeedHelp';
import Pimg from '../../assets/images/shopBy1.jpeg';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index';
import Spinner2 from "../../components/Spinner/Spinner2"
import { Link } from "react-router-dom"

const Cryptr = require('cryptr');
let cryptr = null;
let cryptrOrderId = null;
let order_id = null;
class OrderNumber extends Component {
constructor(props) {
super(props);

}

componentWillMount = () => {
   if (!this.props.user_details.customer_details.customer_id) {
      this.props.history.push(`/${this.props.globals.store_locale}/login`)
      return
   }
   cryptrOrderId = new Cryptr("legoOrderId");
   let orderIdURL = window.location.pathname.split('/')
   orderIdURL = orderIdURL[orderIdURL.length-1]
   let orderId = cryptrOrderId.decrypt(orderIdURL);
   if (orderId) {
      order_id = orderId;
      this.props.onGetOrderDetailsInProfile({ orderEntityid: order_id, store_id: this.props.globals.currentStore })
   }   
}

render() {
   const { orders_details } = this.props;
		if (this.props.orderLoader) {
			return (
				<div className="mobMinHeight">
					<Spinner2 />
				</div>
			)
      }

return (
<div>
   <div className="orderNumber">
      {/* <LogoSlider /> */}
      {orders_details && orders_details.items_ordered && orders_details.items_ordered.length > 0 && <div className="container">
         <div className="row bBottom">
            <div className="col-md-9 col-9">
               <Breadcrumb />
               <p className="orderNumtitle"> <span><FormattedMessage id="OrderHistory.OrderNumber" defaultMessage="Order Number" /></span> - <span>{orders_details.increment_id}</span>
               </p>
            </div>
            <div className="col-md-3 col-3 p-0">
               <div className="topImage">
                  <img src={topImg} alt="top"/>
               </div>
            </div>
         </div>
         <div className="row">
            <div className="col-md-12">
               <div className="orderNumInfo">
                  <div className="row">
                     <div className="col-md-4 brRight">
                        <div className="OrderAddress">
                           <p className="heading-title">
                              <FormattedMessage id="OrderHistory.ShippingAddress" defaultMessage="Shipping Address" />
                           </p>
                           <p className="DeliveryTo">
                              <span className="add">  <FormattedMessage id="OrderHistory.DeliveryTo" defaultMessage="Delivery To : " /></span>  <span className="addText"> {orders_details.shipping_address.firstname} {orders_details.shipping_address.lastname} {orders_details.shipping_address.street} {orders_details.shipping_address.city} {orders_details.shipping_address.postcode} {orders_details.shipping_address.region}</span> 
                           </p>
                        </div>
                     </div>
                     <div className="col-md-4 brRight">
                        <div className="OrderShipping">
                           <p className="heading-title">
                              <FormattedMessage id="OrderHistory.shipping" defaultMessage="shipping" />
                           </p>
                           <p className="DeliveryAddress">
                           <FormattedMessage id="OrderHistory.Deliveryaddress" defaultMessage="Delivery to the address" />
                           </p>
                        </div>
                     </div>
                     <div className="col-md-4">
                        <div className="OrderPayment">
                           <p className="heading-title">
                              <FormattedMessage id="OrderHistory.payment" defaultMessage="payment" />
                           </p>
                           <p className="DeliveryAddress">
                              {orders_details.payment_method}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               {orders_details.items_ordered.map((item) => {
                  return (
                        <>
                            {item.price === 0 && <div className="border-div">
                                <div className="productDescLine mb-2">
                                   <div className="col-12">
                                    <div className="row">
                                        <div className="descBackgroudPro">
                                        <img  className="img-left" src={item.image[0]} alt="banner1" />
                                        <p className="productDes">
                                            <FormattedMessage id="checkoutOrderSummary.Free" 
                                                defaultMessage="FREE " />
                                                {' ' + item.name}
                                            </p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>}
                        </>
                        )})}
               {orders_details.items_ordered.map((item) =>{
                  return (
                     <>
                     {item.price !== 0 && <div className="orderProduct">
                        <div className="row">
                           <div className="col-3 col-md-2 pR0">
                              <div className="OrderImage">
                              <Link to={`/${this.props.globals.store_locale}/productdetails/${item.url_key}`}>
                                 <img src={item.image[0]} alt="product"/> 
                              </Link>
                              </div>
                           </div>
                           <div className="col-5 col-md-6">
                              <div className="OrderDetails">
                                 <Link to={`/${this.props.globals.store_locale}/productdetails/${item.url_key}`}>
                                 <p className="Ptitle">
                                    {item.name}
                                 </p>
                                 </Link>
                                 <p className="color">
                                    <span className="colorLabel"><FormattedMessage id="OrderHistory.Color" defaultMessage="Color :" /></span> <span className="colorC"><FormattedMessage id="OrderHistory.Grey" defaultMessage="Grey" /></span>
                                 </p>
                                 <p className="size">
                                    <span className="sizeLabel"><FormattedMessage id="OrderHistory.Size" defaultMessage="Size :" /></span> <span className="sizeS">25</span>
                                 </p>
                                 <p className="NumberId">
                                 {item.product_id}
                                 </p>
                              </div>
                           </div>
                           <div className="col-4 col-md-4 pL0">
                              <div className="OrderTotals">
                                 <p className="now">
                                    <span className="nowN"><FormattedMessage id="OrderHistory.Now" defaultMessage="Now" /> </span> <span className="nowN">{item.currency} {item.price}</span>
                                 </p>
                                 <p className="Qty">
                                    <span className="QtyQ">{item.qty_ordered} </span> <span className="QtyQ"><FormattedMessage id="OrderHistory.Quantity" defaultMessage="Quantity" /></span>
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>}
                     </>
                  )
               })}

               
               {/*<div className="orderProduct">
                  <div className="row">
                     <div className="col-3 pR0">
                        <div className="OrderImage">
                           <img src={Pimg} /> 
                        </div>
                     </div>
                     <div className="col-5">
                        <div className="OrderDetails">
                           <p className="Ptitle">
                              International Space 
                           </p>
                           <p className="color">
                              <span className="colorLabel">Color :</span> <span className="colorC">Grey</span>
                           </p>
                           <p className="size">
                              <span className="sizeLabel">Size :</span> <span className="sizeS">25</span>
                           </p>
                           <p className="NumberId">
                              5484515
                           </p>
                        </div>
                     </div>
                     <div className="col-4 pL0">
                        <div className="OrderTotals">
                           <p className="now">
                              <span className="nowN">Now </span> <span className="nowN">AED 259</span>
                           </p>
                           <p className="was">
                              <span className="wasW">Was </span> <span className="wasW">AED 300</span>
                           </p>
                           <p className="Percentage">
                              <span className="PerP">% Saving</span> <span className="PerP">20</span>
                           </p>
                           <p className="Qty">
                              <span className="QtyQ">2 </span> <span className="QtyQ">Quantity</span>
                           </p>
                        </div>
                     </div>
                  </div>
            </div>   */}
               {/*<div className="orderProduct">
                  <div className="row">
                     <div className="col-3 pR0">
                        <div className="OrderImage">
                           <img src={Pimg} /> 
                        </div>
                     </div>
                     <div className="col-5">
                        <div className="OrderDetails">
                           <p className="Ptitle">
                              International Space 
                           </p>
                           <p className="color">
                              <span className="colorLabel">Color :</span> <span className="colorC">Grey</span>
                           </p>
                           <p className="size">
                              <span className="sizeLabel">Size :</span> <span className="sizeS">25</span>
                           </p>
                           <p className="NumberId">
                              5484515
                           </p>
                        </div>
                     </div>
                     <div className="col-4  pL0">
                        <div className="OrderTotals">
                           <p className="now">
                              <span className="nowN">Now </span> <span className="nowN">AED 259</span>
                           </p>
                           <p className="was">
                              <span className="wasW">Was </span> <span className="wasW">AED 300</span>
                           </p>
                           <p className="Percentage">
                              <span className="PerP">% Saving</span> <span className="PerP">20</span>
                           </p>
                           <p className="Qty">
                              <span className="QtyQ">2 </span> <span className="QtyQ">Quantity</span>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>   */}
               <div className="oderNumSummary">
                  <p className="head-summary"><FormattedMessage id="OrderHistory.OrderSummary" defaultMessage="Order Summary" /></p>
                  <div className="orderSumDiv">
                     <div className="row">
                        <div className="col-6">
                           <p className="orderSub">
                               <FormattedMessage id="OrderHistory.Subtotal" defaultMessage="Sub total" />
                           </p>
                        
                        </div>
                        <div className="col-6">
                           <div className="orderTatalAmt">
                              <p className="orderper">
                                 <span className="orderperLabl">{orders_details.order_summary.currency}</span> <span className="orderperLabl">{orders_details.order_summary.subtotal}</span>
                              </p>
                            
                           </div>
                        </div>
                     </div>
                     <div className="row">
                        <div className="col-6">
                           <p className="orderSub">
                              <FormattedMessage id="OrderHistory.Saving" defaultMessage="Saving" />
                           </p>
                         
                        
                        </div>
                        <div className="col-6">
                           <div className="orderTatalAmt">
                              <p className="orderper">
                                 <span className="orderperLabl">{orders_details.order_summary.currency}</span> <span className="orderperLabl">{orders_details.order_summary.discount_amount}</span>
                              </p>
                           
                           </div>
                        </div>
                     </div>
                     <div className="row">
                        <div className="col-6">
                           <p className="orderSub">
                                 <FormattedMessage id="OrderHistory.ShippingAmount" defaultMessage="Shipping Amount" />&nbsp;
                           </p>
                        </div>
                        <div className="col-6">
                           <div className="orderTatalAmt">
                              <p className="orderper">
                                 <span className="orderperLabl">{orders_details.order_summary && orders_details.order_summary.currency} &nbsp;{orders_details.order_summary && orders_details.order_summary.vat && orders_details.order_summary.shipping_amount} </span>
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="row">
                        <div className="col-6">
                           <p className="orderSub">
                                 <FormattedMessage id="OrderHistory.VAT" defaultMessage="VAT" />&nbsp;
                                 ( {orders_details.order_summary.vat_percentage}% )
                           </p>
                        </div>
                        <div className="col-6">
                           <div className="orderTatalAmt">
                              <p className="orderper">
                                 <span className="orderperLabl">{orders_details.order_summary && orders_details.order_summary.currency} &nbsp;{orders_details.order_summary && orders_details.order_summary.vat && orders_details.order_summary.vat} </span>
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="row">
                        <div className="col-6">
                           <p className="orderAmt">
                              <FormattedMessage id="OrderHistory.Totalamount" defaultMessage="Total amount" />
                           </p>
                        </div>
                        <div className="col-6">
                           <div className="orderTatalAmt">
                              <p className="orderperAmt">
                                 <span className="orderperAmount">{orders_details.order_summary.currency}</span> <span className="orderperAmount">{orders_details.order_summary.grand_total}</span>
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <p className="head-summary"><FormattedMessage id="OrderHistory.OrderStatus" defaultMessage="Order Status" /></p>
                  <div className="orderSumDiv">
                     <div className="row">
                        <div className="col-6">
                           <p className="orderSub">
                              <FormattedMessage id="myOrder.status" defaultMessage="Status" />
                           </p>
                        
                        </div>
                        <div className="col-6">
                           <div className="orderTatalAmt">
                              <p className="orderper">
                                 <span className="orderperLabl"></span> <span className="orderperLabl">{orders_details.order_summary.status}</span>
                              </p>
                            
                           </div>
                        </div>
                        </div>
                     </div>
                  <p className="head-summary"><FormattedMessage id="OrderHistory.paymentsummary" defaultMessage="payment summary" /></p>
                  <div className="orderSumDiv">
                     <div className="row">
                        <div className="col-6">
                           <p className="orderSub">
                             <FormattedMessage id="OrderHistory.Totalamount" defaultMessage="Total amount" />
                           </p>
                        
                        </div>
                        <div className="col-6">
                           <div className="orderTatalAmt">
                              <p className="orderper">
                                 <span className="orderperLabl">{orders_details.order_summary.currency}</span> <span className="orderperLabl">{orders_details.order_summary.grand_total}</span>
                              </p>
                            
                           </div>
                        </div>
                        </div>
                     </div>
                     <p className="head-summary"><FormattedMessage id="OrderHistory.help" defaultMessage="help" /></p>
                     <div className="orderSumDiv">
                     <div className="row">
                        <div className="col-12">
                           <p className="help">
                           <FormattedMessage id="OrderHistory.contact" defaultMessage="If you have any question please contact customer service at " />
                           <a href="tel:8001180009"><FormattedMessage id="OrderHistory.contactno" defaultMessage="8001180009 " /></a><FormattedMessage id="OrderHistory.contactemail" defaultMessage=" or send an email to  " /><a href="mailto:help@lego.saudistore.com" target="_top">help@lego.saudistore.com</a>
                           </p>
                        
                        </div>
                      
                        </div>
                     </div>
               </div>
            </div>
            {/* <div className="col-md-4">
               <Needhelp />
            </div> */}
         </div>
      </div>}
   </div>
</div>
)
}
}
const mapStateToProps = state => {
   return {
      user_details: state.login,
      globals: state.global,
      orders_details: state.orders.orders_details,
      order_summary: state.orders.orders_details.order_summary,
      orderLoader:state.orders.orders_details_loader

   };
}
const mapDispatchToProps = dispatch => {
   return {
      onGetOrderDetailsInProfile: (payload) => dispatch(actions.viewOrderDetails(payload)),

   }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(OrderNumber)));
