import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from '../../../node_modules/react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import CartList from '../checkOutProcess/cartListView';
import Shipping from '../checkOutProcess/shipping';
//import Breadcrumb from '../../common/breadcrumb';
import orderSummary from '../../components/checkOutProcess/checkOutProcessorderSummary';
import * as actions from "../../redux/actions/index";
import Spinner2 from "../Spinner/Spinner2";

class CheckOutprocess extends Component {
   constructor(props) {
       super(props);
       this.state = {
           guestCheckout: false
       }
   }

   componentDidMount = () => {
        if ((!this.props.country.countryList) || (this.props.country.countryList && 
            this.props.country.countryList.length === 0)) {
            this.props.onGetCountryList();
        }
    }

    guestCheckoutStart = () => {
        this.props.startGuestCheckout();
        this.setState({
            guestCheckout: true
        });
    }
   
   render() {
        const { globals, user_details } = this.props;
        const { guestCheckout } = this.state;
        if (globals.loading) {
            return (
                <div className="mobMinHeight">
                    <Spinner2 />
                </div>
            )
        }
       return (
           <div>
                <div className="CheckOutProcess">
                <orderSummary />  
                {!user_details.isUserLoggedIn && !guestCheckout && <CartList guestCheckoutStart={this.guestCheckoutStart}/>}
                {(user_details.isUserLoggedIn || guestCheckout) && <Shipping />}
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
        country: state.country
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
        onGetCountryList: () => dispatch(actions.getCountryList()),
        startGuestCheckout: () => dispatch(actions.startGuestCheckout()),
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CheckOutprocess)));