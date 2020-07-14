import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Ordersummary from '../checkOutProcess/checkOutProcessorderSummary';

class CartListView extends Component {
    constructor(props) {
        super(props);
        
    }

    redirectToSignIn = () => {
        this.props.history.push(`/${this.props.globals.store_locale}/login?checkout`);
    }

    redirectToRegister = () => {
        this.props.history.push(`/${this.props.globals.store_locale}/register?checkout`);
    }

    guestCheckout = () => {
        this.props.guestCheckoutStart();
    }

    render() {
        return (
            <div>
                <div className="checkOutProcess">
                    <div className="cart-grid">
                    <div className="container">
                        
                        <div className="row">
                            <div className="col-md-8">
                                <div className="row">
                                <div className="col-md-6">
                                    <div className="newCustomer">
                                            <h1 className="customerTitle"><FormattedMessage id="cartListView.NewCustomer" defaultMessage="New Customer" /></h1>
                                            <span className="cutomerSubTitle">
                                                <FormattedMessage 
                                                    id="cartListView.ContinueCheckoutAsGuestOrRegister" 
                                                    defaultMessage="Continue Checkout as a Guest or Register" />
                                            </span>
                                            <button className="customerBtn" 
                                                onClick={() => this.guestCheckout()}>
                                                <FormattedMessage id="cartListView.ContinueGuest" defaultMessage="Continue as Guest" />
                                                </button>
                                            <button 
                                                onClick={() => this.redirectToRegister()}
                                                className="customerBtn"><FormattedMessage id="cartListView.Register" defaultMessage="Register" /></button>
                                    </div>
                                </div>
                                <div className="col-md-12 nopadding d-block d-sm-none"><hr /></div>
                                <div className="col-md-6">
                                        <div className="newCustomer">
                                            <h1 className="customerTitle"><FormattedMessage id="cartListView.ReturningCustomer" defaultMessage="Returning Customer" /></h1>
                                            <span className="cutomerSubTitle"><FormattedMessage id="cartListView.accessVIP" defaultMessage="Access your VIP points & saved information." /></span>
                                            <button 
                                                onClick={() => this.redirectToSignIn()}
                                                className="customerBtn">
                                                <FormattedMessage id="cartListView.SignIn" defaultMessage="Sign In" />
                                            </button>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="StepContainer">
                                            <hr />
                                            <div className="step-section">
                                                <div className="StepBadge">
                                                    <div type="disabled" className="StatusIconCircle">
                                                        <span color="grey_medium" className="StatusIconText"><FormattedMessage id="cartListView.one" defaultMessage="1" /></span>
                                                    </div>
                                                    <span color="grey_medium" className="StatusTitle"><FormattedMessage id="cartListView.Shipping" defaultMessage="Shipping" /></span>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="step-section">
                                                <div className="StepBadge">
                                                    <div type="disabled" className="StatusIconCircle">
                                                        <span color="grey_medium" className="StatusIconText"><FormattedMessage id="cartListView.two" defaultMessage="2" /></span>
                                                    </div>
                                                    <span color="grey_medium" className="StatusTitle"><FormattedMessage id="cartListView.Contactinformation" defaultMessage="Contact information" /></span>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="step-section">
                                                <div className="StepBadge">
                                                    <div type="disabled" className="StatusIconCircle">
                                                        <span color="grey_medium" className="StatusIconText"><FormattedMessage id="cartListView.three" defaultMessage="3" /></span>
                                                    </div>
                                                    <span color="grey_medium" className="StatusTitle"><FormattedMessage id="cartListView.Payment" defaultMessage="Payment" /></span>
                                                </div>
                                            </div>
                                            <hr />
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
                {/* <div>
                    withOut login div
                </div>
                <div>
                   After Login div show
                </div> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	return {
		globals: state.global,
		user_details: state.login,
		myCart: state.myCart
	}
}
const mapDispatchToProps = (dispatch) => {
	return {

   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CartListView)));
