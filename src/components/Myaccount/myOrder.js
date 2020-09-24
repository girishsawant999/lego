import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Spinner from "../Spinner/Spinner"
import * as actions from '../../redux/actions/index';
import MyAccSideBar from '../Myaccount/MyAccSideBar';
import { createMetaTags } from '../utility/meta'
 
const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
const Cryptr = require('cryptr');
let cryptr = null;
class MyOrder extends Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		if (!this.props.user_details.customer_details.customer_id) {
			this.props.history.push(`/${this.props.globals.store_locale}/login`)
			return
        } else {
            this.props.onGetOrderHistory({ 
                Customerid: this.props.user_details.customer_details.customer_id,
                store_id: this.props.globals.currentStore
             })
        }
	}

	componentDidMount() {
		$("#myOrder").addClass("ActiveClass")
	}
	logout = () => {
		this.props.onLogoutUser()
		this.props.history.push(`/${this.props.globals.store_locale}/home`);
	}
    
    render() {
        const store_locale = this.props.globals.store_locale
        let orders_details = this.props.orderHistory;
        cryptr = new Cryptr("legoOrderId");
        let orderList = this.props.orderHistory.map((item, index) => {
            return (
                <tr>
                    <td>{(new Date(item.order_date)).toLocaleDateString('en-US', DATE_OPTIONS)}</td>
                    <td id="cursor" className="center">
                        <Link to={`/${store_locale}/order-number/${cryptr.encrypt(item.order_id)}`}>{item.order_increment_id}
                        </Link>
                    </td>
                    <td className="center">{item.shipping_type}</td>
                    <td className="center">{item.payment_type}</td>
                    <td className="center">{item.currency}&nbsp;{item.order_total}</td>
                   <td><a onClick={()=> window.open("https://track.aftership.com/", "_blank")}>  <button className="trackPkg"><FormattedMessage id="profile.TrackPackage.Title" defaultMessage="Track Package" /></button></a></td> 
                </tr>)
        });

        return (
            <div>
                {createMetaTags(
					this.props.globals.store_locale === "en"
						? "My Order | Official LEGO® Online Myord Saudi Arabia"
						: "طلبي | متجر ليغو أونلاين الرسمي بالسعودية ",
					this.props.globals.store_locale === "en"
						? "Explore the world of LEGO® through games, videos, products and more! Shop awesome LEGO® building toys and brick sets and find the perfect gift for your kid"
						: "اكتشف عالم ليغو LEGO من خلال الألعاب، والفيديوهات، والمنتجات وأكثر! تسوق مجموعات ألعاب البناء و المكعبات المدهشة من ليغو LEGO واعثر على الهدية المثالية لطفلك",
					this.props.globals.store_locale === "en"
						? "LEGO, Online Store, Saudi Arabia, Bricks, Building Blocks, Construction Toys, Gifts"
						: "ليغو LEGO، تسوق اونلاين، السعودية، مكعبات، مكعبات بناء، العاب تركيب، هدايا"
				)}
                <div className="row">
                    <div className="col-md-3 sideBarContent">
                        <MyAccSideBar />

                    </div>

                    <div className="col-md-9 pdL">
                        <div className="rightSideContent">
                            <div className="MyOrder">
                                <div className="row">
                                    <div className="col-md-6 col-6">
                                        <p className="accountTitle"><FormattedMessage id="profile.MyOrder.Title" defaultMessage="My Order" /></p>
                                    </div>
                                    <div className="col-md-6 col-6">
                                        <div  className="LogOutDiv">
                                            <button onClick={()=>this.logout()} className=""><FormattedMessage id="profile.Logout.Title" defaultMessage="Logout" /></button>
                                        </div>
                                    </div>
                                </div>
                                {orders_details.length > 0 ? <div className="table-responsive">
                                     <table className="table table-striped SummaryTable">

                                    <thead>
                                        <tr>
                                        <th><FormattedMessage id="profile.OrderDate.Title" defaultMessage="Order Date" /></th>
                                                <th className="center"><FormattedMessage id="profile.OrderNumber.Title" defaultMessage="Order Number" /></th>
                                                <th className="center"><FormattedMessage id="profile.ShippingType.Title" defaultMessage="Shipping type" /></th>
                                                <th className="center"><FormattedMessage id="profile.PaymentType.Title" defaultMessage="Payment type" /></th>
                                                <th className="center"><FormattedMessage id="profile.OrderTotal.Title" defaultMessage="Order Total" /></th>
                                                <th className="center"><FormattedMessage id="profile.Tracking.Title" defaultMessage="Tracking" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {orderList}
                                       
                                       
                                    </tbody>
                                </table></div> : 
                               this.props.loading ? 
                                <Spinner/>
                                :
                                <div className="WarnDiv">
                                    <p className="WarnMessage"><FormattedMessage id="NoData.Text" defaultMessage="No Data available." /></p>
                                </div>
                                
                                }
                                


                                {/* <th>Price</th>
                                    <th>Qty</th> */}
                                {/* <th>Order Total</th>
                                    <th>Tracking</th> */}
                                
                                    {orders_details.length > 0 && orders_details.map((item, index) => {
                                        return (
                                            <div className="summaryMobile">
                                            <div className={(index % 2 == 0 ? "even" : "odd") + ' cardBox'}>
                                                <div className="row">
                                                    <div className="col-6 alignLeft">
                                                        <div className="DataTabs">
                                                            <p className="LabelHead"><FormattedMessage id="profile.OrderDate.Title" defaultMessage="Order Date" /></p>
                                                            <p className="LabelData">{(new Date(item.order_date)).toLocaleDateString('en-US', DATE_OPTIONS)}</p>
                                                        </div>
                                                        <div className="DataTabs">
                                                            <p className="LabelHead"><FormattedMessage id="profile.OrderNumber.Title" defaultMessage="Order Number" /></p>
                                                            <p className="LabelData">
                                                            <Link to={`/${store_locale}/order-number/${cryptr.encrypt(item.order_id)}`}>{item.order_increment_id}</Link>
                                                            {/*{item.order_increment_id}*/}
                                                            </p>
                                                        </div>
                                                        <div className="DataTabs">
                                                            <p className="LabelHead"><FormattedMessage id="profile.ShippingType.Title" defaultMessage="Shipping Type" /></p>
                                                            <p className="LabelData">{item.shipping_type}</p>
                                                        </div>

                                                    </div>
                                                    <div className="col-6 alignRight">
                                                        <div className="DataTabs">
                                                            <p className="LabelHead"><FormattedMessage id="profile.PaymentType.Title" defaultMessage="Payment Type" /></p>
                                                            <p className="LabelData">{item.payment_type}</p>
                                                        </div>
                                                        <div className="DataTabs">
                                                            <p className="LabelHead"><FormattedMessage id="profile.OrderTotal.Title" defaultMessage="Order Total" /></p>
                                                            <p className="LabelData">{item.currency}&nbsp;{item.order_total}</p>
                                                        </div>
                                                        <div className="DataTabs">
                                                            <p className="LabelHead"><FormattedMessage id="profile.Tracking.Title" defaultMessage="Tracking" /></p>
                                                            <p className="LabelData"><a  onClick={()=> window.open("https://track.aftership.com/", "_blank")}>  <button className="trackPkg">Track Package</button></a></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    })}
                               


                                
                                    
                                    {/* <div className="totalAll">
        <div className="row">
            <div className="col-6 dataLeftDiv">
                <p className="SubTotal">Subtotal</p>
                <p className="SubTotal">Discount</p>
                <p className="SubTotal">Shipping</p>
                <p className="orderTotal">Order Total</p>
                <p className="vatTotal">inclusive of <span>24 VAT</span></p>
            </div>
            <div className="col-6 dataRightDiv">
                <p className="SubTotal"><span>GBP</span><span> 21.35</span></p>
                <p className="SubTotal reCol"><span>GBP</span><span> 21.35</span></p>
                <p className="SubTotal"><span>GBP</span><span> 21.35</span></p>
                <p className="orderTotal"><span>GBP</span><span> 21.35</span></p>
            </div>
        </div>
    </div> */}
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
        globals: state.global,
        user_details: state.login,
        orderHistory: state.orders.orders_history,
        loading: state.orders.loading,
        is_order_history_rec: state.orders.is_order_history_rec,
    };
}
const mapDispatchToProps = dispatch => {
    return {
        onGetOrderHistory: (payload) => dispatch(actions.getOrderHistory(payload)),
        onLogoutUser:()=>dispatch(actions.logoutUser())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(MyOrder)));
