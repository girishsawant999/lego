import React, { Component } from 'react';
import Slider from "react-slick";
import Collapsible from 'react-collapsible';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.css';
//import feature1 from '../../assets/images/feature1.jpeg';
// import footerLogo from '../../assets/images/icons/footerLogo.png';
// import fbLogo from '../../assets/images/icons/facebook.png';
// import instaLogo from '../../assets/images/icons/instagram.png';
// import PlusIcon from '../../assets/images/icons/arrowDown.png';
// import minusIcon from '../../assets/images/icons/arrowDown.png';
// import paypalIcon from '../../assets/images/icons/paypal.png';
// import cardblock from '../../assets/images/quicklink2.jpeg';
import { FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"



class ThankyouSidebar extends Component {
    constructor(props) {
        super(props);
    }
    closeOther = (value) => {
        let collapses = document.getElementsByClassName('open');
        for (let i = 0; i < collapses.length; i++) {
            collapses[i].click();
        }
    }
    render() {
        return (
            <div>
                <div className="thankSidebar-right">
                    <div className="sidebar-space">
                        <div className="OrderSummaryTitle">
                        <FormattedMessage id="thanku.Yourorder" defaultMessage="Your order" /> ({this.props.product_data.length} <FormattedMessage id="cart.items" defaultMessage="items" />)</div>
                        <hr />
                        {this.props.product_data && this.props.product_data.map((item, index) => (
                        <>
                            {item.price === 0 && <div className="border-div">
                                <div className="productDescLine mb-2">
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
                            </div>}
                        </>
                        ))}
                        {this.props.product_data && this.props.product_data.map((item, index) => (
                            <>
                            {item.price !== 0 && <div className="border-div">
                                <div className="grid-spaceing">

                                    <div className="ljELlj">
                                        <div className="prod-img">
                                            <Link  to={`/${this.props.globals.store_locale}/productdetails/${item.url_key}`}>
                                                <img src={item.image} className="ProductRowstyles__Image-cbbmmq-2 jxxiQH" alt="productImg"/>
                                            </Link></div>
                                        <div className="productdesc">
                                            <Link to={`/${this.props.globals.store_locale}/productdetails/${item.url_key}`} className="mb-1">
                                                <span color="black" className="textUp">
                                                    {item.name}
                                                </span>
                                            </Link>
                                            <span color="grey" className="product-id"><span>{item.sku}</span></span>
                                            <div className="vvv">
                                                <p color="green" className="available-option">
                                                    <span className="available-label">
                                                    <FormattedMessage id="pdp.available_Now" defaultMessage="Available now" />
                                                    </span></p>
                                                <p color="grey" className="qtylabel">
                                                <FormattedMessage id="cart.Qty" defaultMessage="Qty" />
                                                : {parseInt(item.qty_orderded)}</p>
                                                <div className="price">
                                                    {!item.special_price || parseInt(item.special_price) === 0 ?
                                                        <span className="price-label"><span className="zzz">{item.currency}</span>&nbsp;{item.price}</span> :
                                                        <span className="price-label"> <span style={{ textDecoration: 'line-through' }}>{`${item.currency} ${item.price}`}</span> &nbsp;
																				<span>{`  ${item.currency} ${parseInt(item.special_price)}`}</span></span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            </>
                            ))}
                            <div className="orderTotal pb-3">
                            <div className="OrderSummaryTitle">
                            <FormattedMessage id="thanku.OrderSummary" defaultMessage="Order Summary" />
                            </div>
                            <hr />
                            <div className="subtotal-box">
                                <span className="left-desc">{this.props.product_data.length + ' '} 
                                <FormattedMessage id="cart.items" defaultMessage="items" />
                                </span>
                                <span className="left-desc">
                                    <span className="priceSubTotal">{this.props.order_summary && this.props.order_summary.currency} &nbsp;{this.props.order_summary && this.props.order_summary.subtotal && this.props.order_summary.subtotal}</span>
                                </span>
                            </div>
                            <div className="subtotal-box">
                                <span className="left-desc">
                                <FormattedMessage id="checkOutProcessorderSummary.StandardShipping" defaultMessage="Standard Shipping" />
                                </span>
                                <span className="left-desc">
                                {this.props.order_summary && this.props.order_summary.shipping != 0 &&
                                 <span className="priceSubTotal">
                                {`${this.props.order_summary.currency} ${this.props.order_summary.shipping}`}
                                    </span>}
                                {this.props.order_summary && this.props.order_summary.shipping == 0 &&
                                 <span className="priceSubTotal">
                                 <FormattedMessage id="checkoutOrderSummary.Free" defaultMessage="Free" />
                                    </span>}
                                </span>
                            </div>
                            {this.props.order_summary.COD!==0 &&
                            <div className="subtotal-box pb-2">
                                <span className="left-desc">COD</span>
                                <span className="left-desc">
                                   
                                {this.props.order_summary && this.props.order_summary.COD && <span className="priceSubTotal">
                                {`${this.props.order_summary.currency} ${this.props.order_summary.COD}`}  </span>}
                                </span>
                            </div>}
                            {this.props.order_summary && this.props.order_summary.savings > 0 && 
                            <div className="subtotal-box pb-2">
                                <span className="left-desc">
                                <FormattedMessage id="checkOutProcessorderSummary.Saving" defaultMessage="Saving" />
                                </span>
                                <span className="left-desc">
                                   
                                    <span className="priceSubTotal">
                                   {this.props.order_summary.savings}
                                       </span>
                                </span>
                            </div>}
                           
                            {this.props.order_summary && this.props.order_summary.voucher_discount > 0 && <div className="subtotal-box pb-2">
                                <span className="left-desc">
                                <FormattedMessage id="checkOutProcessorderSummary.voucherDis" defaultMessage="Voucher Discount" />
                                </span>
                                <span className="left-desc">
                                   
                                {this.props.order_summary && this.props.order_summary.voucher_discount && this.props.order_summary.voucher_discount > 0 && 
                                <span className="priceSubTotal"> {`${this.props.order_summary.currency} ${this.props.order_summary.voucher_discount}`}
                                     </span>}
                                </span>
                            </div>}
                            <hr />
                            <div className="subtotal-box">
                                <span className="left-desc extra-weight">
                                <FormattedMessage id="profile.OrderTotal.Title" defaultMessage="Order Total" />
                                </span>
                                <span className="left-desc">
                                    <span className="priceSubTotal extra-weight">{this.props.order_summary && this.props.order_summary.currency} &nbsp;{this.props.order_summary && this.props.order_summary.total && this.props.order_summary.total}</span>
                                </span>

                            </div>
                            <span className="left-desc tagItalic">
                            <FormattedMessage id="thanku.Inclusiveof" defaultMessage="Inclusive of " />
                             {this.props.order_summary && this.props.order_summary.currency} &nbsp;{this.props.order_summary && this.props.order_summary.vat && this.props.order_summary.vat} VAT </span>
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
	}
}
export default connect(mapStateToProps)(withRouter(ThankyouSidebar))
