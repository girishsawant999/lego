import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.css';
import cardblock from '../../assets/images/quicklink2.jpeg';
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import * as actions from "../../redux/actions/index"
import { Link } from "react-router-dom"

class OrderSummary extends Component {
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

        let { myCart } = this.props;
        let products = myCart && myCart.products;

        return (
            <div>
                <div className="ordersummaryCheckOut-right">
                    <div className="sidebar-space">
                        <div className="OrderSummaryTitle"><FormattedMessage id="checkOutProcessorderSummary.OrderSummary" defaultMessage="Order Summary" /></div>
                        <hr />
                        <div className="subtotal-box">
                            <span className="left-desc"><FormattedMessage id="checkOutProcessorderSummary.Subtotal" defaultMessage="Subtotal" /></span>
                            <span className="left-desc">
                                <span className="priceSubTotal">{myCart.currency} {' '} {myCart.subtotal}</span>
                            </span>
                        </div>
                        {this.props.location.pathname.includes('/checkoutPaymentMethod') && !this.props.shipping.isClickAndCollect &&
                        <div className="subtotal-box">
                            <span className="left-desc"><FormattedMessage id="checkOutProcessorderSummary.StandardShipping" defaultMessage="Standard Shipping" /></span>
                            <span className="left-desc">
                               {myCart.shipping_amount === 0 && <span className="priceSubTotal">
                               <FormattedMessage id="checkOutProcessorderSummary.Free" defaultMessage="Free" /></span>}
                               {myCart.shipping_amount > 0 && <span className="priceSubTotal">
                               {myCart.currency} {' '} {myCart.shipping_amount}
                               </span>}
                            </span>
                        </div>}
                        { myCart.voucher_discount > 0 && myCart.discount_amount > 0 && <div className="subtotal-box">
                            <span className="left-desc">
                            <FormattedMessage id="checkOutProcessorderSummary.Saving" defaultMessage="Saving" /></span>
                            <span className="left-desc">
                                <span className="priceSubTotal">{myCart.currency} {' '} {myCart.discount_amount}</span>
                            </span>
                        </div>}
                        {myCart.voucher_discount > 0 && <div className="subtotal-box">
                            <span className="left-desc">
                            <FormattedMessage id="checkOutProcessorderSummary.voucherDis" defaultMessage="Voucher Discount" /></span>
                            <span className="left-desc">
                                <span className="priceSubTotal">{myCart.currency} {' '} {myCart.voucher_discount}</span>
                            </span>
                        </div>}
                        {this.props.Ptype && this.props.Ptype === 'COD' && myCart.payment_details
                         && myCart.payment_details.cashondelivery && myCart.payment_details.cashondelivery.charges > 0 && 
                        <div className="subtotal-box">
                            <span className="left-desc">
                            <FormattedMessage id="checkOutProcessorderSummary.COD_Charge" defaultMessage="COD Charges" /></span>
                            <span className="left-desc">
                                <span className="priceSubTotal">{myCart.currency} {' '} {myCart.payment_details.cashondelivery.charges}</span>
                            </span>
                        </div>}
                        <div className="subtotal-box">
                            <span className="left-desc extra-weight"><FormattedMessage id="checkOutProcessorderSummary.OrderTotal" defaultMessage="Order Total" /></span>
                            <span className="left-desc">
                                <span className="priceSubTotal extra-weight">{myCart.currency} {' '} {myCart.grand_total}</span>
                            </span>
                        </div>
                        {/* {myCart.tax_amount > 0 && <div className="subtotal-box">
                            <span className="left-desc">
                                <FormattedMessage id="checkout.vatInclude" defaultMessage="VAT 5% included" />
                                <span className="left-desc">
                                    <span className="priceSubTotal extra-weight"> {myCart.currency}{myCart.tax_amount}</span>
                                </span>
                            </span>
                        </div>} */}
                        {products && products.map((item, index) => {
                            return (
                            <>
                            {item.price === 0 && <div className="border-div">
                                <div className="productDescLine mb-2">
                                    <div className="row">
                                        <div className="descBackgroudPro">
                                            <img className="img-left" src={item.image[0]} alt="banner1" />
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
                        )})}

                        {products && products.map((item, index) => {
                            return (
                                <>
                                {item.price !== 0 && <div className="border-div">
                                    <div className="grid-spaceing">

                                        <div className="ljELlj">
                                            <div className="prod-img">
                                            <Link to={`/${this.props.globals.store_locale}/productdetails/${item.url_key}`}>
                                                <img src={item.image[0]} alt="product"/>
                                            </Link>
                                            </div>
                                            <div className="productdesc">
                                                <Link to={`/${this.props.globals.store_locale}/productdetails/${item.url_key}`} className="mb-1">
                                                    <span color="black" className="textUp">
                                                        {item.name}
                                                        {/* <FormattedMessage id="checkOutProcessorderSummary.DeluxeBrickBox" defaultMessage="Deluxe Brick Box" /> */}
                                                    </span>
                                                </Link>
                                                <span color="grey" className="product-id"><span>{item.id}</span></span>
                                                <div className="vvv">
                                                    <p color="green" className="available-option">
                                                        <span className="available-label">{item.is_in_stock.message}</span></p>
                                                    <p color="grey" className="qtylabel">{ this.props.globals.store_locale === "en" ? "Qty:": "الكمية:" } {item.qty}</p>
                                                    {item.special_price && parseInt(item.special_price) !== 0 ? <div className="price">
                                                        <span className="price-label" style={{ textDecoration: 'line-through' }}><span className="zzz">{item.currency}{' '}</span>{item.price}</span>{' '}
                                                        <span className="price-label"><span className="zzz">{item.currency}{' '}</span>{item.special_price}</span>
                                                    </div>
                                                        : <div className="price">
                                                            <span className="price-label"><span className="zzz">{item.currency}{' '}</span>{item.price}</span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                                </>
                            )
                        })}

                        <div className="subtotal-box py-2">
                            <span className="left-desc extra-weight"><FormattedMessage id="checkOutProcessorderSummary.OrderTotal" defaultMessage="Order Total" /></span>
                            <span className="left-desc">
                                <span className="priceSubTotal extra-weight">{myCart.currency}{' '}{myCart.grand_total}</span>
                            </span>
                        </div>



                    </div>
                </div>


            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        recommended_data: state.global.recommended_data,
        globals: state.global,
        user_details: state.login,
        myCart: state.myCart,
        guest_user: state.guest_user,
        shipping: state.shipping,
        shippingSuccess: state.myCart.shippingSuccess,
    }
}

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderSummary));